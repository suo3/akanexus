import { useState, useRef, useCallback, useEffect } from 'react';
import { encodeToMp3, ExportFormat } from '@/utils/mp3Encoder';

export interface EQBand {
  frequency: number;
  gain: number;
  Q: number;
  label: string;
}

export interface MasteringSettings {
  eqBands: EQBand[];
  compression: {
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
  };
  limiter: {
    threshold: number;
    ceiling: number;
  };
  stereoWidth: number;
  outputGain: number;
}

const DEFAULT_EQ_BANDS: EQBand[] = [
  { frequency: 60, gain: 0, Q: 1, label: '60 Hz' },
  { frequency: 170, gain: 0, Q: 1, label: '170 Hz' },
  { frequency: 350, gain: 0, Q: 1, label: '350 Hz' },
  { frequency: 1000, gain: 0, Q: 1, label: '1 kHz' },
  { frequency: 3500, gain: 0, Q: 1, label: '3.5 kHz' },
  { frequency: 10000, gain: 0, Q: 1, label: '10 kHz' },
];

const DEFAULT_SETTINGS: MasteringSettings = {
  eqBands: DEFAULT_EQ_BANDS,
  compression: {
    threshold: -24,
    ratio: 4,
    attack: 0.003,
    release: 0.25,
  },
  limiter: {
    threshold: -1,
    ceiling: -0.3,
  },
  stereoWidth: 100,
  outputGain: 0,
};

export function useAudioProcessor() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProcessed, setIsProcessed] = useState(false);
  const [settings, setSettings] = useState<MasteringSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const eqNodesRef = useRef<BiquadFilterNode[]>([]);
  const compressorNodeRef = useRef<DynamicsCompressorNode | null>(null);
  const limiterNodeRef = useRef<DynamicsCompressorNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const stereoWidthGainRef = useRef<GainNode | null>(null); // controls the Side gain in M/S
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  // Monotonically-increasing ID so stale rAF loops self-terminate
  const loopIdRef = useRef<number>(0);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const generateWaveformData = useCallback((buffer: AudioBuffer) => {
    const rawData = buffer.getChannelData(0);
    const samples = 150;
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData: number[] = [];

    for (let i = 0; i < samples; i++) {
      const start = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[start + j] || 0);
      }
      filteredData.push(sum / blockSize);
    }

    const maxVal = Math.max(...filteredData);
    const normalized = filteredData.map(val => val / maxVal);
    setWaveformData(normalized);
  }, []);

  const loadAudioFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setAudioFile(file);

    try {
      const ctx = getAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
      setDuration(buffer.duration);
      setCurrentTime(0);
      setIsProcessed(false);
      generateWaveformData(buffer);
    } catch (error) {
      console.error('Error loading audio file:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAudioContext, generateWaveformData]);

  const createProcessingChain = useCallback((ctx: AudioContext, source: AudioBufferSourceNode) => {
    // Create gain node for output volume
    const gainNode = ctx.createGain();
    gainNode.gain.value = Math.pow(10, settings.outputGain / 20);
    gainNodeRef.current = gainNode;

    // Create EQ filters
    const eqNodes: BiquadFilterNode[] = [];
    settings.eqBands.forEach((band, index) => {
      const filter = ctx.createBiquadFilter();
      filter.type = index === 0 ? 'lowshelf' : index === settings.eqBands.length - 1 ? 'highshelf' : 'peaking';
      filter.frequency.value = band.frequency;
      filter.gain.value = band.gain;
      filter.Q.value = band.Q;
      eqNodes.push(filter);
    });
    eqNodesRef.current = eqNodes;

    // Create compressor
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = settings.compression.threshold;
    compressor.ratio.value = settings.compression.ratio;
    compressor.attack.value = settings.compression.attack;
    compressor.release.value = settings.compression.release;
    compressor.knee.value = 6;
    compressorNodeRef.current = compressor;

    // Create limiter (using compressor with high ratio)
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = settings.limiter.threshold;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.1;
    limiter.knee.value = 0;
    limiterNodeRef.current = limiter;

    // Create analyser for visualization
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    analyserNodeRef.current = analyser;

    // ── M/S Stereo Width ──────────────────────────────────────────────────
    // Only possible for stereo sources; mono sources pass through untouched.
    const buildStereoWidth = (ctx: AudioContext, inputNode: AudioNode): AudioNode => {
      const widthFactor = settings.stereoWidth / 100; // 0=mono, 1=unity, 2=double
      // If the input is mono (1 ch) or width is unity, skip processing
      if (widthFactor === 1) return inputNode;

      const splitter = ctx.createChannelSplitter(2);
      const merger = ctx.createChannelMerger(2);

      // Mid = (L + R) * 0.5  |  Side = (L - R) * 0.5 * widthFactor
      const midL = ctx.createGain(); midL.gain.value = 0.5;
      const midR = ctx.createGain(); midR.gain.value = 0.5;
      const sideL = ctx.createGain(); sideL.gain.value = 0.5 * widthFactor;
      const sideR = ctx.createGain(); sideR.gain.value = -0.5 * widthFactor;
      stereoWidthGainRef.current = sideL; // exposed for live updates

      inputNode.connect(splitter);
      // Left channel
      splitter.connect(midL, 0); splitter.connect(sideL, 0);
      // Right channel
      splitter.connect(midR, 1); splitter.connect(sideR, 1);
      // Re-combine: outL = midL + sideL,  outR = midR + sideR
      midL.connect(merger, 0, 0); sideL.connect(merger, 0, 0);
      midR.connect(merger, 0, 1); sideR.connect(merger, 0, 1);

      return merger;
    };

    // Connect the chain
    if (isProcessed) {
      let currentNode: AudioNode = source;

      // Connect EQ chain
      eqNodes.forEach(filter => {
        currentNode.connect(filter);
        currentNode = filter;
      });

      // Connect compressor
      currentNode.connect(compressor);
      compressor.connect(limiter);
      limiter.connect(gainNode);

      // Stereo width → analyser → destination
      const widthOut = buildStereoWidth(ctx, gainNode);
      widthOut.connect(analyser);
      analyser.connect(ctx.destination);
    } else {
      // Bypass processing
      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);
    }
  }, [settings, isProcessed]);

  const play = useCallback(() => {
    if (!audioBuffer) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop any existing playback and kill the old rAF loop
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (_) {/* already stopped */ }
      sourceNodeRef.current.disconnect();
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    sourceNodeRef.current = source;

    createProcessingChain(ctx, source);

    const offset = pauseTimeRef.current;
    startTimeRef.current = ctx.currentTime - offset;
    source.start(0, offset);
    setIsPlaying(true);

    source.onended = () => {
      if (ctx.currentTime - startTimeRef.current >= audioBuffer.duration - offset) {
        setIsPlaying(false);
        pauseTimeRef.current = 0;
        setCurrentTime(0);
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
    };

    // Stamp a unique ID for this play session so stale loops self-terminate
    const myLoopId = ++loopIdRef.current;
    const updateTime = () => {
      // Bail out if a newer loop has started
      if (myLoopId !== loopIdRef.current) return;
      if (audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
        setCurrentTime(Math.min(Math.max(elapsed, 0), audioBuffer.duration));
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [audioBuffer, getAudioContext, createProcessingChain]);

  const pause = useCallback(() => {
    if (sourceNodeRef.current && audioContextRef.current) {
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      // Invalidate the running loop before stopping the source
      loopIdRef.current++;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      try { sourceNodeRef.current.stop(); } catch (_) {/* already stopped */ }
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback((time: number) => {
    const wasPlaying = isPlaying;
    if (isPlaying) {
      pause();
    }
    pauseTimeRef.current = time;
    setCurrentTime(time);
    if (wasPlaying) {
      play();
    }
  }, [isPlaying, pause, play]);

  const toggleProcessing = useCallback(() => {
    const wasPlaying = isPlaying;
    const currentPosition = pauseTimeRef.current || (audioContextRef.current ? audioContextRef.current.currentTime - startTimeRef.current : 0);

    if (wasPlaying && sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    // Store position before toggling
    pauseTimeRef.current = currentPosition;

    setIsProcessed(prev => {
      const newValue = !prev;

      // Restart playback after state update if was playing
      if (wasPlaying && audioBuffer) {
        setTimeout(() => {
          const ctx = getAudioContext();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          sourceNodeRef.current = source;

          // Rebuild processing chain with new isProcessed value
          const gainNode = ctx.createGain();
          gainNode.gain.value = Math.pow(10, settings.outputGain / 20);
          gainNodeRef.current = gainNode;

          const eqNodes: BiquadFilterNode[] = [];
          settings.eqBands.forEach((band, index) => {
            const filter = ctx.createBiquadFilter();
            filter.type = index === 0 ? 'lowshelf' : index === settings.eqBands.length - 1 ? 'highshelf' : 'peaking';
            filter.frequency.value = band.frequency;
            filter.gain.value = band.gain;
            filter.Q.value = band.Q;
            eqNodes.push(filter);
          });
          eqNodesRef.current = eqNodes;

          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.value = settings.compression.threshold;
          compressor.ratio.value = settings.compression.ratio;
          compressor.attack.value = settings.compression.attack;
          compressor.release.value = settings.compression.release;
          compressor.knee.value = 6;
          compressorNodeRef.current = compressor;

          const limiter = ctx.createDynamicsCompressor();
          limiter.threshold.value = settings.limiter.threshold;
          limiter.ratio.value = 20;
          limiter.attack.value = 0.001;
          limiter.release.value = 0.1;
          limiter.knee.value = 0;
          limiterNodeRef.current = limiter;

          const analyser = ctx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.8;
          analyserNodeRef.current = analyser;

          // Connect based on newValue (the toggled state)
          if (newValue) {
            let currentNode: AudioNode = source;
            eqNodes.forEach(filter => {
              currentNode.connect(filter);
              currentNode = filter;
            });
            currentNode.connect(compressor);
            compressor.connect(limiter);
            limiter.connect(gainNode);
            // M/S width in processed mode
            const widthFactor = settings.stereoWidth / 100;
            if (widthFactor !== 1) {
              const splitter = ctx.createChannelSplitter(2);
              const merger = ctx.createChannelMerger(2);
              const midL = ctx.createGain(); midL.gain.value = 0.5;
              const midR = ctx.createGain(); midR.gain.value = 0.5;
              const sideL = ctx.createGain(); sideL.gain.value = 0.5 * widthFactor;
              const sideR = ctx.createGain(); sideR.gain.value = -0.5 * widthFactor;
              stereoWidthGainRef.current = sideL;
              gainNode.connect(splitter);
              splitter.connect(midL, 0); splitter.connect(sideL, 0);
              splitter.connect(midR, 1); splitter.connect(sideR, 1);
              midL.connect(merger, 0, 0); sideL.connect(merger, 0, 0);
              midR.connect(merger, 0, 1); sideR.connect(merger, 0, 1);
              merger.connect(analyser);
            } else {
              gainNode.connect(analyser);
            }
            analyser.connect(ctx.destination);
          } else {
            source.connect(gainNode);
            gainNode.connect(analyser);
            analyser.connect(ctx.destination);
          }

          startTimeRef.current = ctx.currentTime - currentPosition;
          source.start(0, currentPosition);
          setIsPlaying(true);

          source.onended = () => {
            if (ctx.currentTime - startTimeRef.current >= audioBuffer.duration - currentPosition) {
              setIsPlaying(false);
              pauseTimeRef.current = 0;
              setCurrentTime(0);
            }
          };

          const myLoopId = ++loopIdRef.current;
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          const updateTime = () => {
            if (myLoopId !== loopIdRef.current) return;
            if (audioContextRef.current) {
              const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
              setCurrentTime(Math.min(Math.max(elapsed, 0), audioBuffer.duration));
              animationFrameRef.current = requestAnimationFrame(updateTime);
            }
          };
          animationFrameRef.current = requestAnimationFrame(updateTime);
        }, 10);
      }

      return newValue;
    });
  }, [isPlaying, audioBuffer, settings, getAudioContext]);

  const updateStereoWidth = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, stereoWidth: value }));
    // Live-update the side gain without restarting playback
    if (stereoWidthGainRef.current) {
      const widthFactor = value / 100;
      stereoWidthGainRef.current.gain.value = 0.5 * widthFactor;
    }
  }, []);

  const updateEQBand = useCallback((index: number, gain: number) => {
    setSettings(prev => ({
      ...prev,
      eqBands: prev.eqBands.map((band, i) =>
        i === index ? { ...band, gain } : band
      ),
    }));

    if (eqNodesRef.current[index]) {
      eqNodesRef.current[index].gain.value = gain;
    }
  }, []);

  const updateCompression = useCallback((key: keyof MasteringSettings['compression'], value: number) => {
    setSettings(prev => ({
      ...prev,
      compression: { ...prev.compression, [key]: value },
    }));

    if (compressorNodeRef.current) {
      const compressor = compressorNodeRef.current;
      switch (key) {
        case 'threshold':
          compressor.threshold.value = value;
          break;
        case 'ratio':
          compressor.ratio.value = value;
          break;
        case 'attack':
          compressor.attack.value = value;
          break;
        case 'release':
          compressor.release.value = value;
          break;
      }
    }
  }, []);

  const updateOutputGain = useCallback((gain: number) => {
    setSettings(prev => ({ ...prev, outputGain: gain }));
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.pow(10, gain / 20);
    }
  }, []);

  const applyAISettings = useCallback((aiSettings: Partial<MasteringSettings>) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        ...aiSettings,
        eqBands: aiSettings.eqBands || prev.eqBands,
        compression: { ...prev.compression, ...aiSettings.compression },
        limiter: { ...prev.limiter, ...aiSettings.limiter },
      };

      // Sync EQ nodes immediately
      if (aiSettings.eqBands) {
        aiSettings.eqBands.forEach((band, index) => {
          if (eqNodesRef.current[index]) {
            eqNodesRef.current[index].gain.value = band.gain;
          }
        });
      }

      // Sync compressor nodes immediately
      if (aiSettings.compression) {
        if (compressorNodeRef.current) {
          if (aiSettings.compression.threshold !== undefined) {
            compressorNodeRef.current.threshold.value = aiSettings.compression.threshold;
          }
          if (aiSettings.compression.ratio !== undefined) {
            compressorNodeRef.current.ratio.value = aiSettings.compression.ratio;
          }
          if (aiSettings.compression.attack !== undefined) {
            compressorNodeRef.current.attack.value = aiSettings.compression.attack;
          }
          if (aiSettings.compression.release !== undefined) {
            compressorNodeRef.current.release.value = aiSettings.compression.release;
          }
        }
      }

      // Sync limiter nodes immediately
      if (aiSettings.limiter && limiterNodeRef.current) {
        if (aiSettings.limiter.threshold !== undefined) {
          limiterNodeRef.current.threshold.value = aiSettings.limiter.threshold;
        }
      }

      // Sync output gain immediately
      if (aiSettings.outputGain !== undefined && gainNodeRef.current) {
        gainNodeRef.current.gain.value = Math.pow(10, aiSettings.outputGain / 20);
      }

      return newSettings;
    });
    setIsProcessed(true);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);

    // Sync nodes to default values
    eqNodesRef.current.forEach((node, index) => {
      node.gain.value = 0;
    });
    if (compressorNodeRef.current) {
      compressorNodeRef.current.threshold.value = -24;
      compressorNodeRef.current.ratio.value = 4;
      compressorNodeRef.current.attack.value = 0.003;
      compressorNodeRef.current.release.value = 0.25;
    }
    if (limiterNodeRef.current) {
      limiterNodeRef.current.threshold.value = -1;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = 1;
    }
  }, []);

  const exportAudio = useCallback(async (fileOverride?: File, format: ExportFormat = 'wav', kbps = 320): Promise<Blob | null> => {
    let bufferToExport = audioBuffer;

    // If a file was provided (batch mode), decode it fresh
    if (fileOverride) {
      const tempCtx = new AudioContext();
      const arrayBuf = await fileOverride.arrayBuffer();
      bufferToExport = await tempCtx.decodeAudioData(arrayBuf);
      await tempCtx.close();
    }

    if (!bufferToExport) return null;

    const ctx = new OfflineAudioContext(
      bufferToExport.numberOfChannels,
      bufferToExport.length,
      bufferToExport.sampleRate
    );

    const source = ctx.createBufferSource();
    source.buffer = bufferToExport;

    // Create processing chain for offline context
    const gainNode = ctx.createGain();
    gainNode.gain.value = Math.pow(10, settings.outputGain / 20);

    const eqNodes: BiquadFilterNode[] = [];
    settings.eqBands.forEach((band, index) => {
      const filter = ctx.createBiquadFilter();
      filter.type = index === 0 ? 'lowshelf' : index === settings.eqBands.length - 1 ? 'highshelf' : 'peaking';
      filter.frequency.value = band.frequency;
      filter.gain.value = band.gain;
      filter.Q.value = band.Q;
      eqNodes.push(filter);
    });

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = settings.compression.threshold;
    compressor.ratio.value = settings.compression.ratio;
    compressor.attack.value = settings.compression.attack;
    compressor.release.value = settings.compression.release;

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = settings.limiter.threshold;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.1;

    // Connect chain
    let currentNode: AudioNode = source;
    eqNodes.forEach(filter => {
      currentNode.connect(filter);
      currentNode = filter;
    });
    currentNode.connect(compressor);
    compressor.connect(limiter);
    limiter.connect(gainNode);

    // M/S stereo width in offline context
    const widthFactor = settings.stereoWidth / 100;
    if (widthFactor !== 1 && bufferToExport.numberOfChannels >= 2) {
      const splitter = ctx.createChannelSplitter(2);
      const merger = ctx.createChannelMerger(2);
      const midL = ctx.createGain(); midL.gain.value = 0.5;
      const midR = ctx.createGain(); midR.gain.value = 0.5;
      const sideL = ctx.createGain(); sideL.gain.value = 0.5 * widthFactor;
      const sideR = ctx.createGain(); sideR.gain.value = -0.5 * widthFactor;
      gainNode.connect(splitter);
      splitter.connect(midL, 0); splitter.connect(sideL, 0);
      splitter.connect(midR, 1); splitter.connect(sideR, 1);
      midL.connect(merger, 0, 0); sideL.connect(merger, 0, 0);
      midR.connect(merger, 0, 1); sideR.connect(merger, 0, 1);
      merger.connect(ctx.destination);
    } else {
      gainNode.connect(ctx.destination);
    }

    source.start();
    const renderedBuffer = await ctx.startRendering();

    // Encode to requested format
    if (format === 'mp3') {
      return encodeToMp3(renderedBuffer, kbps);
    }
    return audioBufferToWav(renderedBuffer);
  }, [audioBuffer, settings]);


  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    audioFile,
    audioBuffer,
    isPlaying,
    currentTime,
    duration,
    isProcessed,
    settings,
    isLoading,
    waveformData,
    analyserNode: analyserNodeRef,
    loadAudioFile,
    play,
    pause,
    seek,
    toggleProcessing,
    updateEQBand,
    updateCompression,
    updateOutputGain,
    updateStereoWidth,
    applyAISettings,
    resetSettings,
    exportAudio,
  };
}

// Helper function to convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  // Write samples
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
