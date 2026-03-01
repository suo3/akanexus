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
    {
        name: 'Button',
        category: 'component',
        description: 'Triggers an event or action. Standard UI element for user interactions with multiple variants and sizes.',
        import: "import { Button } from '@/components/ui/button'",
        props: [
            { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'", description: 'The visual style variant of the button.' },
            { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", default: "'default'", description: 'The size of the button.' },
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
        name: 'Modal',
        category: 'component',
        description: 'Dialog overlay component for focused user interactions, confirmations, and content display.',
        import: "import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'",
        props: [
            { name: 'open', type: 'boolean', default: 'false', description: 'Controls modal visibility.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', default: '-', description: 'Callback when open state changes.' },
            { name: 'modal', type: 'boolean', default: 'true', description: 'Whether to block background interaction.' },
        ],
        examples: [
            { title: 'Basic Modal', code: '<Dialog open={open} onOpenChange={setOpen}>\n  <DialogContent>\n    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>\n    Content\n  </DialogContent>\n</Dialog>' },
        ],
        accessibility: 'Focus trapped inside dialog, ESC to close, ARIA role="dialog".',
        usage: { whenToUse: 'For confirmations, forms, and detail views', whenNotToUse: 'For non-blocking notifications (use Toast)' }
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
            { title: 'Basic Tabs', code: '<Tabs defaultValue="tab1">\n  <TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger></TabsList>\n  <TabsContent value="tab1">Content</TabsContent>\n</Tabs>' },
        ],
        accessibility: 'ARIA tablist pattern with keyboard navigation (Arrow keys).',
        usage: { whenToUse: 'For organizing related content sections', whenNotToUse: 'For navigation (use Nav)' }
    },
    {
        name: 'Avatar',
        category: 'component',
        description: 'User profile image or initials display with fallback support and status indicators.',
        import: "import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'",
        props: [
            { name: 'src', type: 'string', default: '-', description: 'Image URL for the avatar.' },
            { name: 'alt', type: 'string', default: '-', description: 'Alt text for accessibility.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar size preset.' },
        ],
        examples: [
            { title: 'With Image', code: '<Avatar>\n  <AvatarImage src="/avatar.jpg" alt="User" />\n  <AvatarFallback>JD</AvatarFallback>\n</Avatar>' },
        ],
        accessibility: 'Alt text required for images; initials used as fallback.',
        usage: { whenToUse: 'For displaying user profile images or initials', whenNotToUse: 'For decorative icons' }
    },
    {
        name: 'Alert',
        category: 'component',
        description: 'Status and feedback messages for informational, warning, error, and success states.',
        import: "import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'",
        props: [
            { name: 'variant', type: "'default' | 'destructive' | 'success' | 'warning' | 'info'", default: "'default'", description: 'Alert severity variant.' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Whether the alert can be dismissed.' },
        ],
        examples: [
            { title: 'Info Alert', code: '<Alert>\n  <AlertTitle>Info</AlertTitle>\n  <AlertDescription>Informational message.</AlertDescription>\n</Alert>' },
            { title: 'Destructive', code: '<Alert variant="destructive">\n  <AlertTitle>Error</AlertTitle>\n  <AlertDescription>Something went wrong.</AlertDescription>\n</Alert>' },
        ],
        accessibility: 'ARIA role="alert" for immediate announcements.',
        usage: { whenToUse: 'For inline status messages and feedback', whenNotToUse: 'For temporary messages (use Toast)' }
    },
    {
        name: 'Toast',
        category: 'component',
        description: 'Temporary non-blocking notification that appears briefly and auto-dismisses.',
        import: "import { toast } from 'sonner'",
        props: [
            { name: 'message', type: 'string', default: '-', description: 'Toast message content.' },
            { name: 'type', type: "'success' | 'error' | 'warning' | 'info'", default: "'default'", description: 'Toast severity type.' },
            { name: 'duration', type: 'number', default: '3000', description: 'Auto-dismiss duration in ms.' },
            { name: 'position', type: "'top-right' | 'bottom-right' | 'top-center' | 'bottom-center'", default: "'top-right'", description: 'Toast screen position.' },
        ],
        examples: [
            { title: 'Success Toast', code: "toast.success('Saved successfully!')" },
            { title: 'Error Toast', code: "toast.error('Something went wrong')" },
        ],
        accessibility: 'ARIA live region for screen reader announcements.',
        usage: { whenToUse: 'For brief feedback after user actions', whenNotToUse: 'For critical errors requiring user action (use Alert or Modal)' }
    },
    {
        name: 'Spinner',
        category: 'component',
        description: 'Loading state indicator with multiple animation styles and configurable sizes.',
        import: "import { Loader2 } from 'lucide-react'",
        props: [
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Spinner size.' },
            { name: 'color', type: 'string', default: "'primary'", description: 'Spinner color class.' },
        ],
        examples: [
            { title: 'Basic Spinner', code: '<Loader2 className="animate-spin w-6 h-6 text-primary" />' },
        ],
        accessibility: 'Use aria-label="Loading" and aria-live="polite".',
        usage: { whenToUse: 'For async operations and loading states', whenNotToUse: 'For determinate progress (use Progress bar)' }
    },
    {
        name: 'Breadcrumb',
        category: 'component',
        description: 'Navigation trail showing current location within a hierarchical structure.',
        import: "import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb'",
        props: [
            { name: 'separator', type: "'slash' | 'arrow' | 'dot' | 'chevron'", default: "'slash'", description: 'Separator style between items.' },
            { name: 'showHome', type: 'boolean', default: 'true', description: 'Show home icon as first item.' },
        ],
        examples: [
            { title: 'Basic Breadcrumb', code: '<Breadcrumb>\n  <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>\n  <BreadcrumbSeparator />\n  <BreadcrumbItem>Current Page</BreadcrumbItem>\n</Breadcrumb>' },
        ],
        accessibility: 'ARIA nav with aria-label="breadcrumb" and aria-current="page".',
        usage: { whenToUse: 'For hierarchical navigation in deep page structures', whenNotToUse: 'For flat navigation structures' }
    },
    {
        name: 'Table',
        category: 'component',
        description: 'Data table with sorting, filtering, selection, and pagination capabilities.',
        import: "import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'",
        props: [
            { name: 'data', type: 'T[]', default: '-', description: 'Array of data rows to display.' },
            { name: 'sortable', type: 'boolean', default: 'false', description: 'Enable column sorting.' },
            { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable row selection checkboxes.' },
        ],
        examples: [
            { title: 'Basic Table', code: '<Table>\n  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>\n  <TableBody><TableRow><TableCell>Alice</TableCell><TableCell>Active</TableCell></TableRow></TableBody>\n</Table>' },
        ],
        accessibility: 'ARIA table roles, column headers with scope, keyboard navigation.',
        usage: { whenToUse: 'For structured data with multiple attributes', whenNotToUse: 'For simple lists with one or two properties' }
    },
    {
        name: 'Select',
        category: 'component',
        description: 'Dropdown selection with search, multi-select, and clearable options.',
        import: "import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'",
        props: [
            { name: 'value', type: 'string', default: '-', description: 'Controlled selected value.' },
            { name: 'onValueChange', type: '(value: string) => void', default: '-', description: 'Callback when selection changes.' },
            { name: 'placeholder', type: 'string', default: "'Select...'", description: 'Placeholder text when empty.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select.' },
        ],
        examples: [
            { title: 'Basic Select', code: '<Select value={value} onValueChange={setValue}>\n  <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>\n  <SelectContent>\n    <SelectItem value="a">Option A</SelectItem>\n  </SelectContent>\n</Select>' },
        ],
        accessibility: 'ARIA combobox pattern with keyboard navigation.',
        usage: { whenToUse: 'When users need to choose from a list of options', whenNotToUse: 'For fewer than 4 options (use Radio Group instead)' }
    },
    {
        name: 'List',
        category: 'component',
        description: 'Structured list component with selectable items, icons, badges, and descriptions.',
        import: "import { ListItem } from '@/components/ui/list'",
        props: [
            { name: 'variant', type: "'default' | 'bordered' | 'divided' | 'card'", default: "'default'", description: 'List visual style.' },
            { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable item selection.' },
            { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allow multiple selections.' },
        ],
        examples: [
            { title: 'Basic List', code: '<ul className="divide-y rounded-lg border">\n  <li className="px-4 py-3">Item 1</li>\n  <li className="px-4 py-3">Item 2</li>\n</ul>' },
        ],
        accessibility: 'Proper list semantics with ul/li, ARIA roles for interactive lists.',
        usage: { whenToUse: 'For collections of items with consistent structure', whenNotToUse: 'For navigation menus (use Nav)' }
    },
    {
        name: 'Navbar',
        category: 'component',
        description: 'Top navigation bar with logo, links, search, notifications, and responsive mobile menu.',
        import: "import { Navbar } from '@/components/ui/navbar'",
        props: [
            { name: 'variant', type: "'default' | 'bordered' | 'floating' | 'minimal' | 'dark'", default: "'default'", description: 'Navbar style variant.' },
            { name: 'sticky', type: 'boolean', default: 'false', description: 'Makes navbar sticky on scroll.' },
            { name: 'showSearch', type: 'boolean', default: 'false', description: 'Show search input.' },
        ],
        examples: [
            { title: 'Basic Navbar', code: '<nav className="flex items-center justify-between px-6 py-4 border-b">\n  <span className="font-bold">Logo</span>\n  <div className="flex gap-6"><a href="/">Home</a><a href="/about">About</a></div>\n</nav>' },
        ],
        accessibility: 'ARIA role="navigation", landmark regions, keyboard accessible.',
        usage: { whenToUse: 'For top-level app navigation', whenNotToUse: 'For in-page navigation (use Tabs or Sidebar)' }
    },
    {
        name: 'Pagination',
        category: 'component',
        description: 'Page navigation controls with configurable variants, sibling count, and first/last buttons.',
        import: "import { Pagination } from '@/components/ui/pagination'",
        props: [
            { name: 'currentPage', type: 'number', default: '1', description: 'Active page number.' },
            { name: 'totalPages', type: 'number', default: '-', description: 'Total number of pages.' },
            { name: 'onPageChange', type: '(page: number) => void', default: '-', description: 'Callback when page changes.' },
            { name: 'siblingCount', type: 'number', default: '1', description: 'Number of siblings around current page.' },
        ],
        examples: [
            { title: 'Basic Pagination', code: '<Pagination currentPage={page} totalPages={10} onPageChange={setPage} />' },
        ],
        accessibility: 'ARIA role="navigation" with aria-label="Pagination", aria-current="page".',
        usage: { whenToUse: 'For navigating large datasets split across pages', whenNotToUse: 'For small datasets (use infinite scroll or show all)' }
    },
    {
        name: 'Accordion',
        category: 'component',
        description: 'Collapsible content panels with animated expand/collapse, icons, and single/multiple open modes.',
        import: "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'",
        props: [
            { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Whether one or multiple items can be open.' },
            { name: 'collapsible', type: 'boolean', default: 'true', description: 'Allow collapsing the open item.' },
            { name: 'defaultValue', type: 'string | string[]', default: '-', description: 'Initially open item(s).' },
        ],
        examples: [
            { title: 'Basic Accordion', code: '<Accordion type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Question?</AccordionTrigger>\n    <AccordionContent>Answer goes here.</AccordionContent>\n  </AccordionItem>\n</Accordion>' },
        ],
        accessibility: 'ARIA expanded state, keyboard navigation (Enter, Space, Arrow keys).',
        usage: { whenToUse: 'For FAQs, settings panels, and collapsible content sections', whenNotToUse: 'For content that should always be visible' }
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
            <div className="border-b px-4 md:px-8 py-5 md:py-6 bg-card/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">API Reference</h1>
                            <p className="text-xs md:text-sm text-muted-foreground">Components, tokens, and utilities documentation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as any)}
                            className="px-3 py-2 border rounded-lg text-sm bg-background font-mono"
                        >
                            <option value="typescript">TS</option>
                            <option value="json">JSON</option>
                            <option value="css">CSS</option>
                        </select>
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export API</span>
                            <span className="sm:hidden">Export</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Sidebar */}
                <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r bg-card/30 flex flex-col shrink-0">
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
                <div className="flex-1 overflow-auto bg-background/50">
                    {selectedDoc ? (
                        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
                            {selectedDoc.category === 'component' ? (
                                <>
                                    {/* Component Documentation */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{selectedDoc.name}</h2>
                                            <Badge variant="outline" className="font-mono text-xs">v1.0.0</Badge>
                                        </div>
                                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                            {selectedDoc.description}
                                        </p>

                                        <div className="p-4 rounded-xl bg-muted/50 border flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-sm">
                                            <code className="text-primary break-all">{selectedDoc.import}</code>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => handleCopy(selectedDoc.import)}>
                                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="props" className="w-full">
                                        <TabsList className="mb-4 flex-wrap h-auto p-1">
                                            <TabsTrigger value="props" className="gap-2 text-xs md:text-sm">
                                                <Table className="w-4 h-4" />
                                                Props
                                            </TabsTrigger>
                                            <TabsTrigger value="examples" className="gap-2 text-xs md:text-sm">
                                                <Code className="w-4 h-4" />
                                                Examples
                                            </TabsTrigger>
                                            {selectedDoc.accessibility && (
                                                <TabsTrigger value="accessibility" className="gap-2 text-xs md:text-sm">
                                                    <Eye className="w-4 h-4" />
                                                    A11y
                                                </TabsTrigger>
                                            )}
                                        </TabsList>

                                        <TabsContent value="props" className="space-y-4">
                                            <div className="rounded-xl border bg-card overflow-x-auto">
                                                <table className="w-full text-sm text-left border-collapse">
                                                    <thead className="bg-muted/50 border-b">
                                                        <tr>
                                                            <th className="px-4 py-3 font-bold">Prop</th>
                                                            <th className="px-4 py-3 font-bold hidden sm:table-cell">Type</th>
                                                            <th className="px-4 py-3 font-bold">Default</th>
                                                            <th className="px-4 py-3 font-bold hidden md:table-cell">Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y text-xs sm:text-sm">
                                                        {(selectedDoc as ComponentDoc).props.map((prop: any) => (
                                                            <tr key={prop.name} className="hover:bg-muted/10">
                                                                <td className="px-4 py-4 font-mono text-primary font-bold">{prop.name}</td>
                                                                <td className="px-4 py-4 font-mono text-purple-500 hidden sm:table-cell">{prop.type}</td>
                                                                <td className="px-4 py-4 font-mono text-muted-foreground">{prop.default}</td>
                                                                <td className="px-4 py-4 text-muted-foreground hidden md:table-cell">{prop.description}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="examples" className="space-y-6">
                                            {(selectedDoc as ComponentDoc).examples.map((example: any, idx: number) => (
                                                <div key={idx} className="space-y-3">
                                                    <h3 className="font-bold text-lg">{example.title}</h3>
                                                    <div className="relative group rounded-xl overflow-hidden border bg-[#0d1117]">
                                                        <div className="absolute top-3 right-3 opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleCopy(example.code)}>
                                                                <Copy className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-gray-300">
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
                                                    <p className="text-muted-foreground text-sm md:text-base">{selectedDoc.accessibility}</p>
                                                    {(selectedDoc as ComponentDoc).usage && (
                                                        <div className="mt-6 space-y-4">
                                                            <div>
                                                                <h4 className="font-bold mb-2">When to use</h4>
                                                                <p className="text-sm text-muted-foreground">{(selectedDoc as ComponentDoc).usage.whenToUse}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold mb-2">When not to use</h4>
                                                                <p className="text-sm text-muted-foreground">{(selectedDoc as ComponentDoc).usage.whenNotToUse}</p>
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
                                    <div className="space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            {(() => {
                                                const Icon = (selectedDoc as TokenDoc).icon;
                                                return Icon && <Icon className="w-12 h-12 text-primary shrink-0" />;
                                            })()}
                                            <div>
                                                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{selectedDoc.name}</h2>
                                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{selectedDoc.description}</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            {renderTokenContent()}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <FileText className="w-16 h-16 mb-4 opacity-10" />
                            <h3 className="text-xl font-bold mb-1">No Selection</h3>
                            <p className="max-w-xs mx-auto">Select a component or token from the sidebar to view its API documentation and usage guidelines.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
