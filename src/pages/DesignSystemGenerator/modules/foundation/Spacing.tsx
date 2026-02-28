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
    const { spacing, updateSpacing } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('spacing');

    const generateSpacingScale = (baseUnit: number) => {
        const scale: Record<string, string> = {
            '0': '0px',
        };

        // Generate scale based on base unit
        [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64].forEach((multiplier) => {
            scale[multiplier.toString()] = `${(baseUnit * multiplier) / 16}rem`;
        });

        updateSpacing({ scale });
    };

    const addSpacingEntry = () => {
        // Find the next available key
        const existingKeys = Object.keys(spacing.scale).map(k => parseInt(k)).filter(k => !isNaN(k));
        const maxKey = Math.max(...existingKeys, 0);
        const newKey = (maxKey + 4).toString();

        updateSpacing({
            scale: {
                ...spacing.scale,
                [newKey]: '1rem',
            },
        });
    };

    const removeSpacingEntry = (key: string) => {
        const newScale = { ...spacing.scale };
        delete newScale[key];
        updateSpacing({ scale: newScale });
    };

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-none bg-primary/10 flex items-center justify-center">
                            <Grid3x3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight uppercase">SPACE_SYSTEM</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-90">
                                FOUNDATION_CORE_v1.0
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full rounded-none">
                                <TabsTrigger value="spacing" className="text-xs rounded-none mono-label uppercase">SPACING</TabsTrigger>
                                <TabsTrigger value="grid" className="text-xs rounded-none mono-label uppercase">GRID</TabsTrigger>
                                <TabsTrigger value="breakpoints" className="text-xs rounded-none mono-label uppercase">POINTS</TabsTrigger>
                            </TabsList>

                            <TabsContent value="spacing" className="space-y-6 mt-6">
                                {/* Base Unit */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                            BASE_UNIT
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
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono-label">
                                        GENERATE_SCALE_FROM_STEP
                                    </p>
                                </div>

                                <Separator />

                                {/* Spacing Scale */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                            SPACE_SCALE
                                        </Label>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 gap-1.5"
                                            onClick={addSpacingEntry}
                                        >
                                            <Plus className="w-3 h-3" />
                                            ADD_SCALE
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {Object.entries(spacing.scale).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-2 group">
                                                <Input
                                                    value={key}
                                                    readOnly
                                                    className="w-16 h-8 text-xs font-mono rounded-none"
                                                />
                                                <Input
                                                    value={value}
                                                    onChange={(e) =>
                                                        updateSpacing({ scale: { ...spacing.scale, [key]: e.target.value } })
                                                    }
                                                    className="flex-1 h-8 text-xs font-mono rounded-none"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                                    onClick={() => removeSpacingEntry(key)}
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
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                        GRID_COLUMNS
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="24"
                                        value={spacing.grid.columns}
                                        onChange={(e) =>
                                            updateSpacing({ grid: { ...spacing.grid, columns: parseInt(e.target.value) } })
                                        }
                                        className="h-9 rounded-none mono-label"
                                    />
                                </div>

                                {/* Gutter */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                        GUTTER_SIZE
                                    </Label>
                                    <Input
                                        value={spacing.grid.gutter}
                                        onChange={(e) => updateSpacing({ grid: { ...spacing.grid, gutter: e.target.value } })}
                                        className="h-9 font-mono"
                                    />
                                </div>

                                {/* Margin */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                        PAGE_MARGIN
                                    </Label>
                                    <Input
                                        value={spacing.grid.margin}
                                        onChange={(e) => {
                                            updateSpacing({ grid: { ...spacing.grid, margin: e.target.value } });
                                        }}
                                        className="h-9 font-mono"
                                    />
                                </div>

                                {/* Max Width */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                        VIEW_PORT_MAX
                                    </Label>
                                    <Input
                                        value={spacing.grid.maxWidth}
                                        onChange={(e) => {
                                            updateSpacing({ grid: { ...spacing.grid, maxWidth: e.target.value } });
                                        }}
                                        className="h-9 font-mono"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="breakpoints" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                        RESPONSIVE_BREAKS
                                    </Label>
                                    {Object.entries(spacing.breakpoints).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <Label className="text-xs capitalize">{key}</Label>
                                            <Input
                                                value={value}
                                                onChange={(e) =>
                                                    updateSpacing({ breakpoints: { ...spacing.breakpoints, [key]: e.target.value } })
                                                }
                                                className="h-9 font-mono rounded-none"
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
                <div className="border-b px-8 py-5 bg-muted/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono-label">
                        SPACE_PREVIEW_PORT
                    </h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* Spacing Scale Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                SPACING_SCALE_RENDER
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(spacing.scale).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-6">
                                        <span className="text-xs font-mono text-muted-foreground w-12">
                                            {key}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground/50 w-20">
                                            {value}
                                        </span>
                                        <div
                                            style={{ width: value }}
                                            className="h-8 bg-primary/20 border-2 border-primary rounded-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Grid Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                GRID_SCHEMA ({spacing.grid.columns}_COL)
                            </h4>
                            <div className="space-y-2">
                                <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                                    <span>Max Width: {spacing.grid.maxWidth}</span>
                                    <span>Margin: {spacing.grid.margin}</span>
                                    <span>Gutter: {spacing.grid.gutter}</span>
                                </div>
                                <div
                                    className="border-2 border-dashed border-muted-foreground/30 rounded-none bg-muted/20"
                                    style={{
                                        maxWidth: spacing.grid.maxWidth,
                                        margin: `${spacing.grid.margin} auto`,
                                        padding: spacing.grid.margin
                                    }}
                                >
                                    <div
                                        className="border rounded-none p-4 bg-card/50"
                                    >
                                        <div
                                            className="grid"
                                            style={{
                                                gridTemplateColumns: `repeat(${spacing.grid.columns}, 1fr)`,
                                                gap: spacing.grid.gutter,
                                            }}
                                        >
                                            {Array.from({ length: spacing.grid.columns }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-20 bg-primary/10 border border-primary/30 rounded-none flex items-center justify-center text-xs font-mono text-primary mono-label"
                                                >
                                                    {i + 1}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Breakpoints Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                BREAK_POINTS
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(spacing.breakpoints).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-6 p-4 border rounded-none bg-muted/5">
                                        <span className="text-sm font-bold uppercase w-12 mono-label">{key}</span>
                                        <span className="text-sm font-mono text-muted-foreground">{value}</span>
                                        <div className="flex-1 h-2 bg-muted rounded-none overflow-hidden">
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
