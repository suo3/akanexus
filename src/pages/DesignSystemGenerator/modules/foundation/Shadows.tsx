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
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [shadowConfig, setShadowConfig] = useState({
        x: 0,
        y: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 0.1,
    });

    const [elevationLevels, setElevationLevels] = useState<ElevationLevel[]>([
        { level: 0, shadows: [] },
        { level: 1, shadows: [{ id: '1', name: 'sm', x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.1 }] },
        { level: 2, shadows: [{ id: '2', name: 'md', x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1 }] },
        { level: 3, shadows: [{ id: '3', name: 'lg', x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1 }] },
        { level: 4, shadows: [{ id: '4', name: 'xl', x: 0, y: 20, blur: 25, spread: -5, color: '#000000', opacity: 0.1 }] },
        { level: 5, shadows: [{ id: '5', name: '2xl', x: 0, y: 25, blur: 50, spread: -12, color: '#000000', opacity: 0.25 }] },
    ]);

    const generateShadowCSS = (shadow: ShadowToken): string => {
        const rgba = `rgba(${parseInt(shadow.color.slice(1, 3), 16)}, ${parseInt(shadow.color.slice(3, 5), 16)}, ${parseInt(shadow.color.slice(5, 7), 16)}, ${shadow.opacity})`;
        return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${rgba}`;
    };

    const applyPreset = (preset: 'material' | 'ios') => {
        const presetData = PRESET_SHADOWS[preset];
        // This would update the elevation levels based on preset
        console.log('Applying preset:', preset);
    };

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Box className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Shadows & Elevation</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
                                Foundation
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        {/* Presets */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Presets
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => applyPreset('material')}
                                    className="h-9 text-xs"
                                >
                                    Material Design
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => applyPreset('ios')}
                                    className="h-9 text-xs"
                                >
                                    iOS
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Elevation Level Selector */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Elevation Level
                            </Label>
                            <Select
                                value={selectedLevel.toString()}
                                onValueChange={(value) => setSelectedLevel(parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {elevationLevels.map((level) => (
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
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Shadow Properties
                            </Label>

                            {/* X Offset */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs">X Offset</Label>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {shadowConfig.x}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={shadowConfig.x}
                                    onChange={(e) =>
                                        setShadowConfig({ ...shadowConfig, x: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Y Offset */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs">Y Offset</Label>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {shadowConfig.y}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={shadowConfig.y}
                                    onChange={(e) =>
                                        setShadowConfig({ ...shadowConfig, y: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Blur */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs">Blur</Label>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {shadowConfig.blur}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={shadowConfig.blur}
                                    onChange={(e) =>
                                        setShadowConfig({ ...shadowConfig, blur: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Spread */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs">Spread</Label>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {shadowConfig.spread}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    value={shadowConfig.spread}
                                    onChange={(e) =>
                                        setShadowConfig({ ...shadowConfig, spread: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Opacity */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs">Opacity</Label>
                                    <span className="text-xs font-mono text-muted-foreground">
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
                                        setShadowConfig({ ...shadowConfig, opacity: parseFloat(e.target.value) })
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            {/* Color */}
                            <div className="space-y-2">
                                <Label className="text-xs">Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={shadowConfig.color}
                                        onChange={(e) => setShadowConfig({ ...shadowConfig, color: e.target.value })}
                                        className="w-16 h-9 p-1"
                                    />
                                    <Input
                                        value={shadowConfig.color}
                                        onChange={(e) => setShadowConfig({ ...shadowConfig, color: e.target.value })}
                                        className="flex-1 h-9 font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* CSS Output */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                CSS Output
                            </Label>
                            <div className="relative">
                                <pre className="text-xs font-mono bg-muted p-3 rounded-lg overflow-x-auto">
                                    {generateShadowCSS({
                                        id: '1',
                                        name: 'custom',
                                        ...shadowConfig,
                                    })}
                                </pre>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            generateShadowCSS({ id: '1', name: 'custom', ...shadowConfig })
                                        );
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
                <div className="border-b px-8 py-5 bg-card/30">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Live Preview
                    </h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* Current Shadow Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Current Shadow
                            </h4>
                            <div className="flex items-center justify-center p-16 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
                                <div
                                    className="w-64 h-64 bg-card rounded-2xl flex items-center justify-center"
                                    style={{
                                        boxShadow: generateShadowCSS({
                                            id: '1',
                                            name: 'custom',
                                            ...shadowConfig,
                                        }),
                                    }}
                                >
                                    <p className="text-sm text-muted-foreground">Shadow Preview</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Elevation Levels */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Elevation System
                            </h4>
                            <div className="grid grid-cols-3 gap-6">
                                {elevationLevels.map((level) => (
                                    <div key={level.level} className="space-y-3">
                                        <p className="text-xs font-bold text-muted-foreground">
                                            Level {level.level}
                                        </p>
                                        <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-8 flex items-center justify-center">
                                            <div
                                                className="w-full h-full bg-card rounded-xl flex items-center justify-center"
                                                style={{
                                                    boxShadow: level.shadows
                                                        .map((s) => generateShadowCSS(s))
                                                        .join(', '),
                                                }}
                                            >
                                                <span className="text-2xl font-black text-muted-foreground/30">
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
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Common Use Cases
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Button
                                    </p>
                                    <button
                                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold"
                                        style={{
                                            boxShadow: elevationLevels[1].shadows
                                                .map((s) => generateShadowCSS(s))
                                                .join(', '),
                                        }}
                                    >
                                        Click Me
                                    </button>
                                </div>

                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Card
                                    </p>
                                    <div
                                        className="p-4 bg-background rounded-lg"
                                        style={{
                                            boxShadow: elevationLevels[2].shadows
                                                .map((s) => generateShadowCSS(s))
                                                .join(', '),
                                        }}
                                    >
                                        <p className="text-sm">Card content</p>
                                    </div>
                                </div>

                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Modal
                                    </p>
                                    <div
                                        className="p-4 bg-background rounded-lg"
                                        style={{
                                            boxShadow: elevationLevels[4].shadows
                                                .map((s) => generateShadowCSS(s))
                                                .join(', '),
                                        }}
                                    >
                                        <p className="text-sm">Modal dialog</p>
                                    </div>
                                </div>

                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Dropdown
                                    </p>
                                    <div
                                        className="p-4 bg-background rounded-lg"
                                        style={{
                                            boxShadow: elevationLevels[3].shadows
                                                .map((s) => generateShadowCSS(s))
                                                .join(', '),
                                        }}
                                    >
                                        <p className="text-sm">Dropdown menu</p>
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
