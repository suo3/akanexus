import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Navigation/Sidebar';
import { CommandPalette, CommandPaletteTrigger } from '../components/Navigation/CommandPalette';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDesignSystemStore } from '../store/useDesignSystemStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GuidedTour } from '../components/GuidedTour';
import { SettingsModal } from '../components/Settings/SettingsModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const MainLayout = () => {
    const { theme, setTheme } = useTheme();
    const { toggleSidebar } = useDesignSystemStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Ctrl+/ (or Cmd+/) → toggle sidebar
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
                const target = e.target as HTMLElement;
                const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
                if (!isInput) {
                    e.preventDefault();
                    toggleSidebar();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">
            <CommandPalette />
            <GuidedTour />
            <SettingsModal />

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:h-full">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Toolbar */}
                <header className="h-16 border-b bg-muted/30 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-20 shrink-0" data-tour="toolbar-actions">
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none border border-border/50">
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-72 border-r bg-background">
                                    <Sidebar onNavItemClick={() => setIsMobileMenuOpen(false)} />
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div data-tour="command-palette">
                            <CommandPaletteTrigger />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Theme Toggle */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-none border-border"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>

                        {/* Export Button */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="gap-2 font-bold rounded-none mono-label uppercase text-[10px] md:text-xs px-2 md:px-4"
                                        onClick={() => navigate('/design-system-generator/developer/export')}
                                    >
                                        <Download className="w-3.5 h-3.5 md:w-4 h-4" />
                                        <span className="hidden xs:inline">Export</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Export design system as a React project</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
