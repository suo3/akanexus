import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Grid3x3, Plus, Trash2 } from 'lucide-react';

interface SpacingTokens {
    baseUnit: number;
    scale: Record<string, string>;
}

interface GridTokens {
    columns: number;
    gutter: string;
    margin: string;
    maxWidth: string;
}

interface BreakpointTokens {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
}

const SpacingFoundation = () => {
    const { tokens, updateTokens } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('spacing');

    // Default spacing scale (based on 4px or 8px base)
    const [spacingScale, setSpacingScale] = useState<Record<string, string>>({
        '0': '0px',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
    });

    const [gridConfig, setGridConfig] = useState<GridTokens>({
        columns: 12,
        gutter: '1.5rem',
        margin: '1rem',
        maxWidth: '1280px',
    });

    const [breakpoints, setBreakpoints] = useState<BreakpointTokens>({
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    });

    const generateSpacingScale = (baseUnit: number) => {
        const scale: Record<string, string> = {
            '0': '0px',
        };

        // Generate scale based on base unit
        [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64].forEach((multiplier) => {
            scale[multiplier.toString()] = `${(baseUnit * multiplier) / 16}rem`;
        });

        setSpacingScale(scale);
    };

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Grid3x3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Spacing & Grids</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
                                Foundation
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="spacing" className="text-xs">Spacing</TabsTrigger>
                                <TabsTrigger value="grid" className="text-xs">Grid</TabsTrigger>
                                <TabsTrigger value="breakpoints" className="text-xs">Breakpoints</TabsTrigger>
                            </TabsList>

                            <TabsContent value="spacing" className="space-y-6 mt-6">
                                {/* Base Unit */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                            Base Unit
                                        </Label>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => generateSpacingScale(4)}
                                                className="h-7 text-xs"
                                            >
                                                4px
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => generateSpacingScale(8)}
                                                className="h-7 text-xs"
                                            >
                                                8px
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Generate a spacing scale based on 4px or 8px increments
                                    </p>
                                </div>

                                <Separator />

                                {/* Spacing Scale */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                            Spacing Scale
                                        </Label>
                                        <Button size="sm" variant="ghost" className="h-7 gap-1.5">
                                            <Plus className="w-3 h-3" />
                                            Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {Object.entries(spacingScale).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-2 group">
                                                <Input
                                                    value={key}
                                                    readOnly
                                                    className="w-16 h-8 text-xs font-mono"
                                                />
                                                <Input
                                                    value={value}
                                                    onChange={(e) =>
                                                        setSpacingScale({ ...spacingScale, [key]: e.target.value })
                                                    }
                                                    className="flex-1 h-8 text-xs font-mono"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="grid" className="space-y-6 mt-6">
                                {/* Columns */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Columns
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="24"
                                        value={gridConfig.columns}
                                        onChange={(e) =>
                                            setGridConfig({ ...gridConfig, columns: parseInt(e.target.value) })
                                        }
                                        className="h-9"
                                    />
                                </div>

                                {/* Gutter */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Gutter
                                    </Label>
                                    <Input
                                        value={gridConfig.gutter}
                                        onChange={(e) => setGridConfig({ ...gridConfig, gutter: e.target.value })}
                                        className="h-9 font-mono"
                                    />
                                </div>

                                {/* Margin */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Container Margin
                                    </Label>
                                    <Input
                                        value={gridConfig.margin}
                                        onChange={(e) => setGridConfig({ ...gridConfig, margin: e.target.value })}
                                        className="h-9 font-mono"
                                    />
                                </div>

                                {/* Max Width */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Max Width
                                    </Label>
                                    <Input
                                        value={gridConfig.maxWidth}
                                        onChange={(e) => setGridConfig({ ...gridConfig, maxWidth: e.target.value })}
                                        className="h-9 font-mono"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="breakpoints" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Responsive Breakpoints
                                    </Label>
                                    {Object.entries(breakpoints).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <Label className="text-xs capitalize">{key}</Label>
                                            <Input
                                                value={value}
                                                onChange={(e) =>
                                                    setBreakpoints({ ...breakpoints, [key]: e.target.value })
                                                }
                                                className="h-9 font-mono"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
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
                        {/* Spacing Scale Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Spacing Scale
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(spacingScale).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-6">
                                        <span className="text-xs font-mono text-muted-foreground w-12">
                                            {key}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground/50 w-20">
                                            {value}
                                        </span>
                                        <div
                                            style={{ width: value }}
                                            className="h-8 bg-primary/20 border-2 border-primary rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Grid Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Grid System ({gridConfig.columns} Columns)
                            </h4>
                            <div
                                className="border rounded-xl p-4 bg-card"
                                style={{ maxWidth: gridConfig.maxWidth, margin: '0 auto' }}
                            >
                                <div
                                    className="grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
                                        gap: gridConfig.gutter,
                                    }}
                                >
                                    {Array.from({ length: gridConfig.columns }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-20 bg-primary/10 border border-primary/30 rounded flex items-center justify-center text-xs font-mono text-primary"
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Breakpoints Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Breakpoints
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(breakpoints).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-6 p-4 border rounded-lg bg-card">
                                        <span className="text-sm font-bold uppercase w-12">{key}</span>
                                        <span className="text-sm font-mono text-muted-foreground">{value}</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${(parseInt(value) / 1536) * 100}%` }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default SpacingFoundation;
