import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Navigation/Sidebar';
import { CommandPalette, CommandPaletteTrigger } from '../components/Navigation/CommandPalette';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download, Undo2, Redo2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDesignSystemStore } from '../store/useDesignSystemStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GuidedTour } from '../components/GuidedTour';
import { SettingsModal } from '../components/Settings/SettingsModal';

export const MainLayout = () => {
    const { theme, setTheme } = useTheme();
    const { canUndo, canRedo, undo, redo } = useDesignSystemStore();

    // Set up keyboard shortcuts for undo/redo
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input or textarea
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            // Ctrl+Z or Cmd+Z for undo
            if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
                e.preventDefault();
                if (canUndo) {
                    undo();
                }
            }

            // Ctrl+Y or Cmd+Shift+Z for redo
            if (
                (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
                (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
            ) {
                e.preventDefault();
                if (canRedo) {
                    redo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, undo, redo]);

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
                        {/* History Controls */}
                        <TooltipProvider>
                            <div className="flex items-center gap-1.5 mr-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl"
                                            onClick={undo}
                                            disabled={!canUndo}
                                        >
                                            <Undo2 className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl"
                                            onClick={redo}
                                            disabled={!canRedo}
                                        >
                                            <Redo2 className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>

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
                        <Button className="gap-2 font-bold rounded-xl">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
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
