import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    BookOpen,
    Code,
    Table,
    Search,
    Component,
    Copy,
    CheckCircle2,
    FileText,
    Eye,
    Download,
    Palette,
    Type,
    Ruler,
    Layers,
    Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

// Type definitions
interface ComponentDoc {
    name: string;
    category: 'component';
    description: string;
    import: string;
    props: Array<{
        name: string;
        type: string;
        default: string;
        description: string;
    }>;
    examples: Array<{
        title: string;
        code: string;
    }>;
    accessibility: string;
    usage: {
        whenToUse: string;
        whenNotToUse: string;
    };
}

interface TokenDoc {
    name: string;
    category: 'token';
    icon: LucideIcon;
    description: string;
    type: 'design-token';
    data: string;
}

type DocItem = ComponentDoc | TokenDoc;

// Comprehensive Component and Token Documentation
const COMPONENT_DOCS: ComponentDoc[] = [
    // UI Components
    {
        name: 'Button',
        category: 'component',
        description: 'Triggers an event or action. Standard UI element for user interactions with multiple variants and sizes.',
        import: "import { Button } from '@/components/ui/button'",
        props: [
            { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'", description: 'The visual style variant of the button.' },
            { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", default: "'default'", description: 'The size of the button.' },
            { name: 'asChild', type: 'boolean', default: 'false', description: 'Render as a child component for composition.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button and prevents interactions.' },
        ],
        examples: [
            { title: 'Primary Button', code: '<Button>Click me</Button>' },
            { title: 'Destructive', code: '<Button variant="destructive">Delete</Button>' },
            { title: 'Outline', code: '<Button variant="outline">Cancel</Button>' },
        ],
        accessibility: 'Supports keyboard navigation (Enter/Space), ARIA attributes, and focus management.',
        usage: { whenToUse: 'For primary actions, form submissions, and navigation', whenNotToUse: 'For links to external pages (use Link instead)' }
    },
    {
        name: 'Input',
        category: 'component',
        description: 'Text input field for user data entry with support for various input types.',
        import: "import { Input } from '@/components/ui/input'",
        props: [
            { name: 'type', type: 'string', default: "'text'", description: 'HTML input type (text, email, password, etc.).' },
            { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text shown when empty.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input field.' },
            { name: 'value', type: 'string', default: '-', description: 'Controlled input value.' },
        ],
        examples: [
            { title: 'Email Input', code: '<Input type="email" placeholder="you@example.com" />' },
            { title: 'Password', code: '<Input type="password" placeholder="••••••••" />' },
        ],
        accessibility: 'Supports ARIA labels, keyboard navigation, and screen readers.',
        usage: { whenToUse: 'For single-line text input in forms', whenNotToUse: 'For multi-line text (use Textarea)' }
    },
    {
        name: 'Badge',
        category: 'component',
        description: 'Small status indicator or label for categorization and highlighting.',
        import: "import { Badge } from '@/components/ui/badge'",
        props: [
            { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline'", default: "'default'", description: 'Visual style variant.' },
        ],
        examples: [
            { title: 'Default Badge', code: '<Badge>New</Badge>' },
            { title: 'Destructive', code: '<Badge variant="destructive">Error</Badge>' },
        ],
        accessibility: 'Semantic HTML with proper color contrast.',
        usage: { whenToUse: 'For status indicators, tags, and labels', whenNotToUse: 'For interactive elements (use Button)' }
    },
    {
        name: 'Card',
        category: 'component',
        description: 'Container component for grouping related content with header, content, and footer sections.',
        import: "import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'",
        props: [
            { name: 'className', type: 'string', default: '-', description: 'Additional CSS classes for styling.' },
        ],
        examples: [
            { title: 'Simple Card', code: '<Card>\n  <CardHeader><CardTitle>Title</CardTitle></CardHeader>\n  <CardContent>Content</CardContent>\n</Card>' },
        ],
        accessibility: 'Semantic structure with proper heading hierarchy.',
        usage: { whenToUse: 'For grouping related information', whenNotToUse: 'For simple text blocks' }
    },
    {
        name: 'Tabs',
        category: 'component',
        description: 'Organize content into multiple panels with tab navigation.',
        import: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'",
        props: [
            { name: 'defaultValue', type: 'string', default: '-', description: 'Initially active tab.' },
            { name: 'value', type: 'string', default: '-', description: 'Controlled active tab value.' },
        ],
        examples: [
            { title: 'Basic Tabs', code: '<Tabs defaultValue="tab1">\n  <TabsList>\n    <TabsTrigger value="tab1">Tab 1</TabsTrigger>\n  </TabsList>\n  <TabsContent value="tab1">Content</TabsContent>\n</Tabs>' },
        ],
        accessibility: 'ARIA tablist pattern with keyboard navigation (Arrow keys).',
        usage: { whenToUse: 'For organizing related content sections', whenNotToUse: 'For navigation (use Nav)' }
    },
    {
        name: 'Separator',
        category: 'component',
        description: 'Visual divider between content sections.',
        import: "import { Separator } from '@/components/ui/separator'",
        props: [
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the separator.' },
        ],
        examples: [
            { title: 'Horizontal', code: '<Separator />' },
            { title: 'Vertical', code: '<Separator orientation="vertical" />' },
        ],
        accessibility: 'ARIA separator role.',
        usage: { whenToUse: 'To visually separate content sections', whenNotToUse: 'For spacing (use margin/padding)' }
    },
    {
        name: 'ScrollArea',
        category: 'component',
        description: 'Custom scrollable area with styled scrollbars.',
        import: "import { ScrollArea } from '@/components/ui/scroll-area'",
        props: [
            { name: 'className', type: 'string', default: '-', description: 'Additional CSS classes.' },
        ],
        examples: [
            { title: 'Scrollable Content', code: '<ScrollArea className="h-72">\n  <div>Long content...</div>\n</ScrollArea>' },
        ],
        accessibility: 'Native scroll behavior with keyboard support.',
        usage: { whenToUse: 'For constrained scrollable areas', whenNotToUse: 'For full-page scrolling' }
    },
];

// Design Token Documentation
const TOKEN_DOCS: TokenDoc[] = [
    {
        name: 'Colors',
        category: 'token',
        icon: Palette,
        description: 'Color palette including primary, secondary, accent, and semantic colors.',
        type: 'design-token',
        data: 'colors'
    },
    {
        name: 'Typography',
        category: 'token',
        icon: Type,
        description: 'Font families, sizes, weights, line heights, and letter spacing.',
        type: 'design-token',
        data: 'typography'
    },
    {
        name: 'Spacing',
        category: 'token',
        icon: Ruler,
        description: 'Spacing scale, grid system, and responsive breakpoints.',
        type: 'design-token',
        data: 'spacing'
    },
    {
        name: 'Shadows',
        category: 'token',
        icon: Layers,
        description: 'Elevation levels and shadow definitions for depth.',
        type: 'design-token',
        data: 'shadows'
    },
    {
        name: 'Motion',
        category: 'token',
        icon: Zap,
        description: 'Animation easing functions and duration scales.',
        type: 'design-token',
        data: 'motion'
    },
];

const ALL_DOCS: DocItem[] = [...COMPONENT_DOCS, ...TOKEN_DOCS];

export default function AutoDocs() {
    const { tokens, typography, spacing, shadows, motion } = useDesignSystemStore();
    const [search, setSearch] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(ALL_DOCS[0]);
    const [copied, setCopied] = useState(false);
    const [activeCategory, setActiveCategory] = useState<'all' | 'component' | 'token'>('all');
    const [exportFormat, setExportFormat] = useState<'typescript' | 'json' | 'css'>('typescript');

    const filteredDocs = ALL_DOCS.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCopy = (code: string) => {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => {
                    // Fallback if clipboard API fails
                    fallbackCopy(code);
                });
        } else {
            // Fallback for non-HTTPS contexts
            fallbackCopy(code);
        }
    };

    const fallbackCopy = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    const handleExport = () => {
        let content = '';
        const timestamp = new Date().toISOString();

        if (exportFormat === 'typescript') {
            content = `// Generated on ${timestamp}\n\n`;
            COMPONENT_DOCS.forEach(comp => {
                content += `export interface ${comp.name}Props {\n`;
                comp.props.forEach(prop => {
                    content += `  /** ${prop.description} */\n`;
                    content += `  ${prop.name}?: ${prop.type};\n`;
                });
                content += `}\n\n`;
            });
        } else if (exportFormat === 'json') {
            content = JSON.stringify({ components: COMPONENT_DOCS, tokens: { colors: tokens.colors, typography, spacing, shadows, motion }, generatedAt: timestamp }, null, 2);
        } else if (exportFormat === 'css') {
            content = `/* Generated on ${timestamp} */\n\n:root {\n`;

            // Colors
            content += '  /* Colors */\n';
            Object.entries(tokens.colors)
                .filter(([name, value]) => typeof value === 'string' && !name.endsWith('Scale'))
                .forEach(([name, value]) => {
                    content += `  --color-${name}: ${value};\n`;
                });

            // Typography - Font Families
            content += '\n  /* Typography - Font Families */\n';
            content += `  --font-sans: ${typography.fontFamilies.sans};\n`;
            content += `  --font-serif: ${typography.fontFamilies.serif};\n`;
            content += `  --font-mono: ${typography.fontFamilies.mono};\n`;

            // Typography - Font Sizes
            content += '\n  /* Typography - Font Sizes */\n';
            Object.entries(typography.fontSizes).forEach(([key, value]) => {
                content += `  --font-size-${key}: ${value};\n`;
            });

            // Typography - Font Weights
            content += '\n  /* Typography - Font Weights */\n';
            Object.entries(typography.fontWeights).forEach(([key, value]) => {
                content += `  --font-weight-${key}: ${value};\n`;
            });

            // Typography - Line Heights
            content += '\n  /* Typography - Line Heights */\n';
            Object.entries(typography.lineHeights).forEach(([key, value]) => {
                content += `  --line-height-${key}: ${value};\n`;
            });

            // Typography - Letter Spacing
            content += '\n  /* Typography - Letter Spacing */\n';
            Object.entries(typography.letterSpacing).forEach(([key, value]) => {
                content += `  --letter-spacing-${key}: ${value};\n`;
            });

            // Spacing
            content += '\n  /* Spacing */\n';
            if (spacing?.scale) {
                Object.entries(spacing.scale).forEach(([key, value]) => {
                    content += `  --spacing-${key}: ${value};\n`;
                });
            }

            // Radius
            content += '\n  /* Radius */\n';
            content += `  --radius: ${tokens.radius}rem;\n`;

            // Shadows
            content += '\n  /* Shadows */\n';
            if (shadows?.levels) {
                shadows.levels.forEach((level) => {
                    content += `  --shadow-${level.name}: ${level.shadow};\n`;
                });
            }

            // Motion
            content += '\n  /* Motion */\n';
            if (motion?.easings) {
                Object.entries(motion.easings).forEach(([key, value]) => {
                    content += `  --easing-${key}: ${value};\n`;
                });
            }
            if (motion?.durations) {
                Object.entries(motion.durations).forEach(([key, value]) => {
                    content += `  --duration-${key}: ${value}ms;\n`;
                });
            }

            content += `}\n`;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `design-system-api.${exportFormat === 'typescript' ? 'ts' : exportFormat === 'json' ? 'json' : 'css'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderTokenContent = () => {
        if (!selectedDoc || selectedDoc.category !== 'token') return null;

        const tokenData = selectedDoc.data;

        if (tokenData === 'colors') {
            return (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black">Color Tokens</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {Object.entries(tokens.colors)
                            .filter(([name, value]) => typeof value === 'string' && !name.endsWith('Scale'))
                            .map(([name, value]) => (
                                <div key={name} className="space-y-3">
                                    <div className="h-24 rounded-xl border-2" style={{ backgroundColor: value as string }} />
                                    <div>
                                        <p className="font-bold capitalize">{name}</p>
                                        <p className="text-sm font-mono text-muted-foreground">{value as string}</p>
                                        <p className="text-xs text-muted-foreground mt-1">--color-{name}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            );
        } else if (tokenData === 'typography') {
            return (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-black mb-4">Font Families</h3>
                        <div className="space-y-3">
                            {Object.entries(typography.fontFamilies).map(([name, value]) => (
                                <div key={name} className="p-4 border rounded-lg">
                                    <p className="text-xs text-muted-foreground uppercase mb-2">{name}</p>
                                    <p className="text-2xl" style={{ fontFamily: value as string }}>The quick brown fox</p>
                                    <p className="text-xs font-mono text-muted-foreground mt-2">{value as string}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-2xl font-black mb-4">Font Sizes</h3>
                        <div className="space-y-2">
                            {Object.entries(typography.fontSizes).map(([name, value]) => (
                                <div key={name} className="flex items-baseline gap-4">
                                    <span className="font-bold" style={{ fontSize: value as string }}>Aa</span>
                                    <span className="text-sm text-muted-foreground">{name} - {value as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else if (tokenData === 'spacing') {
            return (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-black mb-4">Spacing Scale</h3>
                        <div className="space-y-3">
                            {Object.entries(spacing.scale).map(([name, value]) => (
                                <div key={name} className="flex items-center gap-4">
                                    <div className="w-16 text-sm font-mono">{name}</div>
                                    <div className="h-8 bg-primary rounded" style={{ width: value as string }} />
                                    <div className="text-sm text-muted-foreground">{value as string}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-2xl font-black mb-4">Breakpoints</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(spacing.breakpoints).map(([name, value]) => (
                                <div key={name} className="p-4 border rounded-lg">
                                    <p className="font-bold uppercase">{name}</p>
                                    <p className="text-sm text-muted-foreground">{value as string}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else if (tokenData === 'shadows') {
            return (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black">Shadow Tokens</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {shadows.levels.map((level) => (
                            <div key={level.level} className="space-y-3">
                                <div className="h-32 bg-background rounded-xl border flex items-center justify-center" style={{ boxShadow: level.shadow }}>
                                    <div className="text-center">
                                        <p className="font-black text-xl">Level {level.level}</p>
                                        <p className="text-sm text-muted-foreground">{level.name}</p>
                                    </div>
                                </div>
                                <p className="text-sm">{level.description}</p>
                                <p className="text-xs font-mono text-muted-foreground">{level.shadow}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (tokenData === 'motion') {
            return (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-black mb-4">Easing Functions</h3>
                        <div className="space-y-3">
                            {Object.entries(motion.easings).map(([name, value]) => (
                                <div key={name} className="p-4 border rounded-lg">
                                    <p className="font-bold capitalize mb-2">{name}</p>
                                    <p className="text-xs font-mono text-muted-foreground">{value as string}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-2xl font-black mb-4">Durations</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(motion.durations).map(([name, value]) => (
                                <div key={name} className="p-4 border rounded-lg">
                                    <p className="font-bold capitalize">{name}</p>
                                    <p className="text-sm text-muted-foreground">{value}ms</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">API Reference</h1>
                            <p className="text-sm text-muted-foreground">Components, tokens, and utilities documentation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as any)}
                            className="px-3 py-2 border rounded-lg text-sm bg-background"
                        >
                            <option value="typescript">TypeScript</option>
                            <option value="json">JSON</option>
                            <option value="css">CSS</option>
                        </select>
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                            Export API
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b space-y-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search API..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-background/50"
                            />
                        </div>
                        <div className="flex gap-1 p-1 bg-muted rounded-lg">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`flex-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeCategory === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActiveCategory('component')}
                                className={`flex-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeCategory === 'component' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                            >
                                Components
                            </button>
                            <button
                                onClick={() => setActiveCategory('token')}
                                className={`flex-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeCategory === 'token' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                            >
                                Tokens
                            </button>
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {filteredDocs.map(doc => {
                                const Icon = doc.category === 'token' ? doc.icon : Component;
                                return (
                                    <button
                                        key={doc.name}
                                        onClick={() => setSelectedDoc(doc)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDoc?.name === doc.name
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {doc.name}
                                        {doc.category === 'token' && (
                                            <Badge variant="secondary" className="ml-auto text-xs">Token</Badge>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {selectedDoc ? (
                        <div className="max-w-4xl mx-auto p-8 space-y-8">
                            {selectedDoc.category === 'component' ? (
                                <>
                                    {/* Component Documentation */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-4xl font-black tracking-tight">{selectedDoc.name}</h2>
                                            <Badge variant="outline" className="font-mono text-xs">v1.0.0</Badge>
                                        </div>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            {selectedDoc.description}
                                        </p>

                                        <div className="p-4 rounded-xl bg-muted/50 border flex items-center justify-between font-mono text-sm">
                                            <code className="text-primary">{selectedDoc.import}</code>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(selectedDoc.import)}>
                                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="props" className="w-full">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="props" className="gap-2">
                                                <Table className="w-4 h-4" />
                                                Props API
                                            </TabsTrigger>
                                            <TabsTrigger value="examples" className="gap-2">
                                                <Code className="w-4 h-4" />
                                                Examples
                                            </TabsTrigger>
                                            {selectedDoc.accessibility && (
                                                <TabsTrigger value="accessibility" className="gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    Accessibility
                                                </TabsTrigger>
                                            )}
                                        </TabsList>

                                        <TabsContent value="props" className="space-y-4">
                                            <div className="rounded-xl border bg-card overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-muted/50 border-b">
                                                        <tr>
                                                            <th className="px-6 py-3 font-bold">Prop</th>
                                                            <th className="px-6 py-3 font-bold">Type</th>
                                                            <th className="px-6 py-3 font-bold">Default</th>
                                                            <th className="px-6 py-3 font-bold">Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {selectedDoc.props.map((prop: any) => (
                                                            <tr key={prop.name} className="hover:bg-muted/10">
                                                                <td className="px-6 py-4 font-mono text-primary font-bold">{prop.name}</td>
                                                                <td className="px-6 py-4 font-mono text-xs text-purple-500">{prop.type}</td>
                                                                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{prop.default}</td>
                                                                <td className="px-6 py-4 text-muted-foreground">{prop.description}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="examples" className="space-y-6">
                                            {selectedDoc.examples.map((example: any, idx: number) => (
                                                <div key={idx} className="space-y-3">
                                                    <h3 className="font-bold text-lg">{example.title}</h3>
                                                    <div className="relative group rounded-xl overflow-hidden border bg-[#0d1117]">
                                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleCopy(example.code)}>
                                                                <Copy className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
                                                            <pre>{example.code}</pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </TabsContent>

                                        {selectedDoc.accessibility && (
                                            <TabsContent value="accessibility" className="space-y-4">
                                                <div className="p-6 border rounded-xl bg-card">
                                                    <h3 className="font-bold text-lg mb-3">Accessibility Features</h3>
                                                    <p className="text-muted-foreground">{selectedDoc.accessibility}</p>
                                                    {selectedDoc.usage && (
                                                        <div className="mt-6 space-y-4">
                                                            <div>
                                                                <h4 className="font-bold mb-2">When to use</h4>
                                                                <p className="text-sm text-muted-foreground">{selectedDoc.usage.whenToUse}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold mb-2">When not to use</h4>
                                                                <p className="text-sm text-muted-foreground">{selectedDoc.usage.whenNotToUse}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        )}
                                    </Tabs>
                                </>
                            ) : (
                                <>
                                    {/* Token Documentation */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {selectedDoc.icon && <selectedDoc.icon className="w-10 h-10 text-primary" />}
                                            <div>
                                                <h2 className="text-4xl font-black tracking-tight">{selectedDoc.name}</h2>
                                                <p className="text-lg text-muted-foreground">{selectedDoc.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {renderTokenContent()}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select an item to view documentation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
