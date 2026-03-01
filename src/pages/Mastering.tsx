import { useState, useRef, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Upload,
  Play,
  Pause,
  SkipBack,
  Download,
  Wand2,
  Volume2,
  Music2,
  Settings2,
  RotateCcw,
  Loader2,
  FileAudio,
  Sparkles,
  ListMusic,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  PackageOpen,
  Plus,
  Bookmark,
  BookmarkCheck,
  Trash2,
} from 'lucide-react';
import { useAudioProcessor, MasteringSettings, EQBand } from '@/hooks/useAudioProcessor';
import { usePresets } from '@/hooks/usePresets';
import { ExportFormat } from '@/utils/mp3Encoder';
import { SpectrumAnalyzer } from '@/components/SpectrumAnalyzer';
import { LoudnessMeter } from '@/components/LoudnessMeter';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface MasteringPreset {
  name: string;
  description: string;
  icon: string;
  eqBands: { gain: number }[];
  compression: {
    threshold: number;
    ratio: number;
  };
  outputGain: number;
}

const MASTERING_PRESETS: MasteringPreset[] = [
  {
    name: 'Warm',
    description: 'Rich, analog-style warmth',
    icon: '🔥',
    eqBands: [
      { gain: 2.5 },
      { gain: 1.5 },
      { gain: 0 },
      { gain: -1 },
      { gain: -1.5 },
      { gain: -2 },
    ],
    compression: { threshold: -18, ratio: 3 },
    outputGain: 1.5,
  },
  {
    name: 'Bright',
    description: 'Crisp, airy high-end',
    icon: '✨',
    eqBands: [
      { gain: -1 },
      { gain: 0 },
      { gain: 0.5 },
      { gain: 1.5 },
      { gain: 3 },
      { gain: 4 },
    ],
    compression: { threshold: -20, ratio: 2.5 },
    outputGain: 1,
  },
  {
    name: 'Punchy',
    description: 'Tight, impactful dynamics',
    icon: '👊',
    eqBands: [
      { gain: 3 },
      { gain: 1 },
      { gain: -2 },
      { gain: 2 },
      { gain: 1.5 },
      { gain: 0.5 },
    ],
    compression: { threshold: -12, ratio: 6 },
    outputGain: 2,
  },
  {
    name: 'Balanced',
    description: 'Clean, transparent master',
    icon: '⚖️',
    eqBands: [
      { gain: 0.5 },
      { gain: 0 },
      { gain: -0.5 },
      { gain: 0.5 },
      { gain: 1 },
      { gain: 0.5 },
    ],
    compression: { threshold: -24, ratio: 2 },
    outputGain: 0.5,
  },
  {
    name: 'Bass Heavy',
    description: 'Deep, powerful low-end',
    icon: '🎸',
    eqBands: [
      { gain: 5 },
      { gain: 3 },
      { gain: 1 },
      { gain: -1 },
      { gain: 0 },
      { gain: 0.5 },
    ],
    compression: { threshold: -16, ratio: 4 },
    outputGain: 1,
  },
  {
    name: 'Vocal Focus',
    description: 'Upfront, clear vocals',
    icon: '🎤',
    eqBands: [
      { gain: -2 },
      { gain: -1 },
      { gain: 2 },
      { gain: 3 },
      { gain: 2 },
      { gain: 1 },
    ],
    compression: { threshold: -20, ratio: 3.5 },
    outputGain: 1.5,
  },
];

// ── Track Queue ──────────────────────────────────────────────────────────────
type QueueStatus = 'pending' | 'processing' | 'done' | 'error';
interface QueueTrack {
  id: string;
  file: File;
  status: QueueStatus;
  blob?: Blob;
  error?: string;
}

export default function Mastering() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queueInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isAIMastering, setIsAIMastering] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [trackQueue, setTrackQueue] = useState<QueueTrack[]>([]);
  const [queueOpen, setQueueOpen] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('wav');

  const { presets: savedPresets, savePreset, deletePreset } = usePresets();

  const {
    audioFile,
    isPlaying,
    currentTime,
    duration,
    isProcessed,
    settings,
    isLoading,
    waveformData,
    analyserNode,
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
  } = useAudioProcessor();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/mp4'];
      if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
        toast.error('Please upload a valid audio file (MP3, WAV, FLAC, AAC, OGG)');
        return;
      }
      loadAudioFile(file);
      toast.success('Audio file loaded successfully');
    }
  }, [loadAudioFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      loadAudioFile(file);
      toast.success('Audio file loaded successfully');
    }
  }, [loadAudioFile]);

  const handleAIMaster = useCallback(async () => {
    if (!audioFile) return;

    setIsAIMastering(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-master', {
        body: {
          fileName: audioFile.name,
          fileType: audioFile.type,
          duration: duration,
        }
      });

      if (error) {
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          toast.error('Rate limit exceeded. Please try again in a moment.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          throw error;
        }
        return;
      }

      if (data?.settings) {
        applyAISettings(data.settings);
        toast.success('AI mastering settings applied!');
      }
    } catch (error) {
      console.error('AI mastering error:', error);
      toast.error('Failed to apply AI mastering. Please try again.');
    } finally {
      setIsAIMastering(false);
    }
  }, [audioFile, duration, applyAISettings]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const blob = await exportAudio(undefined, exportFormat, 320);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = exportFormat === 'mp3' ? 'mp3' : 'wav';
        a.download = `${audioFile?.name.replace(/\.[^/.]+$/, '')}_mastered.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Audio exported as ${ext.toUpperCase()} successfully!`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export audio');
    } finally {
      setIsExporting(false);
    }
  }, [exportAudio, audioFile, exportFormat]);

  // ── Add to Queue ───────────────────────────────────────────────────────────
  const handleAddToQueue = useCallback((files: FileList | File[]) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/mp4'];
    const newTracks: QueueTrack[] = [];
    Array.from(files).forEach(file => {
      if (!validTypes.some(t => file.type.includes(t.split('/')[1]))) return;
      newTracks.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, status: 'pending' });
    });
    if (newTracks.length === 0) { toast.error('No valid audio files found'); return; }
    setTrackQueue(q => [...q, ...newTracks]);
    setQueueOpen(true);
    toast.success(`Added ${newTracks.length} track${newTracks.length > 1 ? 's' : ''} to queue`);
  }, []);

  // ── Batch Process ──────────────────────────────────────────────────────────
  const handleProcessQueue = useCallback(async () => {
    const pending = trackQueue.filter(t => t.status === 'pending');
    if (pending.length === 0) { toast.error('No pending tracks to process'); return; }
    setIsBatchProcessing(true);
    for (const track of pending) {
      setTrackQueue(q => q.map(t => t.id === track.id ? { ...t, status: 'processing' } : t));
      try {
        const blob = await exportAudio(track.file, exportFormat, 320);
        if (blob) {
          setTrackQueue(q => q.map(t => t.id === track.id ? { ...t, status: 'done', blob } : t));
        } else {
          setTrackQueue(q => q.map(t => t.id === track.id ? { ...t, status: 'error', error: 'Export returned empty' } : t));
        }
      } catch (err) {
        setTrackQueue(q => q.map(t => t.id === track.id ? { ...t, status: 'error', error: String(err) } : t));
      }
    }
    setIsBatchProcessing(false);
    toast.success('Batch processing complete!');
  }, [trackQueue, exportAudio, exportFormat]);

  // ── Download All as ZIP ────────────────────────────────────────────────────
  const handleDownloadZip = useCallback(async () => {
    const done = trackQueue.filter(t => t.status === 'done' && t.blob);
    if (done.length === 0) { toast.error('No processed tracks to download'); return; }
    const zip = new JSZip();
    const ext = exportFormat === 'mp3' ? 'mp3' : 'wav';
    done.forEach(t => {
      const name = t.file.name.replace(/\.[^/.]+$/, '') + `_mastered.${ext}`;
      zip.file(name, t.blob!);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mastered_tracks.zip';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${done.length} tracks as ZIP`);
  }, [trackQueue, exportFormat]);

  // ── A/B Keyboard Shortcut (Tab key) ───────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!audioFile || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        toggleProcessing();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [audioFile, toggleProcessing]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Audio Mastering Studio"
        description="Free online audio mastering tool with AI-powered enhancement. Upload your track, apply professional EQ and compression, then export studio-quality audio."
        keywords="audio mastering, online mastering, music production, EQ, compression, AI mastering, free audio tool"
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-border bg-muted/50 mb-8 mono-label mx-auto">
              <div className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse" />
              <span className="text-muted-foreground uppercase tracking-widest">Mastering Suite v2.1.0</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">
              Audio <span className="text-gradient">Mastering Studio</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Professional audio mastering with AI-powered enhancement. Upload your track,
              fine-tune the mix, and export studio-quality audio.
            </p>
          </div>

          {/* Hidden file input — kept outside AnimatePresence so ref stays mounted */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Area */}
          <AnimatePresence mode="wait">
            {!audioFile ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8"
              >
                <Card
                  className={`border-2 border-dashed transition-colors cursor-pointer ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-none bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Upload Source Audio</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Drag and drop or click to select<br />
                      Supports MP3, WAV, FLAC, AAC, OGG
                    </p>
                    <Button variant="outline">
                      <FileAudio className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Player Card */}
                <Card className="glass overflow-hidden">
                  <CardContent className="p-6">
                    {/* File Info */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Music2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold truncate max-w-[300px] uppercase tracking-tight">{audioFile.name}</h3>
                          <p className="text-sm text-muted-foreground mono-label uppercase">
                            {formatTime(duration)} // {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none mono-label text-[10px] uppercase gap-1 h-auto py-2 px-3 whitespace-normal text-center min-w-[80px]"
                          onClick={() => queueInputRef.current?.click()}
                        >
                          <Plus className="h-3 w-3 shrink-0" />
                          Add to Queue
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-2 px-3 whitespace-normal text-center"
                          onClick={() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                              fileInputRef.current.click();
                            }
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    </div>

                    {/* Waveform */}
                    <div
                      className="relative h-24 bg-secondary/50 rounded-none mb-4 overflow-hidden cursor-pointer border border-border"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percent = x / rect.width;
                        seek(percent * duration);
                      }}
                    >
                      <div
                        className="absolute inset-0 flex items-end"
                        style={{ display: 'grid', gridTemplateColumns: `repeat(${waveformData.length}, 1fr)`, alignItems: 'center' }}
                      >
                        {waveformData.map((val, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center h-full"
                          >
                            <div
                              className={`w-full rounded-none ${(i / waveformData.length) * 100 < progressPercent
                                ? isProcessed ? 'bg-accent' : 'bg-primary'
                                : 'bg-muted-foreground/30'
                                }`}
                              style={{ height: `${Math.max(4, val * 80)}%` }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* Playhead */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary"
                        style={{ left: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between text-sm text-muted-foreground mb-4 mono-label uppercase tracking-widest">
                      <span>TIME: {formatTime(currentTime)}</span>
                      <span>TOTAL: {formatTime(duration)}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => seek(0)}
                        disabled={isLoading}
                        className="rounded-none"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="hero"
                        size="lg"
                        className="rounded-none w-14 h-14"
                        onClick={isPlaying ? pause : play}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-0.5" />
                        )}
                      </Button>

                      {/* A / B Toggle */}
                      <div className="flex items-stretch border border-border rounded-none overflow-hidden">
                        <button
                          onClick={() => isProcessed && toggleProcessing()}
                          className={`px-4 py-2 text-xs font-bold mono-label uppercase tracking-widest transition-colors ${!isProcessed
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          A
                        </button>
                        <div className="w-px bg-border" />
                        <button
                          onClick={() => !isProcessed && toggleProcessing()}
                          className={`px-4 py-2 text-xs font-bold mono-label uppercase tracking-widest transition-colors ${isProcessed
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          B
                        </button>
                      </div>
                      <span className="text-[10px] mono-label uppercase tracking-widest text-muted-foreground">
                        {isProcessed ? 'Mastered' : 'Original'}
                        <span className="ml-1 opacity-40 text-[8px]">[Tab]</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metering Row: Spectrum Analyzer + Loudness Meter */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                  <Card className="overflow-hidden">
                    <CardHeader className="py-2 px-4 border-b border-border">
                      <CardTitle className="text-[10px] mono-label uppercase tracking-widest text-muted-foreground">
                        Spectrum Analyzer // 20 Hz → 20 kHz
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0" style={{ height: '160px' }}>
                      <SpectrumAnalyzer analyserNode={analyserNode} isPlaying={isPlaying} />
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardContent className="p-4 h-full" style={{ height: '220px' }}>
                      <LoudnessMeter analyserNode={analyserNode} isPlaying={isPlaying} />
                    </CardContent>
                  </Card>
                </div>

                {/* Controls Tabs */}
                <Tabs defaultValue="eq" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="eq" className="gap-2 uppercase mono-label text-xs">
                      <Settings2 className="h-4 w-4" />
                      EQ_STATION
                    </TabsTrigger>
                    <TabsTrigger value="dynamics" className="gap-2 uppercase mono-label text-xs">
                      <Volume2 className="h-4 w-4" />
                      DYNAMICS_CORE
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="gap-2 uppercase mono-label text-xs">
                      <Sparkles className="h-4 w-4" />
                      AI_MAST_V1
                    </TabsTrigger>
                  </TabsList>

                  {/* EQ Tab */}
                  <TabsContent value="eq">
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg mono-label uppercase">EQ_MODULE_6B</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => { resetSettings(); setActivePreset(null); }}>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reset
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Presets */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {MASTERING_PRESETS.map((preset) => {
                              const isActive = activePreset === preset.name;
                              return (
                                <Button
                                  key={preset.name}
                                  variant={isActive ? "default" : "outline"}
                                  size="sm"
                                  className={`flex flex-col h-auto py-3 transition-all rounded-none mono-label uppercase text-[10px] ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:border-primary hover:bg-primary/5'
                                    }`}
                                  onClick={() => {
                                    setActivePreset(preset.name);
                                    applyAISettings({
                                      eqBands: settings.eqBands.map((band, i) => ({
                                        ...band,
                                        gain: preset.eqBands[i]?.gain ?? 0,
                                      })),
                                      compression: {
                                        ...settings.compression,
                                        ...preset.compression,
                                      },
                                      outputGain: preset.outputGain,
                                    });
                                    toast.success(`Applied "${preset.name}" preset`);
                                  }}
                                >
                                  <span className="text-lg mb-1">{preset.icon}</span>
                                  <span className="text-xs font-medium">{preset.name}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Saved Presets */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">My Presets</Label>
                            <span className="text-[9px] mono-label uppercase text-muted-foreground/50 tracking-widest">
                              {savedPresets.length} saved
                            </span>
                          </div>

                          {/* Save row */}
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              value={presetName}
                              onChange={e => setPresetName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && presetName.trim()) {
                                  savePreset(presetName, settings);
                                  toast.success(`Preset "${presetName.trim()}" saved`);
                                  setPresetName('');
                                }
                              }}
                              placeholder="Preset name…"
                              className="flex-1 bg-background border border-border px-3 py-1.5 text-xs mono-label rounded-none focus:outline-none focus:border-primary"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-none mono-label uppercase text-[10px] gap-1 shrink-0"
                              disabled={!presetName.trim()}
                              onClick={() => {
                                savePreset(presetName, settings);
                                toast.success(`Preset "${presetName.trim()}" saved`);
                                setPresetName('');
                              }}
                            >
                              <Bookmark className="h-3 w-3" />
                              Save
                            </Button>
                          </div>

                          {/* Saved preset list */}
                          {savedPresets.length === 0 ? (
                            <div className="text-center py-4 text-[10px] mono-label uppercase text-muted-foreground/40 border border-dashed border-border">
                              No saved presets yet — dial in your EQ above and save it
                            </div>
                          ) : (
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {savedPresets.map(p => (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-2 px-3 py-2 border border-border bg-background hover:border-primary/40 group transition-colors"
                                >
                                  <BookmarkCheck className="h-3 w-3 text-primary/60 shrink-0" />
                                  <span className="text-xs mono-label uppercase flex-1 truncate">{p.name}</span>
                                  <span className="text-[9px] text-muted-foreground/40 mono-label shrink-0">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-[10px] mono-label gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      setActivePreset(p.name);
                                      applyAISettings({
                                        eqBands: settings.eqBands.map((band, i) => ({
                                          ...band,
                                          gain: p.settings.eqBands[i]?.gain ?? band.gain,
                                          Q: p.settings.eqBands[i]?.Q ?? band.Q,
                                        })),
                                        compression: { ...settings.compression, ...p.settings.compression },
                                        outputGain: p.settings.outputGain,
                                      });
                                      toast.success(`Loaded "${p.name}"`);
                                    }}
                                  >
                                    Load
                                  </Button>
                                  <button
                                    className="text-muted-foreground/30 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                    onClick={() => {
                                      deletePreset(p.id);
                                      toast.success(`Deleted "${p.name}"`);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* EQ Sliders */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium block">Manual EQ</Label>
                            <span className="text-[9px] mono-label uppercase text-muted-foreground/40 tracking-widest">
                              ±12 dB range // 0.5 dB steps
                            </span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {settings.eqBands.map((band, index) => (
                              <div key={band.label} className="flex flex-col items-center">
                                {/* Slider Container with Background */}
                                <div className="relative h-48 w-full bg-secondary/10 border border-border flex items-center justify-center py-4 mb-2 group">
                                  {/* dB Markers (Ticks) */}
                                  <div className="absolute inset-y-4 right-2 flex flex-col justify-between pointer-events-none">
                                    <span className="text-[8px] mono-label text-muted-foreground/30">+12</span>
                                    <span className="text-[8px] mono-label text-primary/40">0</span>
                                    <span className="text-[8px] mono-label text-muted-foreground/30">-12</span>
                                  </div>

                                  {/* Visual track background grid/lines */}
                                  <div className="absolute inset-0 flex flex-col justify-around px-2 opacity-5 pointer-events-none">
                                    {[...Array(5)].map((_, i) => (
                                      <div key={i} className="h-px bg-foreground w-full" />
                                    ))}
                                  </div>

                                  <Slider
                                    orientation="vertical"
                                    min={-12}
                                    max={12}
                                    step={0.5}
                                    value={[band.gain]}
                                    onValueChange={([value]) => { updateEQBand(index, value); setActivePreset(null); }}
                                    className="h-full z-10"
                                  />
                                </div>
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className={`text-[10px] mono-label font-bold ${band.gain !== 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {band.gain > 0 ? '+' : ''}{band.gain.toFixed(1)}
                                  </span>
                                  <span className="text-[10px] mono-label uppercase tracking-tighter font-medium text-muted-foreground/80">{band.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Dynamics Tab */}
                  <TabsContent value="dynamics">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg mono-label uppercase">DYN_PROC // OUTPUT_GAIN</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Compressor */}
                        <div>
                          <h4 className="text-sm font-medium mb-4">Compressor</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Threshold: {settings.compression.threshold} dB
                              </Label>
                              <Slider
                                min={-60}
                                max={0}
                                step={1}
                                value={[settings.compression.threshold]}
                                onValueChange={([v]) => updateCompression('threshold', v)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Ratio: {settings.compression.ratio}:1
                              </Label>
                              <Slider
                                min={1}
                                max={20}
                                step={0.5}
                                value={[settings.compression.ratio]}
                                onValueChange={([v]) => updateCompression('ratio', v)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Output Gain */}
                        <div>
                          <h4 className="text-sm font-medium mb-4">Output Gain</h4>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Gain: {settings.outputGain > 0 ? '+' : ''}{settings.outputGain} dB
                            </Label>
                            <Slider
                              min={-12}
                              max={12}
                              step={0.5}
                              value={[settings.outputGain]}
                              onValueChange={([v]) => updateOutputGain(v)}
                            />
                          </div>
                        </div>

                        {/* Stereo Width */}
                        <div>
                          <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                            Stereo Width
                            <span className="text-[10px] mono-label text-muted-foreground/60 uppercase tracking-widest">
                              M/S Processing
                            </span>
                          </h4>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <Label className="text-xs text-muted-foreground">
                                Width: {settings.stereoWidth}%
                              </Label>
                              <span className={`text-[10px] mono-label uppercase tracking-widest ${settings.stereoWidth === 0 ? 'text-amber-500'
                                : settings.stereoWidth < 80 ? 'text-amber-400'
                                  : settings.stereoWidth === 100 ? 'text-muted-foreground'
                                    : settings.stereoWidth > 150 ? 'text-primary'
                                      : 'text-green-500'
                                }`}>
                                {settings.stereoWidth === 0 ? 'MONO'
                                  : settings.stereoWidth < 80 ? 'NARROW'
                                    : settings.stereoWidth === 100 ? 'UNITY'
                                      : settings.stereoWidth > 150 ? 'ULTRA WIDE'
                                        : 'WIDE'}
                              </span>
                            </div>
                            <Slider
                              min={0}
                              max={200}
                              step={5}
                              value={[settings.stereoWidth]}
                              onValueChange={([v]) => updateStereoWidth(v)}
                            />
                            <div className="flex justify-between text-[9px] mono-label text-muted-foreground/40 uppercase mt-1">
                              <span>Mono</span>
                              <span>Unity</span>
                              <span>Wide</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* AI Tab */}
                  <TabsContent value="ai">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Wand2 className="h-5 w-5 text-primary" />
                          NEURAL_MAST_ENGINE_V1.0
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-6">
                          Let AI analyze your track and automatically apply professional mastering
                          settings optimized for your audio content.
                        </p>
                        <Button
                          onClick={handleAIMaster}
                          disabled={isAIMastering || !audioFile}
                          className="w-full"
                          size="lg"
                        >
                          {isAIMastering ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Analyzing & Applying...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-5 w-5" />
                              Apply AI Mastering
                            </>
                          )}
                        </Button>
                        {isAIMastering && (
                          <Progress value={66} className="mt-4" />
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Export + Queue Actions */}
                <div className="flex flex-col gap-4 pt-6">

                  {/* Format selector */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <span className="text-[10px] mono-label uppercase tracking-widest text-muted-foreground">
                      Export Format
                    </span>
                    <div className="flex items-stretch border border-border overflow-hidden">
                      {(['wav', 'mp3'] as ExportFormat[]).map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt)}
                          className={`px-4 py-1.5 text-xs font-bold mono-label uppercase tracking-widest transition-colors ${exportFormat === fmt
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                    {exportFormat === 'mp3' && (
                      <span className="text-[9px] mono-label text-muted-foreground/50 uppercase tracking-widest">
                        320 kbps
                      </span>
                    )}
                    {exportFormat === 'wav' && (
                      <span className="text-[9px] mono-label text-muted-foreground/50 uppercase tracking-widest">
                        Lossless PCM
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 px-4 sm:px-0">
                    <Button
                      onClick={handleExport}
                      disabled={isExporting || !audioFile}
                      size="lg"
                      variant="hero"
                      className="w-full sm:w-auto h-auto py-4 sm:py-2 px-6 sm:px-8 whitespace-normal text-center min-h-[3.5rem]"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Download Mastered Audio
                        </>
                      )}
                    </Button>

                    {/* Queue toggle button */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto rounded-none gap-2 mono-label uppercase text-xs h-12 sm:h-auto"
                      onClick={() => setQueueOpen(o => !o)}
                    >
                      <ListMusic className="h-4 w-4" />
                      Queue
                      {trackQueue.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-none">
                          {trackQueue.length}
                        </span>
                      )}
                      {queueOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </div>

                  {/* Queue Panel */}
                  {queueOpen && (
                    <div className="border border-border bg-secondary/20 rounded-none p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] mono-label uppercase tracking-widest text-muted-foreground">
                          Track Queue // {trackQueue.length} track{trackQueue.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-none mono-label uppercase text-[10px] gap-1 h-auto py-2 px-3 whitespace-normal text-center"
                            onClick={() => queueInputRef.current?.click()}
                          >
                            <Plus className="h-3 w-3 shrink-0" />
                            Add Files
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-none mono-label uppercase text-[10px] gap-1"
                            disabled={isBatchProcessing || trackQueue.filter(t => t.status === 'pending').length === 0}
                            onClick={handleProcessQueue}
                          >
                            {isBatchProcessing ? (
                              <><Loader2 className="h-3 w-3 animate-spin" />Processing...</>
                            ) : (
                              <>Process All</>
                            )}
                          </Button>
                          {trackQueue.some(t => t.status === 'done') && (
                            <Button
                              size="sm"
                              variant="hero"
                              className="rounded-none mono-label uppercase text-[10px] gap-1"
                              onClick={handleDownloadZip}
                            >
                              <PackageOpen className="h-3 w-3" />
                              Download ZIP
                            </Button>
                          )}
                          {trackQueue.length > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-none mono-label uppercase text-[10px] text-muted-foreground"
                              onClick={() => setTrackQueue([])}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Track rows */}
                      {trackQueue.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground/50 text-xs mono-label uppercase">
                          No tracks in queue. Add files to begin batch mastering.
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-52 overflow-y-auto">
                          {trackQueue.map(track => (
                            <div
                              key={track.id}
                              className="flex items-center gap-3 px-3 py-2 bg-background border border-border"
                            >
                              {/* Status icon */}
                              {track.status === 'pending' && <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/40 shrink-0" />}
                              {track.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />}
                              {track.status === 'done' && <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />}
                              {track.status === 'error' && <XCircle className="h-3 w-3 text-red-500 shrink-0" />}

                              {/* Filename */}
                              <span className="text-xs mono-label truncate flex-1 uppercase">
                                {track.file.name}
                              </span>

                              {/* Size */}
                              <span className="text-[10px] text-muted-foreground mono-label shrink-0">
                                {(track.file.size / (1024 * 1024)).toFixed(1)} MB
                              </span>

                              {/* Per-track download */}
                              {track.status === 'done' && track.blob && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-[10px] mono-label gap-1 shrink-0"
                                  onClick={() => {
                                    const url = URL.createObjectURL(track.blob!);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = track.file.name.replace(/\.[^/.]+$/, '') + '_mastered.wav';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                >
                                  <Download className="h-3 w-3" />
                                  WAV
                                </Button>
                              )}

                              {/* Remove */}
                              {track.status !== 'processing' && (
                                <button
                                  className="text-muted-foreground/40 hover:text-muted-foreground text-[10px] shrink-0"
                                  onClick={() => setTrackQueue(q => q.filter(t => t.id !== track.id))}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hidden queue file input */}
                  <input
                    ref={queueInputRef}
                    type="file"
                    accept="audio/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      if (e.target.files) handleAddToQueue(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
