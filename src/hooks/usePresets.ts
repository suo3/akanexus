import { useState, useCallback, useEffect } from 'react';
import { MasteringSettings } from './useAudioProcessor';

// ── Types ────────────────────────────────────────────────────────────────────
export interface SavedPreset {
    id: string;
    name: string;
    createdAt: number;
    settings: Pick<MasteringSettings, 'eqBands' | 'compression' | 'outputGain'>;
}

const STORAGE_KEY = 'akanexus_mastering_presets';

// ── Hook ─────────────────────────────────────────────────────────────────────
export function usePresets() {
    const [presets, setPresets] = useState<SavedPreset[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as SavedPreset[]) : [];
        } catch {
            return [];
        }
    });

    // Persist on every change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
        } catch {
            // storage full or unavailable – silently ignore
        }
    }, [presets]);

    const savePreset = useCallback(
        (name: string, settings: MasteringSettings): SavedPreset => {
            const preset: SavedPreset = {
                id: `preset-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                name: name.trim() || 'Untitled Preset',
                createdAt: Date.now(),
                settings: {
                    eqBands: settings.eqBands.map(b => ({ ...b })),
                    compression: { ...settings.compression },
                    outputGain: settings.outputGain,
                },
            };
            setPresets(prev => [preset, ...prev]);
            return preset;
        },
        [],
    );

    const deletePreset = useCallback((id: string) => {
        setPresets(prev => prev.filter(p => p.id !== id));
    }, []);

    const renamePreset = useCallback((id: string, newName: string) => {
        setPresets(prev =>
            prev.map(p => (p.id === id ? { ...p, name: newName.trim() || p.name } : p)),
        );
    }, []);

    return { presets, savePreset, deletePreset, renamePreset };
}
