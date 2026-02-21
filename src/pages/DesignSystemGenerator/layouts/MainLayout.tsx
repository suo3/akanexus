import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Navigation/Sidebar';
import { CommandPalette, CommandPaletteTrigger } from '../components/Navigation/CommandPalette';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDesignSystemStore } from '../store/useDesignSystemStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GuidedTour } from '../components/GuidedTour';
import { SettingsModal } from '../components/Settings/SettingsModal';

export const MainLayout = () => {
    const { theme, setTheme } = useTheme();
    const { toggleSidebar } = useDesignSystemStore();
    const navigate = useNavigate();

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
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <CommandPalette />
            <GuidedTour />
            <SettingsModal />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Toolbar */}
                <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-6 z-10 shadow-sm" data-tour="toolbar-actions">
                    <div className="flex items-center gap-4" data-tour="command-palette">
                        <CommandPaletteTrigger />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full"
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
                                        className="gap-2 font-bold rounded-xl"
                                        onClick={() => navigate('/design-system-generator/developer/export')}
                                    >
                                        <Download className="w-4 h-4" />
                                        Export
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
