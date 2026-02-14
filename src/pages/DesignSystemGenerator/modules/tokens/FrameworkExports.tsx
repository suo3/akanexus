import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    FileCode,
    Download,
    Code,
    Layers,
    Check,
    Zap,
    Box
} from 'lucide-react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { saveAs } from 'file-saver';

// Initial mocks for generation logic
const generateMUITheme = (data: any) => {
    const { tokens, typography, spacing, shadows, motion } = data;
    return `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '${tokens?.colors?.primary || '#3b82f6'}',
    },
    secondary: {
      main: '${tokens?.colors?.secondary || '#8b5cf6'}',
    },
    error: {
      main: '${tokens?.colors?.destructive || '#ef4444'}',
    },
    background: {
      default: '${tokens?.colors?.background || '#ffffff'}',
      paper: '${tokens?.colors?.card || '#ffffff'}',
    },
    text: {
      primary: '${tokens?.colors?.foreground || '#000000'}',
      secondary: '${tokens?.colors?.['muted-foreground'] || '#71717a'}',
    },
    divider: '${tokens?.colors?.border || '#e4e4e7'}',
  },
  typography: {
    fontFamily: '${typography?.fontFamilies?.sans || 'Inter, system-ui, sans-serif'}',
    fontSize: 16,
    fontWeightLight: ${typography?.fontWeights?.light || 300},
    fontWeightRegular: ${typography?.fontWeights?.normal || 400},
    fontWeightMedium: ${typography?.fontWeights?.medium || 500},
    fontWeightBold: ${typography?.fontWeights?.bold || 700},
    h1: {
      fontSize: '${typography?.fontSizes?.['6xl'] || '3.75rem'}',
      fontWeight: ${typography?.fontWeights?.bold || 700},
      lineHeight: ${typography?.lineHeights?.tight || 1.2},
      letterSpacing: '${typography?.letterSpacing?.tight || '-0.025em'}',
    },
    h2: {
      fontSize: '${typography?.fontSizes?.['5xl'] || '3rem'}',
      fontWeight: ${typography?.fontWeights?.bold || 700},
      lineHeight: ${typography?.lineHeights?.tight || 1.2},
      letterSpacing: '${typography?.letterSpacing?.tight || '-0.025em'}',
    },
    h3: {
      fontSize: '${typography?.fontSizes?.['4xl'] || '2.25rem'}',
      fontWeight: ${typography?.fontWeights?.semibold || 600},
      lineHeight: ${typography?.lineHeights?.snug || 1.375},
    },
    h4: {
      fontSize: '${typography?.fontSizes?.['3xl'] || '1.875rem'}',
      fontWeight: ${typography?.fontWeights?.semibold || 600},
      lineHeight: ${typography?.lineHeights?.snug || 1.375},
    },
    h5: {
      fontSize: '${typography?.fontSizes?.['2xl'] || '1.5rem'}',
      fontWeight: ${typography?.fontWeights?.semibold || 600},
      lineHeight: ${typography?.lineHeights?.normal || 1.5},
    },
    h6: {
      fontSize: '${typography?.fontSizes?.xl || '1.25rem'}',
      fontWeight: ${typography?.fontWeights?.semibold || 600},
      lineHeight: ${typography?.lineHeights?.normal || 1.5},
    },
    body1: {
      fontSize: '${typography?.fontSizes?.base || '1rem'}',
      lineHeight: ${typography?.lineHeights?.relaxed || 1.625},
    },
    body2: {
      fontSize: '${typography?.fontSizes?.sm || '0.875rem'}',
      lineHeight: ${typography?.lineHeights?.normal || 1.5},
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: ${spacing?.breakpoints?.sm ? parseInt(spacing.breakpoints.sm) : 640},
      md: ${spacing?.breakpoints?.md ? parseInt(spacing.breakpoints.md) : 768},
      lg: ${spacing?.breakpoints?.lg ? parseInt(spacing.breakpoints.lg) : 1024},
      xl: ${spacing?.breakpoints?.xl ? parseInt(spacing.breakpoints.xl) : 1280},
    },
  },
  spacing: 8,
  shape: {
    borderRadius: ${tokens?.radius ? tokens.radius * 16 : 8},
  },
  shadows: [
    'none',
    '${shadows?.levels?.[0]?.shadow || '0 1px 2px 0 rgb(0 0 0 / 0.05)'}',
    '${shadows?.levels?.[1]?.shadow || '0 1px 3px 0 rgb(0 0 0 / 0.1)'}',
    '${shadows?.levels?.[2]?.shadow || '0 4px 6px -1px rgb(0 0 0 / 0.1)'}',
    '${shadows?.levels?.[3]?.shadow || '0 10px 15px -3px rgb(0 0 0 / 0.1)'}',
    '${shadows?.levels?.[4]?.shadow || '0 20px 25px -5px rgb(0 0 0 / 0.1)'}',
    '${shadows?.levels?.[5]?.shadow || '0 25px 50px -12px rgb(0 0 0 / 0.25)'}',
  ],
  transitions: {
    duration: {
      shortest: ${motion?.durations?.fast || 150},
      shorter: ${motion?.durations?.base || 200},
      short: ${motion?.durations?.slow || 300},
      standard: ${motion?.durations?.slower || 400},
      complex: 500,
    },
    easing: {
      easeInOut: '${motion?.easings?.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)'}',
      easeOut: '${motion?.easings?.easeOut || 'cubic-bezier(0, 0, 0.2, 1)'}',
      easeIn: '${motion?.easings?.easeIn || 'cubic-bezier(0.4, 0, 1, 1)'}',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

export default theme;`;
};

const generateBootstrapVars = (data: any) => {
    const { tokens, typography, spacing, shadows, motion } = data;
    return `// Bootstrap SCSS Variables
// ============================================

// Colors
$primary: ${tokens?.colors?.primary || '#3b82f6'};
$secondary: ${tokens?.colors?.secondary || '#8b5cf6'};
$success: ${tokens?.colors?.accent || '#10b981'};
$danger: ${tokens?.colors?.destructive || '#ef4444'};
$light: ${tokens?.colors?.muted || '#f8fafc'};
$dark: ${tokens?.colors?.foreground || '#000000'};

// Body
$body-bg: ${tokens?.colors?.background || '#ffffff'};
$body-color: ${tokens?.colors?.foreground || '#000000'};

// Borders
$border-color: ${tokens?.colors?.border || '#e2e8f0'};
$border-width: 1px;

// Typography
$font-family-sans-serif: ${typography?.fontFamilies?.sans || 'Inter, system-ui, sans-serif'};
$font-family-monospace: ${typography?.fontFamilies?.mono || 'monospace'};
$font-family-base: $font-family-sans-serif;

// Font Sizes
$font-size-base: ${typography?.fontSizes?.base || '1rem'};
$font-size-sm: ${typography?.fontSizes?.sm || '0.875rem'};
$font-size-lg: ${typography?.fontSizes?.lg || '1.125rem'};

$h1-font-size: ${typography?.fontSizes?.['6xl'] || '3.75rem'};
$h2-font-size: ${typography?.fontSizes?.['5xl'] || '3rem'};
$h3-font-size: ${typography?.fontSizes?.['4xl'] || '2.25rem'};
$h4-font-size: ${typography?.fontSizes?.['3xl'] || '1.875rem'};
$h5-font-size: ${typography?.fontSizes?.['2xl'] || '1.5rem'};
$h6-font-size: ${typography?.fontSizes?.xl || '1.25rem'};

// Font Weights
$font-weight-lighter: ${typography?.fontWeights?.light || 300};
$font-weight-normal: ${typography?.fontWeights?.normal || 400};
$font-weight-medium: ${typography?.fontWeights?.medium || 500};
$font-weight-semibold: ${typography?.fontWeights?.semibold || 600};
$font-weight-bold: ${typography?.fontWeights?.bold || 700};
$font-weight-bolder: ${typography?.fontWeights?.extrabold || 800};

// Line Heights
$line-height-base: ${typography?.lineHeights?.normal || 1.5};
$line-height-sm: ${typography?.lineHeights?.tight || 1.25};
$line-height-lg: ${typography?.lineHeights?.relaxed || 1.75};

// Headings
$headings-font-weight: $font-weight-bold;
$headings-line-height: ${typography?.lineHeights?.tight || 1.2};
$headings-letter-spacing: ${typography?.letterSpacing?.tight || '-0.025em'};

// Spacing
$spacer: ${spacing?.scale?.['4'] || '1rem'};
$spacers: (
  0: 0,
  1: $spacer * 0.25,
  2: $spacer * 0.5,
  3: $spacer * 0.75,
  4: $spacer,
  5: $spacer * 1.5,
  6: $spacer * 2,
  7: $spacer * 3,
  8: $spacer * 4,
);

// Grid Breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: ${spacing?.breakpoints?.sm || '640px'},
  md: ${spacing?.breakpoints?.md || '768px'},
  lg: ${spacing?.breakpoints?.lg || '1024px'},
  xl: ${spacing?.breakpoints?.xl || '1280px'},
  xxl: ${spacing?.breakpoints?.['2xl'] || '1536px'},
);

// Container Max Widths
$container-max-widths: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  xxl: 1536px,
);

// Border Radius
$border-radius: ${tokens?.radius ? tokens.radius + 'rem' : '0.5rem'};
$border-radius-sm: ${tokens?.radius ? (tokens.radius * 0.75) + 'rem' : '0.375rem'};
$border-radius-lg: ${tokens?.radius ? (tokens.radius * 1.5) + 'rem' : '0.75rem'};
$border-radius-xl: ${tokens?.radius ? (tokens.radius * 2) + 'rem' : '1rem'};
$border-radius-pill: 50rem;

// Shadows
$box-shadow-sm: ${shadows?.levels?.[0]?.shadow || '0 1px 2px 0 rgb(0 0 0 / 0.05)'};
$box-shadow: ${shadows?.levels?.[1]?.shadow || '0 1px 3px 0 rgb(0 0 0 / 0.1)'};
$box-shadow-lg: ${shadows?.levels?.[3]?.shadow || '0 10px 15px -3px rgb(0 0 0 / 0.1)'};

// Transitions
$transition-base: all ${motion?.durations?.base || 200}ms ${motion?.easings?.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)'};
$transition-fade: opacity ${motion?.durations?.fast || 150}ms ${motion?.easings?.easeOut || 'cubic-bezier(0, 0, 0.2, 1)'};
$transition-collapse: height ${motion?.durations?.slow || 300}ms ${motion?.easings?.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)'};`;
};

const generateChakraTheme = (data: any) => {
    const { tokens, typography, spacing, shadows, motion } = data;
    return `import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: '${tokens?.colors?.primary || '#3b82f6'}',
      secondary: '${tokens?.colors?.secondary || '#8b5cf6'}',
      accent: '${tokens?.colors?.accent || '#10b981'}',
    },
    background: '${tokens?.colors?.background || '#ffffff'}',
    foreground: '${tokens?.colors?.foreground || '#000000'}',
    muted: '${tokens?.colors?.muted || '#f8fafc'}',
    mutedForeground: '${tokens?.colors?.['muted-foreground'] || '#71717a'}',
    border: '${tokens?.colors?.border || '#e2e8f0'}',
    card: '${tokens?.colors?.card || '#ffffff'}',
    destructive: '${tokens?.colors?.destructive || '#ef4444'}',
  },
  fonts: {
    heading: '${typography?.fontFamilies?.sans || 'Inter, system-ui, sans-serif'}',
    body: '${typography?.fontFamilies?.sans || 'Inter, system-ui, sans-serif'}',
    mono: '${typography?.fontFamilies?.mono || 'monospace'}',
  },
  fontSizes: {
    xs: '${typography?.fontSizes?.xs || '0.75rem'}',
    sm: '${typography?.fontSizes?.sm || '0.875rem'}',
    md: '${typography?.fontSizes?.base || '1rem'}',
    lg: '${typography?.fontSizes?.lg || '1.125rem'}',
    xl: '${typography?.fontSizes?.xl || '1.25rem'}',
    '2xl': '${typography?.fontSizes?.['2xl'] || '1.5rem'}',
    '3xl': '${typography?.fontSizes?.['3xl'] || '1.875rem'}',
    '4xl': '${typography?.fontSizes?.['4xl'] || '2.25rem'}',
    '5xl': '${typography?.fontSizes?.['5xl'] || '3rem'}',
    '6xl': '${typography?.fontSizes?.['6xl'] || '3.75rem'}',
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: ${typography?.fontWeights?.light || 300},
    normal: ${typography?.fontWeights?.normal || 400},
    medium: ${typography?.fontWeights?.medium || 500},
    semibold: ${typography?.fontWeights?.semibold || 600},
    bold: ${typography?.fontWeights?.bold || 700},
    extrabold: ${typography?.fontWeights?.extrabold || 800},
    black: ${typography?.fontWeights?.black || 900},
  },
  lineHeights: {
    none: 1,
    tight: ${typography?.lineHeights?.tight || 1.25},
    snug: ${typography?.lineHeights?.snug || 1.375},
    normal: ${typography?.lineHeights?.normal || 1.5},
    relaxed: ${typography?.lineHeights?.relaxed || 1.625},
    loose: ${typography?.lineHeights?.loose || 2},
  },
  letterSpacings: {
    tighter: '${typography?.letterSpacing?.tighter || '-0.05em'}',
    tight: '${typography?.letterSpacing?.tight || '-0.025em'}',
    normal: '${typography?.letterSpacing?.normal || '0em'}',
    wide: '${typography?.letterSpacing?.wide || '0.025em'}',
    wider: '${typography?.letterSpacing?.wider || '0.05em'}',
    widest: '${typography?.letterSpacing?.widest || '0.1em'}',
  },
  breakpoints: {
    sm: '${spacing?.breakpoints?.sm || '640px'}',
    md: '${spacing?.breakpoints?.md || '768px'}',
    lg: '${spacing?.breakpoints?.lg || '1024px'}',
    xl: '${spacing?.breakpoints?.xl || '1280px'}',
    '2xl': '${spacing?.breakpoints?.['2xl'] || '1536px'}',
  },
  space: {
    px: '1px',
    0: '0',
    0.5: '${spacing?.scale?.['0.5'] || '0.125rem'}',
    1: '${spacing?.scale?.['1'] || '0.25rem'}',
    2: '${spacing?.scale?.['2'] || '0.5rem'}',
    3: '${spacing?.scale?.['3'] || '0.75rem'}',
    4: '${spacing?.scale?.['4'] || '1rem'}',
    5: '${spacing?.scale?.['5'] || '1.25rem'}',
    6: '${spacing?.scale?.['6'] || '1.5rem'}',
    8: '${spacing?.scale?.['8'] || '2rem'}',
    10: '${spacing?.scale?.['10'] || '2.5rem'}',
    12: '${spacing?.scale?.['12'] || '3rem'}',
    16: '${spacing?.scale?.['16'] || '4rem'}',
    20: '${spacing?.scale?.['20'] || '5rem'}',
    24: '${spacing?.scale?.['24'] || '6rem'}',
  },
  radii: {
    none: '0',
    sm: '${tokens?.radius ? (tokens.radius * 0.75) + 'rem' : '0.375rem'}',
    base: '${tokens?.radius ? tokens.radius + 'rem' : '0.5rem'}',
    md: '${tokens?.radius ? (tokens.radius * 1.5) + 'rem' : '0.75rem'}',
    lg: '${tokens?.radius ? (tokens.radius * 2) + 'rem' : '1rem'}',
    xl: '${tokens?.radius ? (tokens.radius * 3) + 'rem' : '1.5rem'}',
    full: '9999px',
  },
  shadows: {
    sm: '${shadows?.levels?.[0]?.shadow || '0 1px 2px 0 rgb(0 0 0 / 0.05)'}',
    base: '${shadows?.levels?.[1]?.shadow || '0 1px 3px 0 rgb(0 0 0 / 0.1)'}',
    md: '${shadows?.levels?.[2]?.shadow || '0 4px 6px -1px rgb(0 0 0 / 0.1)'}',
    lg: '${shadows?.levels?.[3]?.shadow || '0 10px 15px -3px rgb(0 0 0 / 0.1)'}',
    xl: '${shadows?.levels?.[4]?.shadow || '0 20px 25px -5px rgb(0 0 0 / 0.1)'}',
    '2xl': '${shadows?.levels?.[5]?.shadow || '0 25px 50px -12px rgb(0 0 0 / 0.25)'}',
  },
  transition: {
    duration: {
      'ultra-fast': '${motion?.durations?.fast || 150}ms',
      faster: '${motion?.durations?.base || 200}ms',
      fast: '${motion?.durations?.slow || 300}ms',
      normal: '${motion?.durations?.slower || 400}ms',
      slow: '500ms',
      slower: '700ms',
      'ultra-slow': '1000ms',
    },
    easing: {
      'ease-in': '${motion?.easings?.easeIn || 'cubic-bezier(0.4, 0, 1, 1)'}',
      'ease-out': '${motion?.easings?.easeOut || 'cubic-bezier(0, 0, 0.2, 1)'}',
      'ease-in-out': '${motion?.easings?.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)'}',
    },
  },
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
});

export default theme;`;
};

const FRAMEWORKS = [
    {
        id: 'mui',
        name: 'Material UI',
        icon: Layers,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        generate: generateMUITheme,
        filename: 'theme.ts',
        desc: 'Custom theme object for MUI v5+'
    },
    {
        id: 'bootstrap',
        name: 'Bootstrap',
        icon: Box,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        generate: generateBootstrapVars,
        filename: '_variables.scss',
        desc: 'SCSS variables for Bootstrap customization'
    },
    {
        id: 'chakra',
        name: 'Chakra UI',
        icon: Zap,
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
        generate: generateChakraTheme,
        filename: 'chakra-theme.ts',
        desc: 'Theme extension object for Chakra UI'
    },
];

export default function FrameworkExports() {
    const { tokens, typography, spacing, shadows, motion } = useDesignSystemStore();
    const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);
    const tokenData = { tokens, typography, spacing, shadows, motion };
    const [generatedCode, setGeneratedCode] = useState(FRAMEWORKS[0].generate(tokenData));
    const [copied, setCopied] = useState(false);

    const handleSelect = (framework: typeof FRAMEWORKS[0]) => {
        setSelectedFramework(framework);
        setGeneratedCode(framework.generate(tokenData));
    };

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(generatedCode).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }
    };

    const fallbackCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = generatedCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed');
        }
        document.body.removeChild(textarea);
    };

    const handleDownload = () => {
        const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, selectedFramework.filename);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Code className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Framework Exports</h1>
                        <p className="text-sm text-muted-foreground">Generate configuration for popular UI libraries</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleDownload} className="gap-2">
                        <Download className="w-4 h-4" />
                        Download {selectedFramework.filename}
                    </Button>
                    <Button onClick={handleCopy} className="gap-2 min-w-[140px]">
                        {copied ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Frameworks */}
                <div className="w-72 bg-card/10 border-r p-4 space-y-4">
                    <div className="text-xs font-bold uppercase text-muted-foreground px-2">Select Framework</div>
                    <div className="space-y-2">
                        {FRAMEWORKS.map(fw => {
                            const Icon = fw.icon;
                            const isSelected = selectedFramework.id === fw.id;
                            return (
                                <button
                                    key={fw.id}
                                    onClick={() => handleSelect(fw)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group relative overflow-hidden ${isSelected ? 'bg-card border-primary ring-1 ring-primary' : 'bg-card/50 border-transparent hover:bg-card hover:border-border'}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${fw.bg} ${fw.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${isSelected ? 'text-primary' : ''}`}>{fw.name}</div>
                                        <div className="text-[10px] text-muted-foreground leading-tight mt-1 opacity-80">{fw.desc}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-[#1e1e1e] text-white flex flex-col">
                    <div className="px-6 py-3 border-b border-white/10 flex justify-between items-center text-xs font-mono text-zinc-400 bg-[#252526]">
                        <span>{selectedFramework.filename}</span>
                        <span>TypeScript / SCSS</span>
                    </div>
                    <ScrollArea className="flex-1">
                        <pre className="p-8 font-mono text-sm leading-relaxed">
                            <code className="language-typescript text-zinc-300">
                                {generatedCode}
                            </code>
                        </pre>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
