import { useState, useRef, useCallback, useEffect } from 'react';

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
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

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
    analyser.fftSize = 256;
    analyserNodeRef.current = analyser;

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
      gainNode.connect(analyser);
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

    // Stop any existing playback
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
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
      }
    };

    // Update current time
    const updateTime = () => {
      if (sourceNodeRef.current && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
        setCurrentTime(Math.min(elapsed, audioBuffer.duration));
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };
    updateTime();
  }, [audioBuffer, getAudioContext, createProcessingChain]);

  const pause = useCallback(() => {
    if (sourceNodeRef.current && audioContextRef.current) {
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
    if (wasPlaying) {
      pause();
    }
    setIsProcessed(prev => !prev);
    if (wasPlaying) {
      setTimeout(play, 50);
    }
  }, [isPlaying, pause, play]);

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
    setSettings(prev => ({
      ...prev,
      ...aiSettings,
      eqBands: aiSettings.eqBands || prev.eqBands,
      compression: { ...prev.compression, ...aiSettings.compression },
      limiter: { ...prev.limiter, ...aiSettings.limiter },
    }));
    setIsProcessed(true);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const exportAudio = useCallback(async (): Promise<Blob | null> => {
    if (!audioBuffer) return null;

    const ctx = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

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
    gainNode.connect(ctx.destination);

    source.start();
    const renderedBuffer = await ctx.startRendering();

    // Convert to WAV
    const wavBlob = audioBufferToWav(renderedBuffer);
    return wavBlob;
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
    loadAudioFile,
    play,
    pause,
    seek,
    toggleProcessing,
    updateEQBand,
    updateCompression,
    updateOutputGain,
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
