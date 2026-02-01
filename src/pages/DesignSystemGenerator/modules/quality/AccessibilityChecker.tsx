import React, { useState, useMemo } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Eye,
    Type,
    Palette,
    Contrast,
    MousePointer,
    Keyboard
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AccessibilityIssue {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    category: string;
    title: string;
    description: string;
    wcagLevel: 'A' | 'AA' | 'AAA';
    wcagCriterion: string;
    affectedElements?: string[];
    recommendation: string;
}

const AccessibilityChecker = () => {
    const { tokens, typography } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Calculate contrast ratio
    const getContrastRatio = (color1: string, color2: string): number => {
        // Simplified contrast calculation (mock for demo)
        return Math.random() * 15 + 3; // Returns value between 3 and 18
    };

    // Generate accessibility issues
    const issues: AccessibilityIssue[] = useMemo(() => {
        const issueList: AccessibilityIssue[] = [];

        // Check color contrast
        const primaryBg = tokens.colors.primary;
        const textOnPrimary = tokens.colors.background;
        const contrastRatio = getContrastRatio(primaryBg, textOnPrimary);

        if (contrastRatio < 4.5) {
            issueList.push({
                id: 'contrast-primary',
                severity: 'critical',
                category: 'Color Contrast',
                title: 'Insufficient contrast on primary buttons',
                description: `Contrast ratio of ${contrastRatio.toFixed(2)}:1 does not meet WCAG AA standards (4.5:1 minimum)`,
                wcagLevel: 'AA',
                wcagCriterion: '1.4.3 Contrast (Minimum)',
                affectedElements: ['Button (Primary)', 'Links'],
                recommendation: 'Increase contrast between text and background colors to at least 4.5:1',
            });
        }

        // Check font sizes
        const baseFontSize = parseFloat(typography.fontSizes.base || '16px');
        if (baseFontSize < 16) {
            issueList.push({
                id: 'font-size-small',
                severity: 'warning',
                category: 'Typography',
                title: 'Base font size below recommended minimum',
                description: `Base font size is ${baseFontSize}px, which may be difficult to read`,
                wcagLevel: 'AA',
                wcagCriterion: '1.4.4 Resize Text',
                recommendation: 'Use a minimum base font size of 16px for body text',
            });
        }

        // Check touch target sizes (mock)
        issueList.push({
            id: 'touch-target',
            severity: 'warning',
            category: 'Interactive Elements',
            title: 'Small touch targets detected',
            description: 'Some interactive elements may be too small for comfortable touch interaction',
            wcagLevel: 'AAA',
            wcagCriterion: '2.5.5 Target Size',
            affectedElements: ['Button (Small)', 'Icon Buttons'],
            recommendation: 'Ensure touch targets are at least 44x44 pixels',
        });

        // Check focus indicators
        issueList.push({
            id: 'focus-indicator',
            severity: 'info',
            category: 'Keyboard Navigation',
            title: 'Focus indicators could be more prominent',
            description: 'Current focus styles may not be visible enough for keyboard users',
            wcagLevel: 'AA',
            wcagCriterion: '2.4.7 Focus Visible',
            recommendation: 'Add a high-contrast focus ring with at least 2px width',
        });

        // Add more mock issues
        issueList.push({
            id: 'color-only',
            severity: 'warning',
            category: 'Color Usage',
            title: 'Information conveyed by color alone',
            description: 'Some UI states rely solely on color to convey meaning',
            wcagLevel: 'A',
            wcagCriterion: '1.4.1 Use of Color',
            affectedElements: ['Form validation', 'Status indicators'],
            recommendation: 'Use icons, text labels, or patterns in addition to color',
        });

        return issueList;
    }, [tokens, typography]);

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    const categories = [
        { id: 'color-contrast', name: 'Color Contrast', icon: Contrast },
        { id: 'typography', name: 'Typography', icon: Type },
        { id: 'interactive', name: 'Interactive Elements', icon: MousePointer },
        { id: 'keyboard', name: 'Keyboard Navigation', icon: Keyboard },
        { id: 'color-usage', name: 'Color Usage', icon: Palette },
    ];

    const filteredIssues = selectedCategory
        ? issues.filter(i => i.category.toLowerCase().includes(selectedCategory.toLowerCase()))
        : issues;

    const complianceScore = Math.round(((issues.length - criticalCount - warningCount) / issues.length) * 100);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-7xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Accessibility Checker</h1>
                                <p className="text-xs text-muted-foreground">
                                    WCAG 2.1 compliance validation
                                </p>
                            </div>
                        </div>

                        <Button className="gap-2">
                            <Eye className="w-4 h-4" />
                            Run Full Audit
                        </Button>
                    </div>

                    {/* Score Overview */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 bg-background rounded-xl border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Compliance Score
                                </span>
                                <Shield className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-3xl font-black mb-2">{complianceScore}%</div>
                            <Progress value={complianceScore} className="h-1.5" />
                        </div>

                        <div className="p-4 bg-background rounded-xl border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Critical Issues
                                </span>
                                <XCircle className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="text-3xl font-black text-red-500">{criticalCount}</div>
                            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                        </div>

                        <div className="p-4 bg-background rounded-xl border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Warnings
                                </span>
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            </div>
                            <div className="text-3xl font-black text-yellow-500">{warningCount}</div>
                            <p className="text-xs text-muted-foreground">Should be addressed</p>
                        </div>

                        <div className="p-4 bg-background rounded-xl border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Passed Checks
                                </span>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-black text-green-500">{infoCount}</div>
                            <p className="text-xs text-muted-foreground">Meeting standards</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Categories
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                    }`}
                            >
                                All Issues ({issues.length})
                            </button>

                            <Separator className="my-2" />

                            {categories.map((category) => {
                                const Icon = category.icon;
                                const count = issues.filter(i =>
                                    i.category.toLowerCase().includes(category.id.replace('-', ' '))
                                ).length;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.name
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-bold">{category.name}</span>
                                        </div>
                                        {count > 0 && <Badge variant="secondary">{count}</Badge>}
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <div className="border-b px-6 py-3 bg-card/30">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="issues">Issues ({filteredIssues.length})</TabsTrigger>
                                <TabsTrigger value="wcag">WCAG Guidelines</TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-6">
                                <TabsContent value="overview" className="space-y-6 mt-0">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">WCAG Compliance Levels</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 border rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge>Level A</Badge>
                                                    <span className="text-xs text-muted-foreground">Essential</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Basic accessibility features that must be present
                                                </p>
                                            </div>
                                            <div className="p-4 border rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge>Level AA</Badge>
                                                    <span className="text-xs text-muted-foreground">Recommended</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Addresses major barriers for most users
                                                </p>
                                            </div>
                                            <div className="p-4 border rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge>Level AAA</Badge>
                                                    <span className="text-xs text-muted-foreground">Enhanced</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Highest level of accessibility
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Quick Wins</h3>
                                        <div className="space-y-2">
                                            {issues.slice(0, 3).map((issue) => (
                                                <div key={issue.id} className="p-4 border rounded-lg">
                                                    <div className="flex items-start gap-3">
                                                        {issue.severity === 'critical' && (
                                                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                        )}
                                                        {issue.severity === 'warning' && (
                                                            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                        )}
                                                        {issue.severity === 'info' && (
                                                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                        )}
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-sm mb-1">{issue.title}</h4>
                                                            <p className="text-xs text-muted-foreground mb-2">
                                                                {issue.recommendation}
                                                            </p>
                                                            <Badge variant="outline" className="text-xs">
                                                                {issue.wcagCriterion}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="issues" className="space-y-4 mt-0">
                                    {filteredIssues.length === 0 ? (
                                        <div className="text-center py-12">
                                            <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                            <p className="font-bold mb-2">No issues found!</p>
                                            <p className="text-sm text-muted-foreground">
                                                Your design system meets all accessibility standards
                                            </p>
                                        </div>
                                    ) : (
                                        filteredIssues.map((issue) => (
                                            <div key={issue.id} className="p-6 border rounded-xl">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        {issue.severity === 'critical' && (
                                                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                                                <XCircle className="w-6 h-6 text-red-500" />
                                                            </div>
                                                        )}
                                                        {issue.severity === 'warning' && (
                                                            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                                                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                                                            </div>
                                                        )}
                                                        {issue.severity === 'info' && (
                                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                                <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-4 mb-3">
                                                            <div>
                                                                <h3 className="font-black text-lg mb-1">{issue.title}</h3>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Badge variant="outline">{issue.category}</Badge>
                                                                    <Badge>WCAG {issue.wcagLevel}</Badge>
                                                                    <Badge
                                                                        variant={
                                                                            issue.severity === 'critical'
                                                                                ? 'destructive'
                                                                                : issue.severity === 'warning'
                                                                                    ? 'default'
                                                                                    : 'secondary'
                                                                        }
                                                                    >
                                                                        {issue.severity}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm mb-4">{issue.description}</p>

                                                        {issue.affectedElements && issue.affectedElements.length > 0 && (
                                                            <div className="mb-4">
                                                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                                                    Affected Elements
                                                                </Label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {issue.affectedElements.map((element) => (
                                                                        <Badge key={element} variant="secondary">
                                                                            {element}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="p-4 bg-muted rounded-lg">
                                                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                                                Recommendation
                                                            </Label>
                                                            <p className="text-sm">{issue.recommendation}</p>
                                                        </div>

                                                        <div className="mt-4 flex items-center gap-2">
                                                            <Button size="sm">Fix Issue</Button>
                                                            <Button size="sm" variant="outline">
                                                                Learn More
                                                            </Button>
                                                            <Button size="sm" variant="ghost">
                                                                Ignore
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </TabsContent>

                                <TabsContent value="wcag" className="space-y-6 mt-0">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">WCAG 2.1 Guidelines</h3>

                                        <div className="space-y-4">
                                            {[
                                                {
                                                    principle: 'Perceivable',
                                                    description: 'Information and user interface components must be presentable to users in ways they can perceive',
                                                    guidelines: ['Text Alternatives', 'Time-based Media', 'Adaptable', 'Distinguishable'],
                                                },
                                                {
                                                    principle: 'Operable',
                                                    description: 'User interface components and navigation must be operable',
                                                    guidelines: ['Keyboard Accessible', 'Enough Time', 'Seizures and Physical Reactions', 'Navigable'],
                                                },
                                                {
                                                    principle: 'Understandable',
                                                    description: 'Information and the operation of user interface must be understandable',
                                                    guidelines: ['Readable', 'Predictable', 'Input Assistance'],
                                                },
                                                {
                                                    principle: 'Robust',
                                                    description: 'Content must be robust enough that it can be interpreted by a wide variety of user agents',
                                                    guidelines: ['Compatible'],
                                                },
                                            ].map((item) => (
                                                <div key={item.principle} className="p-6 border rounded-xl">
                                                    <h4 className="font-black text-lg mb-2">{item.principle}</h4>
                                                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.guidelines.map((guideline) => (
                                                            <Badge key={guideline} variant="outline">
                                                                {guideline}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </ScrollArea>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityChecker;
