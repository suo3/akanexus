import React from 'react';
import { ColorEditor } from '../../components/ColorEditor';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { generateColorScale } from '../../utils/colorUtils';
import { ScrollArea } from '@/components/ui/scroll-area';

const ColorsFoundation = () => {
    const { tokens, updateTokens } = useDesignSystemStore();

    const updateColor = (key: string, value: string) => {
        const newColors = { ...tokens.colors, [key]: value };

        // Update scale if it's a base color
        if (key === 'primary') newColors.primaryScale = generateColorScale(value);
        if (key === 'secondary') newColors.secondaryScale = generateColorScale(value);
        if (key === 'accent') newColors.accentScale = generateColorScale(value);
        if (key === 'muted') newColors.mutedScale = generateColorScale(value);

        updateTokens({ colors: newColors });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b bg-muted/10 px-4 md:px-8 py-6 md:py-8">
                <div className="max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 border border-primary/20 bg-primary/5 mb-4 mono-label text-[10px] uppercase text-primary">
                        <div className="w-1 h-1 rounded-none bg-primary animate-pulse" />
                        FOUNDATION_CORE_v1.0
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">COLOR_STORAGE</h1>
                    <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
                        Define brand color tokens and generate harmonious industrial color scales.
                    </p>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-4 md:p-8 max-w-5xl">
                    {tokens?.colors ? (
                        <ColorEditor colors={tokens.colors} onUpdate={updateColor} />
                    ) : (
                        <div className="flex items-center justify-center h-32 text-muted-foreground animate-pulse">
                            Initializing color foundation...
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ColorsFoundation;
