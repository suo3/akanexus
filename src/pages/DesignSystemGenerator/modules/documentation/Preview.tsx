import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen, Eye, Code, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DocumentationPreview = () => {
    const { tokens, typography, spacing, shadows, motion } = useDesignSystemStore();
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [activeSection, setActiveSection] = useState('overview');

    const viewportSizes = {
        desktop: 'w-full',
        tablet: 'w-[768px]',
        mobile: 'w-[375px]',
    };


    const handleExportDocs = () => {
        // Generate comprehensive markdown documentation
        const markdown = `# Design System Documentation

> A comprehensive guide to using your design system tokens, components, and patterns.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Shadows & Elevation](#shadows--elevation)
5. [Motion & Animation](#motion--animation)
6. [Usage Guidelines](#usage-guidelines)

---

## Color Palette

Your design system includes the following color tokens:

${Object.entries(tokens.colors)
                .filter(([name, value]) => typeof value === 'string' && !name.endsWith('Scale'))
                .map(([name, value]) => `### ${name.charAt(0).toUpperCase() + name.slice(1)}
- **Hex Value**: \`${value}\`
- **Usage**: ${name === 'primary' ? 'Primary actions, links, and brand elements' :
                        name === 'secondary' ? 'Secondary actions and supporting elements' :
                            name === 'accent' ? 'Highlights, CTAs, and attention-grabbing elements' :
                                name === 'muted' ? 'Backgrounds, subtle elements' :
                                    name === 'background' ? 'Page and card backgrounds' :
                                        name === 'foreground' ? 'Primary text and content' :
                                            name === 'border' ? 'Borders, dividers, and separators' : 'General purpose'}
`)
                .join('\n')}

---

## Typography

### Font Families

${Object.entries(typography.fontFamilies)
                .map(([name, value]) => `- **${name}**: \`${value}\``)
                .join('\n')}

### Font Weights

${Object.entries(typography.fontWeights)
                .map(([name, value]) => `- **${name}**: ${value}`)
                .join('\n')}

### Font Sizes

${Object.entries(typography.fontSizes)
                .map(([name, value]) => `- **${name}**: ${value}`)
                .join('\n')}

### Line Heights

${Object.entries(typography.lineHeights)
                .map(([name, value]) => `- **${name}**: ${value}`)
                .join('\n')}

### Letter Spacing

${Object.entries(typography.letterSpacing)
                .map(([name, value]) => `- **${name}**: ${value}`)
                .join('\n')}

### Typography Settings

- **Base Size**: ${typography.baseSize}px
- **Scale Ratio**: ${typography.scaleRatio}

---

## Spacing

### Base Scale

${Object.entries(spacing.scale)
                .map(([name, value]) => `- **${name}**: ${value}`)
                .join('\n')}

### Grid System

- **Columns**: ${spacing.grid.columns}
- **Gutter**: ${spacing.grid.gutter}
- **Margin**: ${spacing.grid.margin}
- **Max Width**: ${spacing.grid.maxWidth}

### Breakpoints

${Object.entries(spacing.breakpoints)
                .map(([name, value]) => `- **${name}**: ${value}`)
                .join('\n')}

---

## Shadows & Elevation

Use these elevation levels to create depth and hierarchy:

${shadows.levels
                .map(level => `### ${level.name} (Level ${level.level})
- **Description**: ${level.description}
- **CSS**: \`box-shadow: ${level.shadow};\`
`)
                .join('\n')}

---

## Motion & Animation

### Easing Functions

${Object.entries(motion.easings)
                .map(([name, value]) => `- **${name}**: \`${value}\``)
                .join('\n')}

### Duration Scale

${Object.entries(motion.durations)
                .map(([name, value]) => `- **${name}**: ${value}ms`)
                .join('\n')}

---

## Usage Guidelines

### Color Usage

- Use **primary** for main actions and brand elements
- Use **secondary** for supporting actions
- Use **accent** sparingly for highlights and CTAs
- Ensure sufficient contrast ratios for accessibility (WCAG AA: 4.5:1 for normal text)

### Typography Best Practices

- Use the **sans** font family for UI elements and body text
- Use the **serif** font family for headings or editorial content
- Use the **mono** font family for code snippets
- Maintain consistent line heights for readability
- Use the type scale for hierarchical consistency

### Spacing Consistency

- Use the spacing scale for margins, padding, and gaps
- Maintain consistent spacing between related elements
- Use larger spacing to separate distinct sections
- Follow the grid system for layout consistency

### Elevation Hierarchy

- **Level 1-2**: Subtle elevation for cards and containers
- **Level 3-4**: Medium elevation for dropdowns and popovers
- **Level 5-6**: High elevation for modals and overlays

### Animation Principles

- Use **fast** (150ms) for micro-interactions
- Use **base** (300ms) for standard transitions
- Use **slow** (500ms) for complex animations
- Use **easeOut** for elements entering the screen
- Use **easeIn** for elements leaving the screen
- Use **easeInOut** for elements moving within the screen

---

## Implementation

### CSS Variables

\`\`\`css
:root {
${Object.entries(tokens.colors)
                .filter(([name, value]) => typeof value === 'string' && !name.endsWith('Scale'))
                .map(([name, value]) => `  --color-${name}: ${value};`)
                .join('\n')}
}
\`\`\`

### Tailwind Config

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
${Object.entries(tokens.colors)
                .filter(([name, value]) => typeof value === 'string' && !name.endsWith('Scale'))
                .map(([name, value]) => `        ${name}: '${value}',`)
                .join('\n')}
      },
      fontFamily: {
${Object.entries(typography.fontFamilies)
                .map(([name, value]) => `        ${name}: [${value}],`)
                .join('\n')}
      },
    },
  },
};
\`\`\`

---

*Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*
`;

        // Create and download the file
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'design-system-docs.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                        <Button variant="outline" className="gap-2" onClick={handleExportDocs}>
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
                                { id: 'shadows', label: 'Shadows' },
                                { id: 'motion', label: 'Motion' },
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
                                                {Object.entries(tokens.colors)
                                                    .filter(([name, value]) =>
                                                        // Only show base colors (strings), not scale objects
                                                        typeof value === 'string' && !name.endsWith('Scale')
                                                    )
                                                    .map(([name, value]) => (
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

                                    {activeSection === 'spacing' && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black">Spacing Scale</h2>

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold">Base Scale</h3>
                                                <div className="space-y-3">
                                                    {Object.entries(spacing.scale).map(([name, value]) => (
                                                        <div key={name} className="flex items-center gap-4">
                                                            <div className="w-20 text-sm font-mono text-muted-foreground">
                                                                {name}
                                                            </div>
                                                            <div
                                                                className="h-8 bg-primary rounded"
                                                                style={{ width: value as string }}
                                                            />
                                                            <div className="text-sm text-muted-foreground">
                                                                {value as string}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold">Breakpoints</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {Object.entries(spacing.breakpoints).map(([name, value]) => (
                                                        <div key={name} className="p-4 border rounded-lg">
                                                            <p className="font-bold text-sm uppercase mb-1">{name}</p>
                                                            <p className="text-xs font-mono text-muted-foreground">
                                                                {value as string}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'shadows' && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black">Shadows & Elevation</h2>

                                            <div className="space-y-4">
                                                <p className="text-muted-foreground">
                                                    Use elevation to create depth and hierarchy in your interface.
                                                </p>

                                                <div className="grid grid-cols-2 gap-6">
                                                    {shadows.levels.map((level) => (
                                                        <div key={level.level} className="space-y-3">
                                                            <div
                                                                className="h-32 bg-background rounded-xl border flex items-center justify-center"
                                                                style={{ boxShadow: level.shadow }}
                                                            >
                                                                <div className="text-center">
                                                                    <p className="font-black text-2xl">Level {level.level}</p>
                                                                    <p className="text-sm text-muted-foreground">{level.name}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold">{level.description}</p>
                                                                <p className="text-xs font-mono text-muted-foreground mt-1">
                                                                    {level.shadow}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'motion' && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black">Motion & Animation</h2>

                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-bold mb-4">Easing Functions</h3>
                                                    <div className="space-y-3">
                                                        {Object.entries(motion.easings).map(([name, value]) => (
                                                            <div key={name} className="p-4 border rounded-lg">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <p className="font-bold capitalize">{name}</p>
                                                                    <p className="text-xs font-mono text-muted-foreground">
                                                                        {value as string}
                                                                    </p>
                                                                </div>
                                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-primary rounded-full"
                                                                        style={{
                                                                            animation: `slideIn 2s ${value} infinite`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h3 className="text-lg font-bold mb-4">Duration Scale</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {Object.entries(motion.durations).map(([name, value]) => (
                                                            <div key={name} className="p-4 border rounded-lg">
                                                                <p className="font-bold capitalize mb-1">{name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {value}ms
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <style>{`
                                                @keyframes slideIn {
                                                    0% { width: 0%; }
                                                    50% { width: 100%; }
                                                    100% { width: 0%; }
                                                }
                                            `}</style>
                                        </div>
                                    )}

                                    {activeSection === 'patterns' && (
                                        <div className="space-y-8">
                                            <h2 className="text-2xl font-black">Common Patterns</h2>

                                            {/* Form Pattern */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold">Form Layout</h3>
                                                <div className="p-6 border rounded-xl bg-muted/30">
                                                    <div className="space-y-4 max-w-md">
                                                        <div>
                                                            <label className="block text-sm font-bold mb-2">
                                                                Email Address
                                                            </label>
                                                            <input
                                                                type="email"
                                                                placeholder="you@example.com"
                                                                className="w-full px-4 py-2 border-2 rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold mb-2">
                                                                Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                placeholder="••••••••"
                                                                className="w-full px-4 py-2 border-2 rounded-lg"
                                                            />
                                                        </div>
                                                        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold">
                                                            Sign In
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* List Pattern */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold">List Items</h3>
                                                <div className="p-6 border rounded-xl bg-muted/30">
                                                    <div className="space-y-2">
                                                        {['Item One', 'Item Two', 'Item Three'].map((item, i) => (
                                                            <div
                                                                key={i}
                                                                className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                                            >
                                                                <p className="font-bold">{item}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Description for {item.toLowerCase()}
                                                                </p>
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
