import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import SupportDialog from '@/components/SupportDialog';
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
  Heart,
} from 'lucide-react';
import { useAudioProcessor, MasteringSettings, EQBand } from '@/hooks/useAudioProcessor';

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

export default function Mastering() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isAIMastering, setIsAIMastering] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  const {
    audioFile,
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
      const blob = await exportAudio();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${audioFile?.name.replace(/\.[^/.]+$/, '')}_mastered.wav`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Audio exported successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export audio');
    } finally {
      setIsExporting(false);
    }
  }, [exportAudio, audioFile]);

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
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Audio Mastering Studio</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional audio mastering with AI-powered enhancement. Upload your track, 
              fine-tune the mix, and export studio-quality audio.
            </p>
          </div>

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
                  className={`border-2 border-dashed transition-colors cursor-pointer ${
                    dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Upload Your Audio</h3>
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
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
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold truncate max-w-[300px]">{audioFile.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(duration)} • {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
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

                    {/* Waveform */}
                    <div 
                      className="relative h-24 bg-secondary/50 rounded-lg mb-4 overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percent = x / rect.width;
                        seek(percent * duration);
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center gap-0.5 px-2">
                        {waveformData.map((val, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-colors ${
                              (i / waveformData.length) * 100 < progressPercent
                                ? isProcessed ? 'bg-accent' : 'bg-primary'
                                : 'bg-muted-foreground/30'
                            }`}
                            style={{ height: `${Math.max(4, val * 80)}%` }}
                          />
                        ))}
                      </div>
                      {/* Playhead */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-primary"
                        style={{ left: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => seek(0)}
                        disabled={isLoading}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="hero"
                        size="lg"
                        className="rounded-full w-14 h-14"
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
                      <div className="flex items-center gap-2">
                        <Switch
                          id="processed"
                          checked={isProcessed}
                          onCheckedChange={toggleProcessing}
                        />
                        <Label htmlFor="processed" className="text-sm">
                          {isProcessed ? 'Mastered' : 'Original'}
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Controls Tabs */}
                <Tabs defaultValue="eq" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="eq" className="gap-2">
                      <Settings2 className="h-4 w-4" />
                      Equalizer
                    </TabsTrigger>
                    <TabsTrigger value="dynamics" className="gap-2">
                      <Volume2 className="h-4 w-4" />
                      Dynamics
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Master
                    </TabsTrigger>
                  </TabsList>

                  {/* EQ Tab */}
                  <TabsContent value="eq">
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">6-Band Equalizer</CardTitle>
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
                                  className={`flex flex-col h-auto py-3 transition-all ${
                                    isActive 
                                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
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

                        {/* EQ Sliders */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Manual EQ</Label>
                          <div className="grid grid-cols-6 gap-4">
                            {settings.eqBands.map((band, index) => (
                              <div key={band.label} className="flex flex-col items-center">
                                <div className="h-32 flex items-center mb-2">
                                  <Slider
                                    orientation="vertical"
                                    min={-12}
                                    max={12}
                                    step={0.5}
                                    value={[band.gain]}
                                    onValueChange={([value]) => { updateEQBand(index, value); setActivePreset(null); }}
                                    className="h-full"
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {band.gain > 0 ? '+' : ''}{band.gain.toFixed(1)} dB
                                </span>
                                <span className="text-xs font-medium mt-1">{band.label}</span>
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
                        <CardTitle className="text-lg">Dynamics & Output</CardTitle>
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
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* AI Tab */}
                  <TabsContent value="ai">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Wand2 className="h-5 w-5 text-primary" />
                          AI-Powered Mastering
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

                {/* Export & Support Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting || !audioFile}
                    size="lg"
                    variant="hero"
                    className="min-w-[200px]"
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
                  <Button
                    onClick={() => setShowSupportDialog(true)}
                    size="lg"
                    variant="outline"
                    className="min-w-[200px] border-primary/30 hover:bg-primary/10"
                  >
                    <Heart className="mr-2 h-5 w-5 text-primary" />
                    Support This Tool
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
      
      {/* Floating Support Button */}
      <motion.button
        onClick={() => setShowSupportDialog(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart className="h-5 w-5" />
        <span className="font-medium">Support</span>
      </motion.button>
      
      {/* Support Dialog */}
      <SupportDialog
        open={showSupportDialog}
        onOpenChange={setShowSupportDialog}
        toolName="Audio Mastering Studio"
      />
    </div>
  );
}
