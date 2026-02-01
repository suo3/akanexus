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
const generateMUITheme = (tokens: any) => {
    return `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '${tokens?.colors?.primary?.['500'] || '#000000'}',
      light: '${tokens?.colors?.primary?.['300'] || '#333333'}',
      dark: '${tokens?.colors?.primary?.['700'] || '#000000'}',
    },
    secondary: {
      main: '${tokens?.colors?.secondary?.['500'] || '#000000'}',
    },
  },
  typography: {
    fontFamily: '${tokens?.typography?.fontFamily?.sans || 'sans-serif'}',
  },
  spacing: 8, // Base spacing unit
  shape: {
    borderRadius: 8,
  },
});

export default theme;`;
};

const generateBootstrapVars = (tokens: any) => {
    return `$primary: ${tokens?.colors?.primary?.['500'] || '#000000'};
$secondary: ${tokens?.colors?.secondary?.['500'] || '#000000'};
$success: ${tokens?.colors?.success?.['500'] || '#198754'};
$info: ${tokens?.colors?.info?.['500'] || '#0dcaf0'};
$warning: ${tokens?.colors?.warning?.['500'] || '#ffc107'};
$danger: ${tokens?.colors?.danger?.['500'] || '#dc3545'};

$font-family-base: ${tokens?.typography?.fontFamily?.sans || 'sans-serif'};
$font-size-base: 1rem;
$line-height-base: 1.5;

$border-radius: 0.375rem;
$border-radius-sm: 0.25rem;
$border-radius-lg: 0.5rem;`;
};

const generateChakraTheme = (tokens: any) => {
    return `import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '${tokens?.colors?.primary?.['50'] || '#f0f0f0'}',
      100: '${tokens?.colors?.primary?.['100'] || '#d0d0d0'}',
      500: '${tokens?.colors?.primary?.['500'] || '#000000'}',
      900: '${tokens?.colors?.primary?.['900'] || '#000000'}',
    },
  },
  fonts: {
    heading: '${tokens?.typography?.fontFamily?.sans || 'sans-serif'}',
    body: '${tokens?.typography?.fontFamily?.sans || 'sans-serif'}',
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
    const { tokens } = useDesignSystemStore();
    const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);
    const [generatedCode, setGeneratedCode] = useState(FRAMEWORKS[0].generate(tokens));
    const [copied, setCopied] = useState(false);

    const handleSelect = (framework: typeof FRAMEWORKS[0]) => {
        setSelectedFramework(framework);
        setGeneratedCode(framework.generate(tokens));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
