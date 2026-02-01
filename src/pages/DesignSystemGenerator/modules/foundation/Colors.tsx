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
            <div className="border-b bg-card/30 px-8 py-6">
                <div className="max-w-5xl">
                    <h1 className="text-3xl font-black tracking-tight">Color Foundation</h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Define your brand colors and generate harmonious color scales automatically.
                    </p>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-8 max-w-5xl">
                    <ColorEditor colors={tokens.colors} onUpdate={updateColor} />
                </div>
            </ScrollArea>
        </div>
    );
};

export default ColorsFoundation;
