import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Palette,
    Type,
    Grid3x3,
    Box,
    Sparkles,
    Component as ComponentIcon,
    FileCode,
    BookOpen,
    Settings,
    Shield,
    Activity,
    Search,
    GitBranch,
    Terminal,
    LayoutTemplate,
    Figma,
} from 'lucide-react';

interface CommandItem {
    label: string;
    path: string;
    icon: React.ElementType;
    category: string;
    keywords?: string[];
}

const commandItems: CommandItem[] = [
    // Foundation
    { label: 'Colors', path: '/design-system-generator/foundation/colors', icon: Palette, category: 'Foundation', keywords: ['palette', 'theme', 'color'] },
    { label: 'Typography', path: '/design-system-generator/foundation/typography', icon: Type, category: 'Foundation', keywords: ['fonts', 'text', 'type'] },
    { label: 'Spacing & Grids', path: '/design-system-generator/foundation/spacing', icon: Grid3x3, category: 'Foundation', keywords: ['layout', 'margin', 'padding'] },
    { label: 'Shadows', path: '/design-system-generator/foundation/shadows', icon: Box, category: 'Foundation', keywords: ['elevation', 'depth'] },
    { label: 'Motion', path: '/design-system-generator/foundation/motion', icon: Sparkles, category: 'Foundation', keywords: ['animation', 'transition', 'easing'] },

    // Components
    { label: 'Button Component', path: '/design-system-generator/components/button', icon: ComponentIcon, category: 'Components', keywords: ['cta', 'action'] },
    { label: 'Input Component', path: '/design-system-generator/components/input', icon: ComponentIcon, category: 'Components', keywords: ['form', 'field'] },
    { label: 'Card Component', path: '/design-system-generator/components/card', icon: ComponentIcon, category: 'Components', keywords: ['container'] },
    { label: 'Modal Component', path: '/design-system-generator/components/modal', icon: ComponentIcon, category: 'Components', keywords: ['dialog', 'popup'] },
    { label: 'State Machine', path: '/design-system-generator/components/state-machine', icon: Sparkles, category: 'Components', keywords: ['logic', 'xstate', 'flow', 'diagram'] },
    { label: 'Pattern Library', path: '/design-system-generator/components/patterns', icon: LayoutTemplate, category: 'Components', keywords: ['templates', 'layouts', 'forms'] },

    // Tokens
    { label: 'Token Manager', path: '/design-system-generator/tokens/manager', icon: FileCode, category: 'Tokens', keywords: ['variables', 'design tokens'] },
    { label: 'Export Tokens', path: '/design-system-generator/tokens/export', icon: FileCode, category: 'Tokens', keywords: ['download', 'generate'] },

    // Documentation
    { label: 'Documentation Preview', path: '/design-system-generator/documentation/preview', icon: BookOpen, category: 'Documentation', keywords: ['docs', 'guide'] },
    { label: 'API Reference', path: '/design-system-generator/documentation/api', icon: FileCode, category: 'Documentation', keywords: ['props', 'typescript', 'types'] },
    { label: 'Guidelines Editor', path: '/design-system-generator/documentation/guidelines', icon: BookOpen, category: 'Documentation', keywords: ['principles', 'rules', 'markdown', 'write'] },

    // Developer
    { label: 'Export Project', path: '/design-system-generator/developer/export', icon: Settings, category: 'Developer', keywords: ['export', 'download', 'scaffold', 'template'] },
    { label: 'GitHub Integration', path: '/design-system-generator/developer/github', icon: GitBranch, category: 'Developer', keywords: ['git', 'pr', 'sync', 'repo'] },
    { label: 'Figma Sync', path: '/design-system-generator/developer/figma', icon: Figma, category: 'Developer', keywords: ['figma', 'design', 'tokens', 'import'] },
    { label: 'CLI Configuration', path: '/design-system-generator/developer/cli', icon: Terminal, category: 'Developer', keywords: ['command line', 'terminal', 'config'] },
    { label: 'Regression Testing', path: '/design-system-generator/developer/testing', icon: Settings, category: 'Developer', keywords: ['visual', 'snapshot'] },

    // Governance
    { label: 'Team Management', path: '/design-system-generator/governance/team', icon: Shield, category: 'Governance', keywords: ['users', 'permissions'] },
    { label: 'Changelog', path: '/design-system-generator/governance/changelog', icon: Shield, category: 'Governance', keywords: ['history', 'versions'] },

    // Quality
    { label: 'Health Dashboard', path: '/design-system-generator/quality/health', icon: Activity, category: 'Quality', keywords: ['metrics', 'analytics'] },
    { label: 'Accessibility Checker', path: '/design-system-generator/quality/accessibility', icon: Activity, category: 'Quality', keywords: ['a11y', 'wcag', 'contrast'] },
    { label: 'Icon & Asset Library', path: '/design-system-generator/quality/assets', icon: Box, category: 'Quality', keywords: ['icons', 'images', 'assets', 'svg'] },
    { label: 'Multi-Brand Manager', path: '/design-system-generator/governance/brands', icon: Palette, category: 'Governance', keywords: ['brands', 'themes', 'dark mode'] },
];

export const CommandPalette = () => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const openHandler = () => setOpen(true);
        window.addEventListener('open-command-palette', openHandler);
        document.addEventListener('keydown', down);
        return () => {
            document.removeEventListener('keydown', down);
            window.removeEventListener('open-command-palette', openHandler);
        };
    }, []);

    const handleSelect = (path: string) => {
        setOpen(false);
        navigate(path);
    };

    // Group items by category
    const groupedItems = commandItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search design system..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {Object.entries(groupedItems).map(([category, items], index) => (
                    <React.Fragment key={category}>
                        {index > 0 && <CommandSeparator />}
                        <CommandGroup heading={category}>
                            {items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <CommandItem
                                        key={item.path}
                                        value={`${item.label} ${item.keywords?.join(' ') || ''}`}
                                        onSelect={() => handleSelect(item.path)}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        <span>{item.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </React.Fragment>
                ))}
            </CommandList>
        </CommandDialog>
    );
};

// Trigger button component
export const CommandPaletteTrigger = () => {
    return (
        <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
        >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
            </kbd>
        </button>
    );
};
