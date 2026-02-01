import { useState, useEffect, useCallback } from "react";
import { generateColorScale, ColorScale } from "../utils/colorUtils";

export interface DesignTokens {
    colors: {
        primary: string;
        primaryScale: ColorScale;
        secondary: string;
        secondaryScale: ColorScale;
        accent: string;
        accentScale: ColorScale;
        muted: string;
        mutedScale: ColorScale;
        background: string;
        foreground: string;
        border: string;
    };
    radius: number;
    spacing: number;
    typography: {
        baseSize: number;
        scaleRatio: number;
    };
}

const DEFAULT_TOKENS: DesignTokens = {
    colors: {
        primary: "#3b82f6",
        primaryScale: generateColorScale("#3b82f6"),
        secondary: "#64748b",
        secondaryScale: generateColorScale("#64748b"),
        accent: "#f59e0b",
        accentScale: generateColorScale("#f59e0b"),
        muted: "#f8fafc",
        mutedScale: generateColorScale("#f8fafc"),
        background: "#ffffff",
        foreground: "#0f172a",
        border: "#e2e8f0",
    },
    radius: 0.5,
    spacing: 1,
    typography: {
        baseSize: 16,
        scaleRatio: 1.25, // Major Third
    },
};

const validateTokens = (data: any): DesignTokens => {
    // Merge with defaults to ensure all keys exist
    const tokens = { ...DEFAULT_TOKENS, ...data };

    // Deep merge colors to preserve defaults if loaded data is partial
    tokens.colors = { ...DEFAULT_TOKENS.colors, ...data?.colors };

    // Force primitives back to numbers if they were corrupted into objects
    // This fixes the "Objects are not valid as a React child" error
    if (typeof tokens.radius !== 'number') tokens.radius = DEFAULT_TOKENS.radius;
    if (typeof tokens.spacing !== 'number') tokens.spacing = DEFAULT_TOKENS.spacing;

    // Validate typography
    if (tokens.typography) {
        tokens.typography = { ...DEFAULT_TOKENS.typography, ...data.typography };
        if (typeof tokens.typography.baseSize !== 'number') tokens.typography.baseSize = DEFAULT_TOKENS.typography.baseSize;
        if (typeof tokens.typography.scaleRatio !== 'number') tokens.typography.scaleRatio = DEFAULT_TOKENS.typography.scaleRatio;
    } else {
        tokens.typography = DEFAULT_TOKENS.typography;
    }

    return tokens;
};

export const useDesignTokens = () => {
    const [tokens, setTokens] = useState<DesignTokens>(() => {
        // 1. Try URL config
        const urlParams = new URLSearchParams(window.location.search);
        const configParam = urlParams.get("config");
        if (configParam) {
            try {
                const decoded = JSON.parse(atob(configParam));
                const validated = validateTokens(decoded);

                // Rebuild scales for safety
                validated.colors.primaryScale = generateColorScale(validated.colors.primary);
                validated.colors.secondaryScale = generateColorScale(validated.colors.secondary);
                validated.colors.accentScale = generateColorScale(validated.colors.accent);
                validated.colors.mutedScale = generateColorScale(validated.colors.muted);

                return validated;
            } catch (e) {
                console.error("Failed to parse config from URL:", e);
            }
        }

        // 2. Try localStorage
        const saved = localStorage.getItem("nexus-ds-tokens");
        if (saved) {
            try {
                return validateTokens(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved tokens:", e);
            }
        }

        return DEFAULT_TOKENS;
    });

    const [history, setHistory] = useState<DesignTokens[]>([tokens]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => {
        localStorage.setItem("nexus-ds-tokens", JSON.stringify(tokens));
    }, [tokens]);

    const updateTokens = useCallback((newTokens: DesignTokens) => {
        setTokens(newTokens);

        // Add to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newTokens);

        // Keep history manageable (e.g., 50 steps)
        if (newHistory.length > 50) newHistory.shift();

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const updateColor = (key: keyof DesignTokens["colors"], value: string) => {
        const newColors = { ...tokens.colors, [key]: value };

        // Update scale if it's a base color
        if (key === "primary") newColors.primaryScale = generateColorScale(value);
        if (key === "secondary") newColors.secondaryScale = generateColorScale(value);
        if (key === "accent") newColors.accentScale = generateColorScale(value);
        if (key === "muted") newColors.mutedScale = generateColorScale(value);

        updateTokens({ ...tokens, colors: newColors });
    };

    const updateToken = (key: keyof Omit<DesignTokens, "colors" | "typography">, value: any) => {
        updateTokens({ ...tokens, [key]: value });
    };

    const updateTypography = (key: keyof DesignTokens["typography"], value: number) => {
        updateTokens({
            ...tokens,
            typography: { ...tokens.typography, [key]: value }
        });
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setTokens(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setTokens(history[historyIndex + 1]);
        }
    };

    const resetTokens = () => {
        updateTokens(DEFAULT_TOKENS);
    };

    return {
        tokens,
        updateColor,
        updateToken,
        updateTypography,
        resetTokens,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1
    };
};
