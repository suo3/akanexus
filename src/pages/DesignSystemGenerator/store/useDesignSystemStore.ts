import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { DesignTokens } from '../hooks/useDesignTokens';

// UUID generator fallback for browsers that don't support crypto.randomUUID
const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};


// Extended typography types
export interface TypographyTokens {
    fontFamilies: {
        sans: string;
        serif: string;
        mono: string;
    };
    fontWeights: {
        thin: number;
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
        black: number;
    };
    fontSizes: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
    lineHeights: {
        none: number;
        tight: number;
        snug: number;
        normal: number;
        relaxed: number;
        loose: number;
    };
    letterSpacing: {
        tighter: string;
        tight: string;
        normal: string;
        wide: string;
        wider: string;
        widest: string;
    };
    baseSize: number;
    scaleRatio: number;
}

// Spacing tokens
export interface SpacingTokens {
    scale: Record<string, string>;
    grid: {
        columns: number;
        gutter: string;
        margin: string;
        maxWidth: string;
    };
    breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };
}

// Shadow/Elevation tokens
export interface ElevationLevel {
    level: number;
    name: string;
    shadow: string;
    description: string;
}

export interface ShadowTokens {
    levels: ElevationLevel[];
}

// Motion/Animation tokens
export interface MotionTokens {
    easings: Record<string, string>;
    durations: Record<string, number>;
}


// Component types
export interface Component {
    id: string;
    name: string;
    type: 'button' | 'input' | 'card' | 'modal' | 'custom';
    variants: ComponentVariant[];
    states: ComponentState[];
    props: ComponentProp[];
    code: {
        react?: string;
        vue?: string;
        css?: string;
        tailwind?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ComponentVariant {
    id: string;
    name: string;
    styles: Record<string, any>;
}

export interface ComponentState {
    id: string;
    name: 'default' | 'hover' | 'active' | 'disabled' | 'loading' | 'focus';
    styles: Record<string, any>;
}

export interface ComponentProp {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'enum';
    defaultValue?: any;
    options?: string[];
}

// Documentation types
export interface Documentation {
    introduction: string;
    guidelines: {
        colors: string;
        typography: string;
        spacing: string;
        components: string;
    };
    changelog: ChangelogEntry[];
}

export interface ChangelogEntry {
    version: string;
    date: Date;
    changes: string[];
    breaking: boolean;
}

// Team & Governance types
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar?: string;
}

export interface Permissions {
    canEditTokens: boolean;
    canCreateComponents: boolean;
    canManageTeam: boolean;
    canExport: boolean;
}

// History types
export interface HistoryEntry {
    id: string;
    timestamp: Date;
    action: string;
    user: string;
    data: any;
}

// Export settings
export interface ExportSettings {
    format: 'react' | 'vue' | 'angular' | 'svelte';
    cssFramework: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion';
    includeTests: boolean;
    includeStories: boolean;
    typescript: boolean;
}

// Main store interface
interface DesignSystemStore {
    // Foundation
    tokens: DesignTokens;
    typography: TypographyTokens;
    spacing: SpacingTokens;
    shadows: ShadowTokens;
    motion: MotionTokens;
    updateTokens: (tokens: Partial<DesignTokens>) => void;
    updateTypography: (typography: Partial<TypographyTokens>) => void;
    updateSpacing: (spacing: Partial<SpacingTokens>) => void;
    updateShadows: (shadows: Partial<ShadowTokens>) => void;
    updateMotion: (motion: Partial<MotionTokens>) => void;
    resetTokens: () => void;


    // Components
    components: Component[];
    addComponent: (component: Component) => void;
    updateComponent: (id: string, updates: Partial<Component>) => void;
    deleteComponent: (id: string) => void;
    getComponent: (id: string) => Component | undefined;

    // Documentation
    documentation: Documentation;
    updateDocumentation: (docs: Partial<Documentation>) => void;
    addChangelogEntry: (entry: ChangelogEntry) => void;

    // Team & Governance
    team: TeamMember[];
    currentUser: TeamMember | null;
    permissions: Permissions;
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
    removeTeamMember: (id: string) => void;

    // History & Undo/Redo
    history: HistoryEntry[];
    historyIndex: number;
    addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

    // Export settings
    exportSettings: ExportSettings;
    updateExportSettings: (settings: Partial<ExportSettings>) => void;

    // UI State
    activeModule: string;
    setActiveModule: (module: string) => void;
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

// Default values
const defaultTokens: DesignTokens = {
    colors: {
        primary: '#3b82f6',
        primaryScale: {} as any,
        secondary: '#64748b',
        secondaryScale: {} as any,
        accent: '#f59e0b',
        accentScale: {} as any,
        muted: '#f8fafc',
        mutedScale: {} as any,
        background: '#ffffff',
        foreground: '#0f172a',
        border: '#e2e8f0',
    },
    radius: 0.5,
    spacing: 1,
    typography: {
        baseSize: 16,
        scaleRatio: 1.25,
    },
};

const defaultTypography: TypographyTokens = {
    fontFamilies: {
        sans: 'Inter, system-ui, sans-serif',
        serif: 'Georgia, serif',
        mono: 'JetBrains Mono, monospace',
    },
    fontWeights: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
    },
    fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
    },
    lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
    baseSize: 16,
    scaleRatio: 1.25,
};

const defaultSpacing: SpacingTokens = {
    scale: {
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
    },
    grid: {
        columns: 12,
        gutter: '1.5rem',
        margin: '1rem',
        maxWidth: '1280px',
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};

const defaultShadows: ShadowTokens = {
    levels: [
        { level: 1, name: 'sm', shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', description: 'Small shadow' },
        { level: 2, name: 'base', shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', description: 'Base shadow' },
        { level: 3, name: 'md', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', description: 'Medium shadow' },
        { level: 4, name: 'lg', shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', description: 'Large shadow' },
        { level: 5, name: 'xl', shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', description: 'Extra large shadow' },
        { level: 6, name: '2xl', shadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', description: '2X large shadow' },
    ],
};

const defaultMotion: MotionTokens = {
    easings: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    durations: {
        fast: 150,
        base: 300,
        slow: 500,
        slower: 700,
    },
};

const defaultDocumentation: Documentation = {
    introduction: 'Welcome to your design system',
    guidelines: {
        colors: '',
        typography: '',
        spacing: '',
        components: '',
    },
    changelog: [],
};

const defaultExportSettings: ExportSettings = {
    format: 'react',
    cssFramework: 'tailwind',
    includeTests: true,
    includeStories: true,
    typescript: true,
};

export const useDesignSystemStore = create<DesignSystemStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Foundation
                tokens: defaultTokens,
                typography: defaultTypography,
                spacing: defaultSpacing,
                shadows: defaultShadows,
                motion: defaultMotion,
                updateTokens: (tokens) => {
                    const state = get();
                    // Add history entry before updating
                    state.addHistoryEntry({
                        action: 'Update Tokens',
                        user: state.currentUser?.name || 'User',
                        data: null, // Will be captured by addHistoryEntry
                    });
                    set((state) => ({
                        tokens: { ...state.tokens, ...tokens },
                    }));
                },
                updateTypography: (typography) => {
                    const state = get();
                    // Add history entry before updating
                    state.addHistoryEntry({
                        action: 'Update Typography',
                        user: state.currentUser?.name || 'User',
                        data: null, // Will be captured by addHistoryEntry
                    });
                    set((state) => ({
                        typography: { ...state.typography, ...typography },
                    }));
                },
                updateSpacing: (spacing) => {
                    const state = get();
                    state.addHistoryEntry({
                        action: 'Update Spacing',
                        user: state.currentUser?.name || 'User',
                        data: null,
                    });
                    set((state) => ({
                        spacing: { ...state.spacing, ...spacing },
                    }));
                },
                updateShadows: (shadows) => {
                    const state = get();
                    state.addHistoryEntry({
                        action: 'Update Shadows',
                        user: state.currentUser?.name || 'User',
                        data: null,
                    });
                    set((state) => ({
                        shadows: { ...state.shadows, ...shadows },
                    }));
                },
                updateMotion: (motion) => {
                    const state = get();
                    state.addHistoryEntry({
                        action: 'Update Motion',
                        user: state.currentUser?.name || 'User',
                        data: null,
                    });
                    set((state) => ({
                        motion: { ...state.motion, ...motion },
                    }));
                },
                resetTokens: () => {
                    const state = get();
                    state.addHistoryEntry({
                        action: 'Reset Tokens',
                        user: state.currentUser?.name || 'User',
                        data: null,
                    });
                    set({ tokens: defaultTokens, typography: defaultTypography });
                },

                // Components
                components: [],
                addComponent: (component) =>
                    set((state) => ({
                        components: [...state.components, component],
                    })),
                updateComponent: (id, updates) =>
                    set((state) => ({
                        components: state.components.map((c) =>
                            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
                        ),
                    })),
                deleteComponent: (id) =>
                    set((state) => ({
                        components: state.components.filter((c) => c.id !== id),
                    })),
                getComponent: (id) => get().components.find((c) => c.id === id),

                // Documentation
                documentation: defaultDocumentation,
                updateDocumentation: (docs) =>
                    set((state) => ({
                        documentation: { ...state.documentation, ...docs },
                    })),
                addChangelogEntry: (entry) =>
                    set((state) => ({
                        documentation: {
                            ...state.documentation,
                            changelog: [entry, ...state.documentation.changelog],
                        },
                    })),

                // Team & Governance
                team: [],
                currentUser: null,
                permissions: {
                    canEditTokens: true,
                    canCreateComponents: true,
                    canManageTeam: true,
                    canExport: true,
                },
                addTeamMember: (member) =>
                    set((state) => ({
                        team: [...state.team, member],
                    })),
                updateTeamMember: (id, updates) =>
                    set((state) => ({
                        team: state.team.map((m) => (m.id === id ? { ...m, ...updates } : m)),
                    })),
                removeTeamMember: (id) =>
                    set((state) => ({
                        team: state.team.filter((m) => m.id !== id),
                    })),

                // History
                history: [],
                historyIndex: -1,
                addHistoryEntry: (entry) =>
                    set((state) => {
                        // Capture current state snapshot
                        const snapshot = {
                            tokens: state.tokens,
                            typography: state.typography,
                            spacing: state.spacing,
                            shadows: state.shadows,
                            motion: state.motion,
                            components: state.components,
                            documentation: state.documentation,
                        };

                        const newEntry: HistoryEntry = {
                            ...entry,
                            id: generateUUID(),
                            timestamp: new Date(),
                            data: snapshot, // Store the full state snapshot
                        };
                        const newHistory = state.history.slice(0, state.historyIndex + 1);
                        newHistory.push(newEntry);
                        const newIndex = newHistory.length - 1;
                        return {
                            history: newHistory,
                            historyIndex: newIndex,
                            canUndo: newIndex > 0,
                            canRedo: false,
                        };
                    }),
                undo: () =>
                    set((state) => {
                        if (state.historyIndex > 0) {
                            const newIndex = state.historyIndex - 1;
                            const historyEntry = state.history[newIndex];

                            // Restore the state from the history entry
                            if (historyEntry && historyEntry.data) {
                                return {
                                    ...historyEntry.data,
                                    history: state.history,
                                    historyIndex: newIndex,
                                    canUndo: newIndex > 0,
                                    canRedo: newIndex < state.history.length - 1,
                                    // Preserve UI state
                                    activeModule: state.activeModule,
                                    sidebarCollapsed: state.sidebarCollapsed,
                                    team: state.team,
                                    currentUser: state.currentUser,
                                    permissions: state.permissions,
                                    exportSettings: state.exportSettings,
                                };
                            }

                            return {
                                historyIndex: newIndex,
                                canUndo: newIndex > 0,
                                canRedo: newIndex < state.history.length - 1
                            };
                        }
                        return state;
                    }),
                redo: () =>
                    set((state) => {
                        if (state.historyIndex < state.history.length - 1) {
                            const newIndex = state.historyIndex + 1;
                            const historyEntry = state.history[newIndex];

                            // Restore the state from the history entry
                            if (historyEntry && historyEntry.data) {
                                return {
                                    ...historyEntry.data,
                                    history: state.history,
                                    historyIndex: newIndex,
                                    canUndo: newIndex > 0,
                                    canRedo: newIndex < state.history.length - 1,
                                    // Preserve UI state
                                    activeModule: state.activeModule,
                                    sidebarCollapsed: state.sidebarCollapsed,
                                    team: state.team,
                                    currentUser: state.currentUser,
                                    permissions: state.permissions,
                                    exportSettings: state.exportSettings,
                                };
                            }

                            return {
                                historyIndex: newIndex,
                                canUndo: newIndex > 0,
                                canRedo: newIndex < state.history.length - 1
                            };
                        }
                        return state;
                    }),
                canUndo: false,
                canRedo: false,

                // Export settings
                exportSettings: defaultExportSettings,
                updateExportSettings: (settings) =>
                    set((state) => ({
                        exportSettings: { ...state.exportSettings, ...settings },
                    })),

                // UI State
                activeModule: 'foundation/colors',
                setActiveModule: (module) => set({ activeModule: module }),
                sidebarCollapsed: false,
                toggleSidebar: () =>
                    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            }),
            {
                name: 'design-system-storage',
                partialize: (state) => ({
                    tokens: state.tokens,
                    typography: state.typography,
                    spacing: state.spacing,
                    shadows: state.shadows,
                    motion: state.motion,
                    components: state.components,
                    documentation: state.documentation,
                    exportSettings: state.exportSettings,
                }),
            }
        )
    )
);
