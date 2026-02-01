import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorScale, getColorContrast } from "../utils/colorUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColorScalePreviewProps {
    label: string;
    baseColor: string;
    scale: ColorScale;
    onChange: (value: string) => void;
}

const ColorScalePreview = ({ label, baseColor, scale, onChange }: ColorScalePreviewProps) => {
    return (
        <div className="space-y-3 p-4 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold capitalize">{label}</label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={baseColor}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-6 h-6 rounded-full border-none cursor-pointer overflow-hidden p-0"
                    />
                    <input
                        type="text"
                        value={baseColor}
                        onChange={(e) => onChange(e.target.value)}
                        className="text-xs font-mono uppercase w-20 bg-muted/50 border rounded px-2 py-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-11 h-10 rounded-md overflow-hidden border">
                {Object.entries(scale).map(([weight, hex]) => (
                    <div
                        key={weight}
                        className="group relative flex items-center justify-center transition-all hover:scale-110 hover:z-10 cursor-pointer"
                        style={{ backgroundColor: hex as string }}
                        title={`${label}-${weight}: ${hex}`}
                    >
                        <span
                            className="hidden group-hover:block text-[8px] font-bold"
                            style={{ color: getColorContrast(hex as string) }}
                        >
                            {weight}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface ColorEditorProps {
    colors: any;
    onUpdate: (key: string, value: string) => void;
}

export const ColorEditor = ({ colors, onUpdate }: ColorEditorProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Main Palette</h3>
                <ColorScalePreview
                    label="Primary"
                    baseColor={colors.primary}
                    scale={colors.primaryScale}
                    onChange={(v) => onUpdate("primary", v)}
                />
                <ColorScalePreview
                    label="Secondary"
                    baseColor={colors.secondary}
                    scale={colors.secondaryScale}
                    onChange={(v) => onUpdate("secondary", v)}
                />
                <ColorScalePreview
                    label="Accent"
                    baseColor={colors.accent}
                    scale={colors.accentScale}
                    onChange={(v) => onUpdate("accent", v)}
                />
                <ColorScalePreview
                    label="Muted"
                    baseColor={colors.muted}
                    scale={colors.mutedScale}
                    onChange={(v) => onUpdate("muted", v)}
                />
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Functional</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <span className="text-sm font-medium">Background</span>
                        <input
                            type="color"
                            value={colors.background}
                            onChange={(e) => onUpdate("background", e.target.value)}
                            className="w-6 h-6 rounded-full border-none cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <span className="text-sm font-medium">Foreground</span>
                        <input
                            type="color"
                            value={colors.foreground}
                            onChange={(e) => onUpdate("foreground", e.target.value)}
                            className="w-6 h-6 rounded-full border-none cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <span className="text-sm font-medium">Border</span>
                        <input
                            type="color"
                            value={colors.border}
                            onChange={(e) => onUpdate("border", e.target.value)}
                            className="w-6 h-6 rounded-full border-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Separator } from "@/components/ui/separator";
