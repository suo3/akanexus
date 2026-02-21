import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
    Keyboard,
    Monitor,
    Moon,
    Sun,
    Laptop,
    Command,
    Globe,
    Info
} from 'lucide-react';
import { useTheme } from 'next-themes';

const STORAGE_KEY_REDUCE_MOTION = 'akanexus-reduce-motion';
const STORAGE_KEY_AUTO_SAVE = 'akanexus-auto-save';

const applyReduceMotion = (enabled: boolean) => {
    if (enabled) {
        document.documentElement.classList.add('reduce-motion');
    } else {
        document.documentElement.classList.remove('reduce-motion');
    }
};

export const SettingsModal = () => {
    const [open, setOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    // Persisted settings state
    const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_REDUCE_MOTION);
        return stored === 'true';
    });
    const [autoSave, setAutoSave] = useState<boolean>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_AUTO_SAVE);
        return stored === null ? true : stored === 'true'; // defaults to true
    });

    // Apply reduce-motion class on mount
    useEffect(() => {
        applyReduceMotion(reduceMotion);
    }, []);

    // Keyboard shortcuts & event listeners
    useEffect(() => {
        const handleOpen = () => setOpen(true);
        window.addEventListener('open-settings', handleOpen);

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey && !isInput) {
                e.preventDefault();
                setOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('open-settings', handleOpen);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleReduceMotionChange = (checked: boolean) => {
        setReduceMotion(checked);
        localStorage.setItem(STORAGE_KEY_REDUCE_MOTION, String(checked));
        applyReduceMotion(checked);
    };

    const handleAutoSaveChange = (checked: boolean) => {
        setAutoSave(checked);
        localStorage.setItem(STORAGE_KEY_AUTO_SAVE, String(checked));
    };

    const shortcuts = [
        { key: 'Ctrl + K', description: 'Open Command Palette' },
        { key: '?', description: 'Open Settings / Shortcuts' },
        { key: 'Ctrl + /', description: 'Toggle Sidebar' },
        { key: 'Esc', description: 'Close Modals' },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">Settings</DialogTitle>
                    <DialogDescription>
                        Manage your preferences and view keyboard shortcuts.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="general" className="gap-2">
                            <Monitor className="w-4 h-4" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="shortcuts" className="gap-2">
                            <Keyboard className="w-4 h-4" />
                            Shortcuts
                        </TabsTrigger>
                        <TabsTrigger value="about" className="gap-2">
                            <Info className="w-4 h-4" />
                            About
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Appearance</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                                        }`}
                                >
                                    <Sun className="w-6 h-6" />
                                    <span className="text-sm font-bold">Light</span>
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                                        }`}
                                >
                                    <Moon className="w-6 h-6" />
                                    <span className="text-sm font-bold">Dark</span>
                                </button>
                                <button
                                    onClick={() => setTheme('system')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                                        }`}
                                >
                                    <Laptop className="w-6 h-6" />
                                    <span className="text-sm font-bold">System</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base" htmlFor="reduce-motion-switch">Reduce Motion</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Minimize animations throughout the application
                                        </p>
                                    </div>
                                    <Switch
                                        id="reduce-motion-switch"
                                        checked={reduceMotion}
                                        onCheckedChange={handleReduceMotionChange}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base" htmlFor="auto-save-switch">Auto-Save</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Automatically save changes to local storage
                                        </p>
                                    </div>
                                    <Switch
                                        id="auto-save-switch"
                                        checked={autoSave}
                                        onCheckedChange={handleAutoSaveChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="shortcuts">
                        <div className="grid grid-cols-2 gap-4">
                            {shortcuts.map((shortcut) => (
                                <div
                                    key={shortcut.key}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                                >
                                    <span className="text-sm font-medium">{shortcut.description}</span>
                                    <div className="flex gap-1">
                                        {shortcut.key.split(' + ').map((k, i, arr) => (
                                            <React.Fragment key={i}>
                                                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono font-bold text-muted-foreground min-w-[20px] text-center">
                                                    {k}
                                                </kbd>
                                                {i < arr.length - 1 && (
                                                    <span className="text-xs text-muted-foreground self-center">+</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="about" className="space-y-4">
                        <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                                <Command className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black mb-1">Akanexus Studio</h2>
                            <p className="text-sm text-muted-foreground mb-4">Design System Generator v2.1.0</p>
                            <p className="text-sm leading-relaxed max-w-sm mx-auto mb-6">
                                A professional-grade platform for building, managing, and exporting enterprise design systems.
                            </p>
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => window.open('https://akanexus.com', '_blank')}
                                >
                                    <Globe className="w-4 h-4" />
                                    Website
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => window.open('https://github.com/akanexus', '_blank')}
                                >
                                    GitHub
                                </Button>
                            </div>
                        </div>

                        <div className="text-xs text-center text-muted-foreground">
                            &copy; 2024 Akanexus. All rights reserved.
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
