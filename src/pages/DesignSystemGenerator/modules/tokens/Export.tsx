import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileCode, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

const TokenExport = () => {
    const { tokens, typography } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('css');

    const generateCSSVariables = () => {
        let css = ':root {\n';

        // Colors
        css += '  /* Colors */\n';
        css += `  --color-primary: ${tokens.colors.primary};\n`;
        css += `  --color-secondary: ${tokens.colors.secondary};\n`;
        css += `  --color-accent: ${tokens.colors.accent};\n`;
        css += `  --color-background: ${tokens.colors.background};\n`;
        css += `  --color-foreground: ${tokens.colors.foreground};\n`;
        css += `  --color-border: ${tokens.colors.border};\n\n`;

        // Typography
        css += '  /* Typography */\n';
        css += `  --font-sans: ${typography.fontFamilies.sans};\n`;
        css += `  --font-serif: ${typography.fontFamilies.serif};\n`;
        css += `  --font-mono: ${typography.fontFamilies.mono};\n\n`;

        Object.entries(typography.fontSizes).forEach(([key, value]) => {
            css += `  --font-size-${key}: ${value};\n`;
        });

        css += '\n  /* Spacing */\n';
        css += `  --spacing-base: ${tokens.spacing}rem;\n`;
        css += `  --radius: ${tokens.radius}rem;\n`;

        css += '}\n';
        return css;
    };

    const generateTailwindConfig = () => {
        return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${tokens.colors.primary}',
        secondary: '${tokens.colors.secondary}',
        accent: '${tokens.colors.accent}',
        background: '${tokens.colors.background}',
        foreground: '${tokens.colors.foreground}',
        border: '${tokens.colors.border}',
      },
      fontFamily: {
        sans: [${typography.fontFamilies.sans.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        serif: [${typography.fontFamilies.serif.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        mono: [${typography.fontFamilies.mono.split(',').map(f => `'${f.trim()}'`).join(', ')}],
      },
      fontSize: {
        ${Object.entries(typography.fontSizes).map(([key, value]) => `'${key}': '${value}'`).join(',\n        ')}
      },
      borderRadius: {
        DEFAULT: '${tokens.radius}rem',
      },
      spacing: {
        base: '${tokens.spacing}rem',
      },
    },
  },
  plugins: [],
}`;
    };

    const generateJSON = () => {
        return JSON.stringify(
            {
                colors: tokens.colors,
                typography: typography,
                spacing: tokens.spacing,
                radius: tokens.radius,
            },
            null,
            2
        );
    };

    const generateSCSS = () => {
        let scss = '// Colors\n';
        scss += `$color-primary: ${tokens.colors.primary};\n`;
        scss += `$color-secondary: ${tokens.colors.secondary};\n`;
        scss += `$color-accent: ${tokens.colors.accent};\n`;
        scss += `$color-background: ${tokens.colors.background};\n`;
        scss += `$color-foreground: ${tokens.colors.foreground};\n`;
        scss += `$color-border: ${tokens.colors.border};\n\n`;

        scss += '// Typography\n';
        scss += `$font-sans: ${typography.fontFamilies.sans};\n`;
        scss += `$font-serif: ${typography.fontFamilies.serif};\n`;
        scss += `$font-mono: ${typography.fontFamilies.mono};\n\n`;

        scss += '// Font Sizes\n';
        Object.entries(typography.fontSizes).forEach(([key, value]) => {
            scss += `$font-size-${key}: ${value};\n`;
        });

        scss += '\n// Spacing\n';
        scss += `$spacing-base: ${tokens.spacing}rem;\n`;
        scss += `$radius: ${tokens.radius}rem;\n`;

        return scss;
    };

    const copyToClipboard = (content: string, format: string) => {
        navigator.clipboard.writeText(content);
        toast.success(`${format} copied to clipboard!`);
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`${filename} downloaded!`);
    };

    const getContent = () => {
        switch (activeTab) {
            case 'css':
                return generateCSSVariables();
            case 'tailwind':
                return generateTailwindConfig();
            case 'scss':
                return generateSCSS();
            case 'json':
                return generateJSON();
            default:
                return '';
        }
    };

    const getFilename = () => {
        switch (activeTab) {
            case 'css':
                return 'variables.css';
            case 'tailwind':
                return 'tailwind.config.js';
            case 'scss':
                return 'variables.scss';
            case 'json':
                return 'tokens.json';
            default:
                return 'export.txt';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-5xl">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileCode className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Token Export</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Export your design tokens in multiple formats for different frameworks and tools.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                    <div className="border-b px-8 py-4 bg-card/20">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="css">CSS Variables</TabsTrigger>
                                <TabsTrigger value="tailwind">Tailwind Config</TabsTrigger>
                                <TabsTrigger value="scss">SCSS Variables</TabsTrigger>
                                <TabsTrigger value="json">JSON</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-8 max-w-5xl">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        {activeTab === 'css' && 'CSS Custom Properties'}
                                        {activeTab === 'tailwind' && 'Tailwind CSS Configuration'}
                                        {activeTab === 'scss' && 'SCSS Variables'}
                                        {activeTab === 'json' && 'JSON Design Tokens'}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyToClipboard(getContent(), activeTab.toUpperCase())}
                                            className="gap-2"
                                        >
                                            <Copy className="w-3 h-3" />
                                            Copy
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => downloadFile(getContent(), getFilename())}
                                            className="gap-2"
                                        >
                                            <Download className="w-3 h-3" />
                                            Download
                                        </Button>
                                    </div>
                                </div>

                                <pre className="text-sm font-mono bg-muted p-6 rounded-xl overflow-x-auto border">
                                    {getContent()}
                                </pre>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                        Usage Instructions
                                    </h4>
                                    <div className="p-6 border rounded-xl bg-card space-y-3">
                                        {activeTab === 'css' && (
                                            <>
                                                <p className="text-sm font-bold">CSS Variables</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Import this file in your main CSS file and use the variables throughout your
                                                    stylesheets:
                                                </p>
                                                <pre className="text-xs font-mono bg-muted p-3 rounded">
                                                    {`@import './variables.css';

.button {
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius);
}`}
                                                </pre>
                                            </>
                                        )}

                                        {activeTab === 'tailwind' && (
                                            <>
                                                <p className="text-sm font-bold">Tailwind Configuration</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Replace your tailwind.config.js with this configuration to use your design
                                                    tokens:
                                                </p>
                                                <pre className="text-xs font-mono bg-muted p-3 rounded">
                                                    {`<button className="bg-primary text-white rounded">
  Click me
</button>`}
                                                </pre>
                                            </>
                                        )}

                                        {activeTab === 'scss' && (
                                            <>
                                                <p className="text-sm font-bold">SCSS Variables</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Import this file in your main SCSS file:
                                                </p>
                                                <pre className="text-xs font-mono bg-muted p-3 rounded">
                                                    {`@import './variables.scss';

.button {
  background: $color-primary;
  border-radius: $radius;
}`}
                                                </pre>
                                            </>
                                        )}

                                        {activeTab === 'json' && (
                                            <>
                                                <p className="text-sm font-bold">JSON Tokens</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Use this JSON format with Style Dictionary or other design token tools:
                                                </p>
                                                <pre className="text-xs font-mono bg-muted p-3 rounded">
                                                    {`import tokens from './tokens.json';

const primaryColor = tokens.colors.primary;`}
                                                </pre>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default TokenExport;
