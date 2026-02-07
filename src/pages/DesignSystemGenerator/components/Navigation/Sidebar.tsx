import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Palette,
    Type,
    Grid3x3,
    Box,
    Sparkles,
    Component as ComponentIcon,
    FileCode,
    BookOpen,
    Users,
    Shield,
    Activity,
    Settings,
    ChevronRight,
    ChevronDown,
    PanelLeftClose,
    PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

interface NavSection {
    title: string;
    icon: React.ElementType;
    items: NavItem[];
}

interface NavItem {
    label: string;
    path: string;
    icon?: React.ElementType;
    badge?: string;
}

const navigationSections: NavSection[] = [
    {
        title: 'Foundation',
        icon: Palette,
        items: [
            { label: 'Colors', path: '/design-system-generator/foundation/colors', icon: Palette },
            { label: 'Typography', path: '/design-system-generator/foundation/typography', icon: Type },
            { label: 'Spacing & Grids', path: '/design-system-generator/foundation/spacing', icon: Grid3x3 },
            { label: 'Shadows', path: '/design-system-generator/foundation/shadows', icon: Box },
            { label: 'Motion', path: '/design-system-generator/foundation/motion', icon: Sparkles },
        ],
    },
    {
        title: 'Components',
        icon: ComponentIcon,
        items: [
            { label: 'Button', path: '/design-system-generator/components/button' },
            { label: 'Input', path: '/design-system-generator/components/input' },
            { label: 'Card', path: '/design-system-generator/components/card' },
            { label: 'Modal', path: '/design-system-generator/components/modal' },
            { label: 'State Machine', path: '/design-system-generator/components/state-machine', badge: 'New' },
            { label: 'Patterns', path: '/design-system-generator/components/patterns' },
        ],
    },
    {
        title: 'Tokens',
        icon: FileCode,
        items: [
            { label: 'Manager', path: '/design-system-generator/tokens/manager' },
            { label: 'Export', path: '/design-system-generator/tokens/export' },
            { label: 'Frameworks', path: '/design-system-generator/tokens/frameworks', badge: 'New' },
        ],
    },
    {
        title: 'Documentation',
        icon: BookOpen,
        items: [
            { label: 'Preview', path: '/design-system-generator/documentation/preview' },
            { label: 'API Reference', path: '/design-system-generator/documentation/api', badge: 'Auto' },
            { label: 'Guidelines', path: '/design-system-generator/documentation/guidelines' },
        ],
    },
    {
        title: 'Developer',
        icon: Settings,
        items: [
            { label: 'Export Project', path: '/design-system-generator/developer/export' },
            { label: 'GitHub Sync', path: '/design-system-generator/developer/github', badge: 'Beta' },
            { label: 'Figma Connect', path: '/design-system-generator/developer/figma' },
            { label: 'CLI Config', path: '/design-system-generator/developer/cli' },
            { label: 'Regression Testing', path: '/design-system-generator/developer/testing' },
        ],
    },
    {
        title: 'Governance',
        icon: Shield,
        items: [
            { label: 'Team', path: '/design-system-generator/governance/team' },
            { label: 'Multi-Brand', path: '/design-system-generator/governance/brands' },
            { label: 'Requests', path: '/design-system-generator/governance/requests' },
            { label: 'Guidelines', path: '/design-system-generator/governance/contribution' },
            { label: 'Changelog', path: '/design-system-generator/governance/changelog' },
        ],
    },
    {
        title: 'Quality',
        icon: Activity,
        items: [
            { label: 'System Health', path: '/design-system-generator/quality/health' },
            { label: 'Accessibility', path: '/design-system-generator/quality/accessibility' },
            { label: 'Localization (RTL)', path: '/design-system-generator/quality/localization' },
            { label: 'Asset Library', path: '/design-system-generator/quality/assets' },
        ],
    },
];

export const Sidebar = () => {
    const location = useLocation();
    const { sidebarCollapsed, toggleSidebar } = useDesignSystemStore();
    const [expandedSections, setExpandedSections] = React.useState<string[]>(['Foundation']);

    // Auto-expand section based on current path
    React.useEffect(() => {
        const activeSection = navigationSections.find(section =>
            section.items.some(item => item.path === location.pathname)
        );

        if (activeSection) {
            setExpandedSections(prev => {
                if (prev.includes(activeSection.title)) return prev;
                return [...prev, activeSection.title];
            });
        }
    }, [location.pathname]);

    const toggleSection = (title: string) => {
        setExpandedSections((prev) =>
            prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
        );
    };

    if (sidebarCollapsed) {
        return (
            <aside className="w-16 border-r bg-card/50 backdrop-blur-xl flex flex-col items-center py-4 gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-10 w-10 rounded-xl"
                >
                    <PanelLeft className="h-5 w-5" />
                </Button>
                <Separator />
                {navigationSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Button
                            key={section.title}
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl"
                            title={section.title}
                        >
                            <Icon className="h-5 w-5" />
                        </Button>
                    );
                })}
            </aside>
        );
    }

    return (
        <aside className="w-72 border-r bg-card/50 backdrop-blur-xl flex flex-col" data-tour="sidebar">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 flex items-center justify-center text-primary-foreground">
                        <Palette className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-black text-base tracking-tighter leading-none">Design System</h1>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                            Professional
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 rounded-lg"
                >
                    <PanelLeftClose className="h-4 w-4" />
                </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                    {navigationSections.map((section) => {
                        const SectionIcon = section.icon;
                        const isExpanded = expandedSections.includes(section.title);

                        return (
                            <div key={section.title} className="space-y-1">
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <SectionIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">
                                            {section.title}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="ml-6 space-y-0.5 border-l border-border/50 pl-3">
                                        {section.items.map((item) => {
                                            const isActive = location.pathname === item.path;
                                            const ItemIcon = item.icon;

                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={cn(
                                                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary font-bold'
                                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium'
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {ItemIcon && <ItemIcon className="h-3.5 w-3.5" />}
                                                        <span>{item.label}</span>
                                                    </div>
                                                    {item.badge && (
                                                        <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-3 border-t">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 font-bold text-xs"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
            </div>
        </aside>
    );
};
