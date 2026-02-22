import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Box, Copy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShadowToken {
    id: string;
    name: string;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
}

interface ElevationLevel {
    level: number;
    shadows: ShadowToken[];
}

const PRESET_SHADOWS = {
    material: [
        { level: 0, shadow: '0 0 0 0 rgba(0,0,0,0)' },
        { level: 1, shadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)' },
        { level: 2, shadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
        { level: 3, shadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
        { level: 4, shadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' },
        { level: 5, shadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    ],
    ios: [
        { level: 0, shadow: '0 0 0 0 rgba(0,0,0,0)' },
        { level: 1, shadow: '0 1px 2px 0 rgba(0,0,0,0.05)' },
        { level: 2, shadow: '0 2px 4px 0 rgba(0,0,0,0.06)' },
        { level: 3, shadow: '0 4px 8px 0 rgba(0,0,0,0.08)' },
        { level: 4, shadow: '0 8px 16px 0 rgba(0,0,0,0.1)' },
        { level: 5, shadow: '0 16px 32px 0 rgba(0,0,0,0.12)' },
    ],
};

const ShadowsFoundation = () => {
    const { shadows, updateShadows } = useDesignSystemStore();
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [shadowConfig, setShadowConfig] = useState({
        x: 0,
        y: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 0.1,
    });

    // Sync shadowConfig with selected level from store
    React.useEffect(() => {
        const currentLevel = shadows.levels.find(l => l.level === selectedLevel);
        if (currentLevel && currentLevel.shadow) {
            // Parse the shadow string to extract values
            // For now, just use the shadow string directly
            // In a full implementation, you'd parse the CSS shadow string
        }
    }, [selectedLevel, shadows.levels]);

    const generateShadowCSS = (shadow: ShadowToken): string => {
        const rgba = `rgba(${parseInt(shadow.color.slice(1, 3), 16)}, ${parseInt(shadow.color.slice(3, 5), 16)}, ${parseInt(shadow.color.slice(5, 7), 16)}, ${shadow.opacity})`;
        return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${rgba}`;
    };

    const updateCurrentShadow = (updates: Partial<typeof shadowConfig>) => {
        const newConfig = { ...shadowConfig, ...updates };
        setShadowConfig(newConfig);

        // Generate CSS and update the store
        const shadowCSS = `${newConfig.x}px ${newConfig.y}px ${newConfig.blur}px ${newConfig.spread}px rgba(${parseInt(newConfig.color.slice(1, 3), 16)}, ${parseInt(newConfig.color.slice(3, 5), 16)}, ${parseInt(newConfig.color.slice(5, 7), 16)}, ${newConfig.opacity})`;

        updateShadowLevel(selectedLevel, { shadow: shadowCSS });
    };

    const applyPreset = (preset: 'material' | 'ios') => {
        const presetData = PRESET_SHADOWS[preset];
        const newLevels = presetData.map((p, index) => ({
            level: p.level,
            name: index === 0 ? 'none' : index === 1 ? 'sm' : index === 2 ? 'base' : index === 3 ? 'md' : index === 4 ? 'lg' : index === 5 ? 'xl' : '2xl',
            shadow: p.shadow,
            description: `Level ${p.level} shadow`,
        }));
        updateShadows({ levels: newLevels });
    };

    const updateShadowLevel = (level: number, updates: Partial<typeof shadows.levels[0]>) => {
        const newLevels = shadows.levels.map(l =>
            l.level === level ? { ...l, ...updates } : l
        );
        updateShadows({ levels: newLevels });
    };

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-none bg-primary/10 flex items-center justify-center">
                            <Box className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight uppercase">SHADOW_ENGINE</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                FOUNDATION_CORE_v1.0
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        {/* Presets */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mono-label">
                                SHADOW_PRESETS
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => applyPreset('material')}
                                    className="h-9 text-xs rounded-none mono-label uppercase"
                                >
                                    MATERIAL_ST
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => applyPreset('ios')}
                                    className="h-9 text-xs rounded-none mono-label uppercase"
                                >
                                    IOS_BASE
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Elevation Level Selector */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mono-label">
                                ELEVATION_LVL
                            </Label>
                            <Select
                                value={selectedLevel.toString()}
                                onValueChange={(value) => setSelectedLevel(parseInt(value))}
                            >
                                <SelectTrigger className="rounded-none mono-label">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {shadows.levels.map((level) => (
                                        <SelectItem key={level.level} value={level.level.toString()}>
                                            Level {level.level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        {/* Shadow Editor */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mono-label">
                                SHADOW_PROPS
                            </Label>

                            {/* X Offset */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs uppercase mono-label opacity-60">OFFSET_X</Label>
                                    <span className="text-xs font-mono text-primary font-bold">
                                        {shadowConfig.x}PX
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={shadowConfig.x}
                                    onChange={(e) =>
                                        updateCurrentShadow({ x: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Y Offset */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs uppercase mono-label opacity-60">OFFSET_Y</Label>
                                    <span className="text-xs font-mono text-primary font-bold">
                                        {shadowConfig.y}PX
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={shadowConfig.y}
                                    onChange={(e) =>
                                        updateCurrentShadow({ y: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Blur */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs uppercase mono-label opacity-60">BLUR_RADIUS</Label>
                                    <span className="text-xs font-mono text-primary font-bold">
                                        {shadowConfig.blur}PX
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={shadowConfig.blur}
                                    onChange={(e) =>
                                        updateCurrentShadow({ blur: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Spread */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs uppercase mono-label opacity-60">SPREAD_RADIUS</Label>
                                    <span className="text-xs font-mono text-primary font-bold">
                                        {shadowConfig.spread}PX
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={shadowConfig.spread}
                                    onChange={(e) =>
                                        updateCurrentShadow({ spread: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Opacity */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs uppercase mono-label opacity-60">OPACITY_VAL</Label>
                                    <span className="text-xs font-mono text-primary font-bold">
                                        {(shadowConfig.opacity * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={shadowConfig.opacity}
                                    onChange={(e) =>
                                        updateCurrentShadow({ opacity: parseFloat(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Color */}
                            <div className="space-y-2">
                                <Label className="text-xs uppercase mono-label opacity-60">HEX_COLOR</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={shadowConfig.color}
                                        onChange={(e) => updateCurrentShadow({ color: e.target.value })}
                                        className="w-16 h-9 p-1 rounded-none"
                                    />
                                    <Input
                                        value={shadowConfig.color}
                                        onChange={(e) => updateCurrentShadow({ color: e.target.value })}
                                        className="flex-1 h-9 font-mono text-xs rounded-none mono-label"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* CSS Output */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mono-label">
                                CSS_SOURCE_CODE
                            </Label>
                            <div className="relative">
                                <pre className="text-xs font-mono bg-muted/50 p-3 rounded-none border border-dashed overflow-x-auto mono-label">
                                    {shadows.levels.find(l => l.level === selectedLevel)?.shadow || 'none'}
                                </pre>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => {
                                        const shadowCSS = shadows.levels.find(l => l.level === selectedLevel)?.shadow || 'none';
                                        navigator.clipboard.writeText(shadowCSS);
                                    }}
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-muted/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono-label">
                        SHADOW_RENDER_PORT
                    </h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* Current Shadow Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 mono-label">
                                SELECTED_LVL: {selectedLevel}
                            </h4>
                            <div className="flex items-center justify-center p-16 bg-muted/20 border border-dashed rounded-none">
                                <div
                                    className="w-64 h-64 bg-card rounded-none border flex items-center justify-center"
                                    style={{
                                        boxShadow: shadows.levels.find(l => l.level === selectedLevel)?.shadow || 'none',
                                    }}
                                >
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 mono-label">LVL_{selectedLevel}_RENDER</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Elevation Levels */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 mono-label">
                                ELEVATION_MATRIX
                            </h4>
                            <div className="grid grid-cols-3 gap-6">
                                {shadows.levels.map((level) => (
                                    <div key={level.level} className="space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                            LVL_{level.level} » {level.name.toUpperCase()}
                                        </p>
                                        <div className="aspect-square bg-muted/10 border border-dashed rounded-none p-8 flex items-center justify-center">
                                            <div
                                                className="w-full h-full bg-card rounded-none border border-border/50 flex items-center justify-center"
                                                style={{
                                                    boxShadow: level.shadow,
                                                }}
                                            >
                                                <span className="text-2xl font-black text-muted-foreground/10 mono-label">
                                                    {level.level}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Use Cases */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 mono-label">
                                COMPONENT_USE_CASES
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 border rounded-none bg-muted/5 space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                        CTRL_BUTTON
                                    </p>
                                    <button
                                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-none font-bold uppercase text-xs tracking-widest mono-label"
                                        style={{
                                            boxShadow: shadows.levels[1]?.shadow || 'none',
                                        }}
                                    >
                                        BTN_UNIT
                                    </button>
                                </div>

                                <div className="p-6 border rounded-none bg-muted/5 space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                        DATA_CONTAINER
                                    </p>
                                    <div
                                        className="p-4 bg-background border rounded-none"
                                        style={{
                                            boxShadow: shadows.levels[2]?.shadow || 'none',
                                        }}
                                    >
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-40 mono-label">STORAGE_UNIT_v1.0</p>
                                    </div>
                                </div>

                                <div className="p-6 border rounded-none bg-muted/5 space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                        OVERLAY_DIALOG
                                    </p>
                                    <div
                                        className="p-4 bg-background border rounded-none"
                                        style={{
                                            boxShadow: shadows.levels[4]?.shadow || 'none',
                                        }}
                                    >
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-40 mono-label">MODAL_PRIME</p>
                                    </div>
                                </div>

                                <div className="p-6 border rounded-none bg-muted/5 space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                        POP_MENU
                                    </p>
                                    <div
                                        className="p-4 bg-background border rounded-none"
                                        style={{
                                            boxShadow: shadows.levels[3]?.shadow || 'none',
                                        }}
                                    >
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-40 mono-label">DROP_SELECTION</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default ShadowsFoundation;
