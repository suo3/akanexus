import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { DesignTokens } from '../hooks/useDesignTokens';

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
    updateTokens: (tokens: Partial<DesignTokens>) => void;
    updateTypography: (typography: Partial<TypographyTokens>) => void;
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
                updateTokens: (tokens) =>
                    set((state) => ({
                        tokens: { ...state.tokens, ...tokens },
                    })),
                updateTypography: (typography) =>
                    set((state) => ({
                        typography: { ...state.typography, ...typography },
                    })),
                resetTokens: () => set({ tokens: defaultTokens, typography: defaultTypography }),

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
                        const newEntry: HistoryEntry = {
                            ...entry,
                            id: crypto.randomUUID(),
                            timestamp: new Date(),
                        };
                        const newHistory = state.history.slice(0, state.historyIndex + 1);
                        newHistory.push(newEntry);
                        return {
                            history: newHistory,
                            historyIndex: newHistory.length - 1,
                        };
                    }),
                undo: () =>
                    set((state) => {
                        if (state.historyIndex > 0) {
                            return { historyIndex: state.historyIndex - 1 };
                        }
                        return state;
                    }),
                redo: () =>
                    set((state) => {
                        if (state.historyIndex < state.history.length - 1) {
                            return { historyIndex: state.historyIndex + 1 };
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
                    components: state.components,
                    documentation: state.documentation,
                    exportSettings: state.exportSettings,
                }),
            }
        )
    )
);
