import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen, Eye, Code, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DocumentationPreview = () => {
    const { tokens, typography } = useDesignSystemStore();
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [activeSection, setActiveSection] = useState('overview');

    const viewportSizes = {
        desktop: 'w-full',
        tablet: 'w-[768px]',
        mobile: 'w-[375px]',
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Documentation Preview</h1>
                            <p className="text-xs text-muted-foreground">
                                Live preview of your design system documentation
                            </p>
                        </div>
                    </div>

                    {/* Viewport Controls */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`p-2 rounded transition-colors ${viewMode === 'desktop' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('tablet')}
                                className={`p-2 rounded transition-colors ${viewMode === 'tablet' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                            >
                                <Tablet className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`p-2 rounded transition-colors ${viewMode === 'mobile' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                    }`}
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Code className="w-4 h-4" />
                            Export Docs
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-64 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Documentation
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'getting-started', label: 'Getting Started' },
                                { id: 'colors', label: 'Colors' },
                                { id: 'typography', label: 'Typography' },
                                { id: 'spacing', label: 'Spacing' },
                                { id: 'components', label: 'Components' },
                                { id: 'patterns', label: 'Patterns' },
                            ].map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${activeSection === section.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-muted/30 flex items-start justify-center overflow-auto p-8">
                    <div className={`${viewportSizes[viewMode]} transition-all duration-300`}>
                        <div className="bg-background rounded-xl shadow-2xl overflow-hidden min-h-[600px]">
                            {/* Mock Documentation Site */}
                            <div className="border-b px-8 py-6 bg-gradient-to-r from-primary/10 to-accent/10">
                                <h1 className="text-4xl font-black mb-2">My Design System</h1>
                                <p className="text-muted-foreground">
                                    A comprehensive design system for building beautiful applications
                                </p>
                            </div>

                            <ScrollArea className="h-[calc(100vh-300px)]">
                                <div className="p-8">
                                    {activeSection === 'overview' && (
                                        <div className="space-y-8">
                                            <div>
                                                <h2 className="text-2xl font-black mb-4">Welcome</h2>
                                                <p className="text-muted-foreground mb-4">
                                                    This design system provides a comprehensive set of reusable components,
                                                    design tokens, and guidelines to help you build consistent and accessible
                                                    user interfaces.
                                                </p>
                                            </div>

                                            <Separator />

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 border rounded-xl">
                                                    <h3 className="font-black mb-2">Foundation</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Colors, typography, spacing, and more
                                                    </p>
                                                </div>
                                                <div className="p-6 border rounded-xl">
                                                    <h3 className="font-black mb-2">Components</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Pre-built UI components ready to use
                                                    </p>
                                                </div>
                                                <div className="p-6 border rounded-xl">
                                                    <h3 className="font-black mb-2">Patterns</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Common UI patterns and best practices
                                                    </p>
                                                </div>
                                                <div className="p-6 border rounded-xl">
                                                    <h3 className="font-black mb-2">Guidelines</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Usage guidelines and accessibility
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'getting-started' && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black">Getting Started</h2>

                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-lg font-bold mb-2">Installation</h3>
                                                    <pre className="p-4 bg-muted rounded-lg font-mono text-sm">
                                                        npm install my-design-system
                                                    </pre>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold mb-2">Usage</h3>
                                                    <pre className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                                                        {`import { Button } from 'my-design-system';

function App() {
  return <Button variant="primary">Click me</Button>;
}`}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'colors' && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black">Color Palette</h2>

                                            <div className="grid grid-cols-3 gap-4">
                                                {Object.entries(tokens.colors).map(([name, value]) => (
                                                    <div key={name} className="space-y-2">
                                                        <div
                                                            className="h-24 rounded-lg border-2"
                                                            style={{ backgroundColor: value as string }}
                                                        />
                                                        <div>
                                                            <p className="font-bold text-sm capitalize">{name}</p>
                                                            <p className="text-xs font-mono text-muted-foreground">
                                                                {value as string}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'typography' && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black">Typography</h2>

                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-bold mb-4">Font Families</h3>
                                                    <div className="space-y-3">
                                                        {Object.entries(typography.fontFamilies).map(([name, value]) => (
                                                            <div key={name} className="p-4 border rounded-lg">
                                                                <p className="text-xs text-muted-foreground mb-2 uppercase">
                                                                    {name}
                                                                </p>
                                                                <p
                                                                    className="text-2xl"
                                                                    style={{ fontFamily: value as string }}
                                                                >
                                                                    The quick brown fox jumps over the lazy dog
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold mb-4">Type Scale</h3>
                                                    <div className="space-y-2">
                                                        {Object.entries(typography.fontSizes).map(([name, value]) => (
                                                            <div key={name} className="flex items-baseline gap-4">
                                                                <span
                                                                    className="font-bold"
                                                                    style={{ fontSize: value as string }}
                                                                >
                                                                    Aa
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {name} - {value as string}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'components' && (
                                        <div className="space-y-8">
                                            <h2 className="text-2xl font-black">Components</h2>

                                            {/* Button Examples */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold">Buttons</h3>
                                                <div className="p-6 border rounded-xl bg-muted/30">
                                                    <div className="flex flex-wrap gap-4">
                                                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold">
                                                            Primary
                                                        </button>
                                                        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-bold">
                                                            Secondary
                                                        </button>
                                                        <button className="px-4 py-2 border-2 rounded-lg font-bold">
                                                            Outline
                                                        </button>
                                                        <button className="px-4 py-2 hover:bg-muted rounded-lg font-bold">
                                                            Ghost
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Input Examples */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold">Inputs</h3>
                                                <div className="p-6 border rounded-xl bg-muted/30 space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Default input"
                                                        className="w-full px-4 py-2 border-2 rounded-lg"
                                                    />
                                                    <input
                                                        type="email"
                                                        placeholder="Email input"
                                                        className="w-full px-4 py-2 border-2 rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            {/* Card Examples */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold">Cards</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-6 border rounded-xl">
                                                        <h4 className="font-bold mb-2">Card Title</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Card description goes here
                                                        </p>
                                                    </div>
                                                    <div className="p-6 border rounded-xl shadow-lg">
                                                        <h4 className="font-bold mb-2">Elevated Card</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Card with elevation
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentationPreview;
