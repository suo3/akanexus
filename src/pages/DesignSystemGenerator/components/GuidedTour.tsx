import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Map,
    Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface TourStep {
    target: string; // CSS selector or ID
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const defaultSteps: TourStep[] = [
    {
        target: 'body',
        title: 'Welcome to Akanexus Studio',
        content: 'This professional design system generator helps you create, manage, and export comprehensive design systems. Let\'s take a quick tour!',
        position: 'center',
    },
    {
        target: '[data-tour="sidebar"]',
        title: 'Navigation Sidebar',
        content: 'Navigate through different modules like Foundations, Components, Tokens, and Governance settings here.',
        position: 'right',
    },
    {
        target: '[data-tour="command-palette"]',
        title: 'Command Palette',
        content: 'Press Ctrl+K or click here to quickly search for any component, token, or setting in the system.',
        position: 'bottom',
    },
    {
        target: '[data-tour="toolbar-actions"]',
        title: 'Global Actions',
        content: 'Quickly access undo/redo history, switch themes (dark/light), and export your project from here.',
        position: 'bottom',
    },
    {
        target: 'body',
        title: 'You\'re All Set!',
        content: 'You can restart this tour anytime from the Help menu. Start building your design system now!',
        position: 'center',
    },
];

export const GuidedTour = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Check if tour has been seen
        const hasSeenTour = localStorage.getItem('akanexus-tour-seen');
        if (!hasSeenTour) {
            setTimeout(() => setIsOpen(true), 1000);
        }

        // Listen for manual tour start
        const startHandler = () => {
            setIsOpen(true);
            setCurrentStep(0);
        };
        window.addEventListener('start-tour', startHandler);
        return () => {
            window.removeEventListener('start-tour', startHandler);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const step = defaultSteps[currentStep];
    const isCenter = step.position === 'center' || isMobile;

    useEffect(() => {
        if (!isOpen) return;

        const step = defaultSteps[currentStep];

        if (step.position === 'center') {
            setPosition({
                top: window.innerHeight / 2,
                left: window.innerWidth / 2,
                width: 0,
                height: 0
            });
            return;
        }

        const element = document.querySelector(step.target);

        if (element && !isCenter) {
            const rect = element.getBoundingClientRect();
            setPosition({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
        } else {
            // If element not found or center position, default to center
            setPosition({
                top: window.innerHeight / 2,
                left: window.innerWidth / 2,
                width: 0,
                height: 0
            });
        }
    }, [currentStep, isOpen]);

    const handleNext = () => {
        if (currentStep < defaultSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Hydration safe localStorage access
        if (typeof window !== 'undefined') {
            localStorage.setItem('akanexus-tour-seen', 'true');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-[2px]"
            />

            {/* Spotlight */}
            {!isCenter && (
                <motion.div
                    initial={false}
                    animate={{
                        top: position.top - 4,
                        left: position.left - 4,
                        width: position.width + 8,
                        height: position.height + 8,
                    }}
                    transition={{ type: "spring", damping: 30, stiffness: 250 }}
                    className="absolute border-2 border-primary rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-0"
                />
            )}

            {/* Popover */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute pointer-events-auto bg-card text-card-foreground border rounded-2xl shadow-2xl w-[calc(100%-2rem)] md:w-[420px] overflow-hidden"
                style={{
                    top: isCenter
                        ? '50%'
                        : step.position === 'bottom'
                            ? position.top + position.height + 20
                            : step.position === 'top'
                                ? position.top - 240
                                : position.top,
                    left: isCenter
                        ? '50%'
                        : step.position === 'right'
                            ? position.left + position.width + 20
                            : step.position === 'left'
                                ? position.left - 440
                                : position.left,
                    transform: isCenter ? 'translate(-50%, -50%)' : 'none',
                    margin: 0,
                }}
            >
                {/* Header */}
                <div className="relative h-24 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-background/50 backdrop-blur border border-white/20 shadow-sm">
                        <Map className="w-6 h-6 text-primary" />
                    </div>
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 p-2 hover:bg-black/10 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                            Step {currentStep + 1} of {defaultSteps.length}
                        </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {step.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {defaultSteps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentStep ? 'bg-primary w-6' : 'bg-muted'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                className="gap-2"
                                onClick={handleNext}
                            >
                                {currentStep === defaultSteps.length - 1 ? 'Finish' : 'Next'}
                                <ChevronRight className="w-4 h-4 px-0" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
