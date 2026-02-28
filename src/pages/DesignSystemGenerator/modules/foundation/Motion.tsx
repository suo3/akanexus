import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sparkles, Play } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EasingCurve {
    name: string;
    value: string;
    cubic: [number, number, number, number];
}

const EASING_PRESETS: EasingCurve[] = [
    { name: 'Linear', value: 'linear', cubic: [0, 0, 1, 1] },
    { name: 'Ease', value: 'ease', cubic: [0.25, 0.1, 0.25, 1] },
    { name: 'Ease In', value: 'ease-in', cubic: [0.42, 0, 1, 1] },
    { name: 'Ease Out', value: 'ease-out', cubic: [0, 0, 0.58, 1] },
    { name: 'Ease In Out', value: 'ease-in-out', cubic: [0.42, 0, 0.58, 1] },
    { name: 'Bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', cubic: [0.68, -0.55, 0.265, 1.55] },
    { name: 'Elastic', value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', cubic: [0.175, 0.885, 0.32, 1.275] },
];

const DURATION_PRESETS = [
    { name: 'Instant', value: '75ms' },
    { name: 'Fast', value: '150ms' },
    { name: 'Normal', value: '300ms' },
    { name: 'Slow', value: '500ms' },
    { name: 'Slower', value: '700ms' },
];

const MotionFoundation = () => {
    const { motion, updateMotion } = useDesignSystemStore();

    // Use local state for UI controls
    const [selectedEasing, setSelectedEasing] = useState(EASING_PRESETS[1]);
    const [duration, setDuration] = useState(motion.durations.normal || 300);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationType, setAnimationType] = useState<'fade' | 'slide' | 'scale' | 'rotate'>('fade');

    // Sync duration with store when it changes (for undo/redo)
    React.useEffect(() => {
        if (motion.durations.normal && motion.durations.normal !== duration) {
            setDuration(motion.durations.normal);
        }
    }, [motion.durations.normal]);

    const updateEasing = (curve: EasingCurve) => {
        setSelectedEasing(curve);
        // Update the easing in the store
        const easingKey = curve.name.toLowerCase().replace(/ /g, '-');
        updateMotion({
            easings: {
                ...motion.easings,
                [easingKey]: curve.value
            }
        });
    };

    const updateDuration = (value: number) => {
        setDuration(value);
        updateMotion({
            durations: {
                ...motion.durations,
                normal: value
            }
        });
    };

    const playAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), duration + 100);
    };

    const getAnimationStyle = () => {
        const baseStyle = {
            transition: `all ${duration}ms ${selectedEasing.value}`,
        };

        if (!isAnimating) return baseStyle;

        switch (animationType) {
            case 'fade':
                return { ...baseStyle, opacity: 0 };
            case 'slide':
                return { ...baseStyle, transform: 'translateX(100px)' };
            case 'scale':
                return { ...baseStyle, transform: 'scale(1.5)' };
            case 'rotate':
                return { ...baseStyle, transform: 'rotate(180deg)' };
            default:
                return baseStyle;
        }
    };

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-none bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight uppercase">TIMING_ENGINE</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-90">
                                FOUNDATION_CORE_v1.0
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        {/* Easing Curves */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                EASING_CURVE
                            </Label>
                            <Select
                                value={selectedEasing.name}
                                onValueChange={(value) => {
                                    const curve = EASING_PRESETS.find((e) => e.name === value);
                                    if (curve) updateEasing(curve);
                                }}
                            >
                                <SelectTrigger className="rounded-none mono-label">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {EASING_PRESETS.map((curve) => (
                                        <SelectItem key={curve.name} value={curve.name}>
                                            {curve.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="p-3 bg-muted/50 border rounded-none">
                                <p className="text-[10px] font-mono font-bold text-primary mono-label uppercase">
                                    VALUE: {selectedEasing.value}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Duration */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                    DURATION_MS
                                </Label>
                                <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-none border border-primary/20">
                                    {duration}MS
                                </span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="2000"
                                step="50"
                                value={duration}
                                onChange={(e) => updateDuration(parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <div className="grid grid-cols-3 gap-2">
                                {DURATION_PRESETS.map((preset) => (
                                    <Button
                                        key={preset.name}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateDuration(parseInt(preset.value))}
                                        className="h-7 text-[10px] rounded-none mono-label uppercase"
                                    >
                                        {preset.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Animation Type */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                ANIM_UNIT_TYPE
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['fade', 'slide', 'scale', 'rotate'] as const).map((type) => (
                                    <Button
                                        key={type}
                                        size="sm"
                                        variant={animationType === type ? 'default' : 'outline'}
                                        onClick={() => setAnimationType(type)}
                                        className="h-9 text-[10px] rounded-none mono-label uppercase"
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Cubic Bezier Editor */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                CUBIC_VAL_PATH
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedEasing.cubic.map((value, index) => (
                                    <div key={index} className="space-y-2">
                                        <Label className="text-[10px] mono-label uppercase opacity-90">
                                            {index < 2 ? `P1.${index === 0 ? 'X' : 'Y'}` : `P2.${index === 2 ? 'X' : 'Y'}`}
                                        </Label>
                                        <Input
                                            type="number"
                                            min="-2"
                                            max="2"
                                            step="0.01"
                                            value={value}
                                            onChange={(e) => {
                                                const newCubic = [...selectedEasing.cubic] as [number, number, number, number];
                                                newCubic[index] = parseFloat(e.target.value);
                                                const newCurve = {
                                                    ...selectedEasing,
                                                    cubic: newCubic,
                                                    value: `cubic-bezier(${newCubic.join(', ')})`,
                                                };
                                                updateEasing(newCurve);
                                            }}
                                            className="h-8 text-xs font-mono"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Spring Physics (Placeholder) */}
                        <div className="space-y-3 opacity-30">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                SPRING_DYNAMICS
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Advanced spring-based animations coming soon
                            </p>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-muted/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono-label">
                        ANIMATION_PLAYGROUND_v2
                    </h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* Main Animation Preview */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                    LIVE_DEBUG_PORT
                                </h4>
                                <Button onClick={playAnimation} className="gap-2 rounded-none mono-label text-[10px] uppercase">
                                    <Play className="w-3 h-3" />
                                    EXEC_ANIM
                                </Button>
                            </div>
                            <div className="flex items-center justify-center p-24 bg-muted/20 border border-dashed rounded-none min-h-[400px]">
                                <div
                                    className="w-32 h-32 bg-primary rounded-none border border-primary flex items-center justify-center"
                                    style={getAnimationStyle()}
                                >
                                    <Sparkles className="w-12 h-12 text-primary-foreground" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Easing Curve Visualization */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                CURVE_VISUALIZER
                            </h4>
                            <div className="p-8 border rounded-none bg-muted/5">
                                <svg viewBox="0 0 200 200" className="w-full h-64">
                                    {/* Grid */}
                                    <line x1="0" y1="200" x2="200" y2="200" stroke="currentColor" strokeOpacity="0.1" />
                                    <line x1="0" y1="0" x2="0" y2="200" stroke="currentColor" strokeOpacity="0.1" />
                                    <line x1="200" y1="0" x2="200" y2="200" stroke="currentColor" strokeOpacity="0.1" />
                                    <line x1="0" y1="0" x2="200" y2="0" stroke="currentColor" strokeOpacity="0.1" />

                                    {/* Bezier Curve */}
                                    <path
                                        d={`M 0 200 C ${selectedEasing.cubic[0] * 200} ${200 - selectedEasing.cubic[1] * 200}, ${selectedEasing.cubic[2] * 200} ${200 - selectedEasing.cubic[3] * 200}, 200 0`}
                                        fill="none"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth="3"
                                    />

                                    {/* Control Points */}
                                    <circle
                                        cx={selectedEasing.cubic[0] * 200}
                                        cy={200 - selectedEasing.cubic[1] * 200}
                                        r="4"
                                        fill="hsl(var(--primary))"
                                    />
                                    <circle
                                        cx={selectedEasing.cubic[2] * 200}
                                        cy={200 - selectedEasing.cubic[3] * 200}
                                        r="4"
                                        fill="hsl(var(--primary))"
                                    />
                                </svg>
                            </div>
                        </div>

                        <Separator />

                        {/* Duration Comparison */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                DURATION_SCALE_MAP
                            </h4>
                            <div className="space-y-4">
                                {DURATION_PRESETS.map((preset) => (
                                    <div key={preset.name} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold uppercase mono-label">{preset.name}</span>
                                            <span className="text-[10px] font-mono text-muted-foreground mono-label">{preset.value}</span>
                                        </div>
                                        <div className="h-1 bg-muted rounded-none overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{
                                                    width: `${(parseInt(preset.value) / 2000) * 100}%`,
                                                    transition: 'width 300ms ease',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Common Animations */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                COMMON_BEHAVIORS
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 border rounded-none bg-muted/5 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-90">
                                        INTERACTION_HOVER
                                    </p>
                                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-none font-bold uppercase text-[10px] tracking-widest mono-label transition-transform hover:scale-105 duration-200">
                                        ACTION_BTN
                                    </button>
                                </div>

                                <div className="p-6 border rounded-none bg-muted/5 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-90">
                                        VISIBILITY_FADE
                                    </p>
                                    <div className="w-full h-20 bg-primary/20 border border-dashed border-primary/30 rounded-none animate-in fade-in duration-500" />
                                </div>

                                <div className="p-6 border rounded-none bg-muted/5 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-90">
                                        TRANSITION_SLIDE
                                    </p>
                                    <div className="w-full h-20 bg-primary/20 border border-dashed border-primary/30 rounded-none animate-in slide-in-from-bottom duration-500" />
                                </div>

                                <div className="p-6 border rounded-none bg-muted/5 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-90">
                                        BEAT_PULSE
                                    </p>
                                    <div className="w-full h-20 bg-primary/20 border border-dashed border-primary/30 rounded-none animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default MotionFoundation;
