import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Type, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Popular Google Fonts
const GOOGLE_FONTS = {
    sans: [
        'Inter',
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Poppins',
        'Raleway',
        'Ubuntu',
    ],
    serif: [
        'Merriweather',
        'Playfair Display',
        'Lora',
        'PT Serif',
        'Crimson Text',
        'Libre Baskerville',
    ],
    mono: [
        'JetBrains Mono',
        'Fira Code',
        'Source Code Pro',
        'IBM Plex Mono',
        'Roboto Mono',
        'Inconsolata',
    ],
};

const SCALE_RATIOS = [
    { name: 'Minor Second', value: 1.067 },
    { name: 'Major Second', value: 1.125 },
    { name: 'Minor Third', value: 1.2 },
    { name: 'Major Third', value: 1.25 },
    { name: 'Perfect Fourth', value: 1.333 },
    { name: 'Augmented Fourth', value: 1.414 },
    { name: 'Perfect Fifth', value: 1.5 },
    { name: 'Golden Ratio', value: 1.618 },
];

const TypographyFoundation = () => {
    const { typography, updateTypography } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('families');

    // Function to load Google Fonts dynamically
    const loadGoogleFont = (fontName: string) => {
        // Check if font is already loaded
        const existingLink = document.querySelector(`link[href*="${fontName.replace(/\s/g, '+')}"]`);
        if (existingLink) return;

        // Create and append link element for Google Fonts
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s/g, '+')}:wght@100;300;400;500;600;700;800;900&display=swap`;
        document.head.appendChild(link);
    };

    // Load fonts when typography changes
    React.useEffect(() => {
        const sansFont = typography.fontFamilies.sans.split(',')[0].trim();
        const serifFont = typography.fontFamilies.serif.split(',')[0].trim();
        const monoFont = typography.fontFamilies.mono.split(',')[0].trim();

        loadGoogleFont(sansFont);
        loadGoogleFont(serifFont);
        loadGoogleFont(monoFont);
    }, [typography.fontFamilies]);

    const updateFontFamily = (category: 'sans' | 'serif' | 'mono', value: string) => {
        console.log('updateFontFamily called:', { category, value });
        console.log('Current fontFamilies:', typography.fontFamilies);

        const newFontFamilies = {
            ...typography.fontFamilies,
            [category]: value,
        };

        console.log('New fontFamilies:', newFontFamilies);

        updateTypography({
            fontFamilies: newFontFamilies,
        });
    };

    const updateFontWeight = (key: keyof typeof typography.fontWeights, value: number) => {
        updateTypography({
            fontWeights: {
                ...typography.fontWeights,
                [key]: value,
            },
        });
    };

    const updateLineHeight = (key: keyof typeof typography.lineHeights, value: number) => {
        updateTypography({
            lineHeights: {
                ...typography.lineHeights,
                [key]: value,
            },
        });
    };

    const updateLetterSpacing = (key: keyof typeof typography.letterSpacing, value: string) => {
        updateTypography({
            letterSpacing: {
                ...typography.letterSpacing,
                [key]: value,
            },
        });
    };

    const generateTypeScale = () => {
        const base = typography.baseSize;
        const ratio = typography.scaleRatio;

        const newSizes = {
            xs: `${(base / Math.pow(ratio, 2)).toFixed(3)}px`,
            sm: `${(base / ratio).toFixed(3)}px`,
            base: `${base}px`,
            lg: `${(base * ratio).toFixed(3)}px`,
            xl: `${(base * Math.pow(ratio, 1.5)).toFixed(3)}px`,
            '2xl': `${(base * Math.pow(ratio, 2)).toFixed(3)}px`,
            '3xl': `${(base * Math.pow(ratio, 3)).toFixed(3)}px`,
            '4xl': `${(base * Math.pow(ratio, 4)).toFixed(3)}px`,
            '5xl': `${(base * Math.pow(ratio, 5)).toFixed(3)}px`,
            '6xl': `${(base * Math.pow(ratio, 6)).toFixed(3)}px`,
        };

        updateTypography({ fontSizes: newSizes });
    };

    // Auto-regenerate when base size or ratio changes
    React.useEffect(() => {
        generateTypeScale();
    }, [typography.baseSize, typography.scaleRatio]);

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-none bg-primary/10 flex items-center justify-center">
                            <Type className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight uppercase">TYPE_FOUNDRY</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                FOUNDATION_CORE_v1.0
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full rounded-none">
                                <TabsTrigger value="families" className="text-xs rounded-none mono-label uppercase">FAMILIES</TabsTrigger>
                                <TabsTrigger value="scale" className="text-xs rounded-none mono-label uppercase">SCALE</TabsTrigger>
                                <TabsTrigger value="properties" className="text-xs rounded-none mono-label uppercase">PROPS</TabsTrigger>
                            </TabsList>

                            <TabsContent value="families" className="space-y-6 mt-6">
                                {/* Sans Serif */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Sans Serif
                                    </Label>
                                    <Select
                                        value={typography.fontFamilies.sans.split(',')[0].trim()}
                                        onValueChange={(value) => updateFontFamily('sans', `${value}, system-ui, sans-serif`)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GOOGLE_FONTS.sans.map((font) => (
                                                <SelectItem key={font} value={font}>
                                                    {font}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Serif */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Serif
                                    </Label>
                                    <Select
                                        value={typography.fontFamilies.serif.split(',')[0].trim()}
                                        onValueChange={(value) => updateFontFamily('serif', `${value}, serif`)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GOOGLE_FONTS.serif.map((font) => (
                                                <SelectItem key={font} value={font}>
                                                    {font}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Monospace */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Monospace
                                    </Label>
                                    <Select
                                        value={typography.fontFamilies.mono.split(',')[0].trim()}
                                        onValueChange={(value) => updateFontFamily('mono', `${value}, monospace`)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GOOGLE_FONTS.mono.map((font) => (
                                                <SelectItem key={font} value={font}>
                                                    {font}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="scale" className="space-y-6 mt-6">
                                {/* Base Size */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60 mono-label">
                                            BASE_SIZE
                                        </Label>
                                        <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-none border border-primary/20">
                                            {typography.baseSize}PX
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="12"
                                        max="24"
                                        step="1"
                                        value={typography.baseSize}
                                        onChange={(e) => updateTypography({ baseSize: parseInt(e.target.value) })}
                                        className="w-full accent-primary"
                                    />
                                </div>

                                {/* Scale Ratio */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Scale Ratio
                                    </Label>
                                    <Select
                                        value={typography.scaleRatio.toString()}
                                        onValueChange={(value) => updateTypography({ scaleRatio: parseFloat(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SCALE_RATIOS.map((ratio) => (
                                                <SelectItem key={ratio.value} value={ratio.value.toString()}>
                                                    {ratio.name} ({ratio.value})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2 rounded-none mono-label uppercase text-xs"
                                    onClick={generateTypeScale}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    RE_CALC_SCALE
                                </Button>
                            </TabsContent>

                            <TabsContent value="properties" className="space-y-6 mt-6">
                                {/* Font Weights */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Font Weights
                                    </Label>
                                    <div className="space-y-3">
                                        {Object.entries(typography.fontWeights).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between">
                                                <span className="text-sm capitalize">{key}</span>
                                                <Input
                                                    type="number"
                                                    min="100"
                                                    max="900"
                                                    step="100"
                                                    value={value}
                                                    onChange={(e) => updateFontWeight(key as any, parseInt(e.target.value))}
                                                    className="w-20 h-8 text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Line Heights */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Line Heights
                                    </Label>
                                    <div className="space-y-3">
                                        {Object.entries(typography.lineHeights).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between">
                                                <span className="text-sm capitalize">{key}</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="2.5"
                                                    step="0.125"
                                                    value={value}
                                                    onChange={(e) => updateLineHeight(key as any, parseFloat(e.target.value))}
                                                    className="w-20 h-8 text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
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
                        LIVE_RENDER_PORT
                    </h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* Type Scale Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Type Scale
                            </h4>
                            <div className="space-y-4">
                                {Object.entries(typography.fontSizes).reverse().map(([key, size]) => (
                                    <div
                                        key={key}
                                        className="flex items-baseline gap-6 group hover:bg-muted/30 p-4 rounded-none border border-transparent hover:border-border transition-all"
                                    >
                                        <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">
                                            {key}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground/50 w-20 shrink-0">
                                            {size}
                                        </span>
                                        <p
                                            style={{
                                                fontSize: size,
                                                fontFamily: typography.fontFamilies.sans,
                                                lineHeight: typography.lineHeights.normal,
                                            }}
                                            className="font-bold"
                                        >
                                            The quick brown fox jumps over the lazy dog
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Font Families Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Font Families
                            </h4>
                            <div className="space-y-6">
                                <div className="p-6 border rounded-none bg-muted/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 mono-label">
                                        SANS_SERIF
                                    </p>
                                    <p
                                        style={{ fontFamily: typography.fontFamilies.sans }}
                                        className="text-2xl font-bold"
                                    >
                                        The quick brown fox jumps over the lazy dog
                                    </p>
                                </div>
                                <div className="p-6 border rounded-none bg-muted/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 mono-label">
                                        SERIF_LABEL
                                    </p>
                                    <p
                                        style={{ fontFamily: typography.fontFamilies.serif }}
                                        className="text-2xl font-bold"
                                    >
                                        The quick brown fox jumps over the lazy dog
                                    </p>
                                </div>
                                <div className="p-6 border rounded-none bg-muted/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 mono-label">
                                        MONO_LABEL
                                    </p>
                                    <p
                                        style={{ fontFamily: typography.fontFamilies.mono }}
                                        className="text-lg"
                                    >
                                        const message = "Hello, World!";
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Font Weights Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Font Weights
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(typography.fontWeights).map(([key, value]) => (
                                    <div key={key} className="p-4 border rounded-lg bg-card">
                                        <p className="text-xs text-muted-foreground mb-2 capitalize">
                                            {key} ({value})
                                        </p>
                                        <p
                                            style={{
                                                fontFamily: typography.fontFamilies.sans,
                                                fontWeight: value,
                                            }}
                                            className="text-lg"
                                        >
                                            The quick brown fox
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Line Heights Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Line Heights
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(typography.lineHeights).map(([key, value]) => (
                                    <div key={key} className="p-4 border rounded-lg bg-card">
                                        <p className="text-xs text-muted-foreground mb-2 capitalize">
                                            {key} ({value})
                                        </p>
                                        <p
                                            style={{
                                                fontFamily: typography.fontFamilies.sans,
                                                lineHeight: value,
                                            }}
                                            className="text-base"
                                        >
                                            The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type.
                                        </p>
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

export default TypographyFoundation;
