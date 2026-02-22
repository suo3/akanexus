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
        title: 'General',
        icon: Activity,
        items: [
            { label: 'Back to Home', path: '/', icon: Activity },
            { label: 'Dashboard', path: '/design-system-generator', icon: Grid3x3 },
        ],
    },
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
            { label: 'Badge', path: '/design-system-generator/components/badge' },
            { label: 'Avatar', path: '/design-system-generator/components/avatar' },
            { label: 'Alert', path: '/design-system-generator/components/alert' },
            { label: 'Toast', path: '/design-system-generator/components/toast' },
            { label: 'Spinner & Progress', path: '/design-system-generator/components/spinner' },
            { label: 'Tabs', path: '/design-system-generator/components/tabs' },
            { label: 'Breadcrumb', path: '/design-system-generator/components/breadcrumb' },
            { label: 'Table', path: '/design-system-generator/components/table' },
            { label: 'Select', path: '/design-system-generator/components/select' },
            { label: 'List', path: '/design-system-generator/components/list' },
            { label: 'Navbar', path: '/design-system-generator/components/navbar' },
            { label: 'Pagination', path: '/design-system-generator/components/pagination' },
            { label: 'Accordion', path: '/design-system-generator/components/accordion' },
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


        ],
    },


];

export const Sidebar = () => {
    const { sidebarCollapsed, toggleSidebar } = useDesignSystemStore();
    const [expandedSections, setExpandedSections] = React.useState<string[]>(['Foundation', 'Components']);
    const [searchQuery, setSearchQuery] = React.useState('');

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

    const filteredSections = navigationSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.items.length > 0);

    // If searching, keep all sections with matches expanded
    React.useEffect(() => {
        if (searchQuery) {
            const sectionsWithMatches = filteredSections.map(s => s.title);
            setExpandedSections(prev => Array.from(new Set([...prev, ...sectionsWithMatches])));
        }
    }, [searchQuery]);

    if (sidebarCollapsed) {
        return (
            <aside className="w-16 border-r bg-muted/30 backdrop-blur-xl flex flex-col items-center py-4 gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-10 w-10 rounded-none"
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
                            className="h-10 w-10 rounded-none"
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
        <aside className="w-72 border-r bg-muted/30 backdrop-blur-xl flex flex-col" data-tour="sidebar">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-none bg-primary flex items-center justify-center text-primary-foreground">
                        <Palette className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-tighter leading-none uppercase">DSG_SYSTEM</h1>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mono-label">
                            CORE_UI_v2.0
                        </span>
                    </div>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 rounded-none"
                >
                    <PanelLeftClose className="h-4 w-4" />
                </Button>
            </div>

            {/* Search */}
            {!sidebarCollapsed && (
                <div className="px-4 py-3 border-b">
                    <div className="relative">
                        <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="FIND_MODULE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-none border bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium mono-label uppercase"
                        />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                    {filteredSections.map((section) => {
                        const SectionIcon = section.icon;
                        const isExpanded = expandedSections.includes(section.title);

                        return (
                            <div key={section.title} className="space-y-1">
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-none hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <SectionIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground mono-label uppercase tracking-wider">
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
                                                        'flex items-center justify-between px-3 py-1.5 rounded-none text-xs transition-all mono-label uppercase',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary'
                                                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium'
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {ItemIcon && <ItemIcon className="h-3.5 w-3.5" />}
                                                        <span>{item.label}</span>
                                                    </div>
                                                    {item.badge && (
                                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-1 py-0.5 rounded-none border border-primary/20">
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
                    className="w-full justify-start gap-2 font-bold text-xs rounded-none mono-label uppercase"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
            </div>
        </aside>
    );
};
