import React, { useMemo } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Activity,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle2,
    Package,
    Palette,
    Type,
    Box,
    Zap,
    Users,
    Calendar,
    FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const HealthDashboard = () => {
    const { tokens, typography, components } = useDesignSystemStore();

    // Calculate health metrics
    const metrics = useMemo(() => {
        const colorCount = Object.keys(tokens.colors).length;
        const typographyCount = Object.keys(typography.fontFamilies).length + Object.keys(typography.fontSizes).length;
        const spacingCount = tokens.spacing ? Object.keys(tokens.spacing).length : 0;
        const componentCount = components ? Object.keys(components).length : 4; // Mock: Button, Input, Card, Modal

        const totalTokens = colorCount + typographyCount + spacingCount;
        const tokenCoverage = Math.min((totalTokens / 50) * 100, 100); // Target: 50 tokens
        const componentCoverage = Math.min((componentCount / 20) * 100, 100); // Target: 20 components
        const documentationCoverage = Math.random() * 40 + 60; // Mock: 60-100%
        const accessibilityScore = Math.random() * 20 + 75; // Mock: 75-95%

        const overallHealth = Math.round(
            (tokenCoverage + componentCoverage + documentationCoverage + accessibilityScore) / 4
        );

        return {
            overallHealth,
            tokenCoverage: Math.round(tokenCoverage),
            componentCoverage: Math.round(componentCoverage),
            documentationCoverage: Math.round(documentationCoverage),
            accessibilityScore: Math.round(accessibilityScore),
            totalTokens,
            componentCount,
            lastUpdated: new Date().toLocaleDateString(),
        };
    }, [tokens, typography, components]);

    const healthStatus =
        metrics.overallHealth >= 80 ? 'excellent' :
            metrics.overallHealth >= 60 ? 'good' :
                metrics.overallHealth >= 40 ? 'fair' : 'poor';

    const healthColor =
        healthStatus === 'excellent' ? 'text-green-500' :
            healthStatus === 'good' ? 'text-blue-500' :
                healthStatus === 'fair' ? 'text-yellow-500' : 'text-red-500';

    const recommendations = [
        {
            id: 1,
            priority: 'high',
            title: 'Add more spacing tokens',
            description: 'Current spacing scale is limited. Consider adding more granular spacing options.',
            impact: 'Improves consistency across layouts',
        },
        {
            id: 2,
            priority: 'medium',
            title: 'Document component usage',
            description: 'Several components lack usage examples and guidelines.',
            impact: 'Helps developers use components correctly',
        },
        {
            id: 3,
            priority: 'medium',
            title: 'Improve color contrast',
            description: 'Some color combinations may not meet WCAG AA standards.',
            impact: 'Ensures accessibility compliance',
        },
        {
            id: 4,
            priority: 'low',
            title: 'Add more component variants',
            description: 'Consider adding more variants to existing components for flexibility.',
            impact: 'Increases design flexibility',
        },
    ];

    const recentActivity = [
        { id: 1, type: 'token', action: 'Added primary color', time: '2 hours ago' },
        { id: 2, type: 'component', action: 'Updated Button component', time: '5 hours ago' },
        { id: 3, type: 'documentation', action: 'Added typography guidelines', time: '1 day ago' },
        { id: 4, type: 'token', action: 'Modified spacing scale', time: '2 days ago' },
        { id: 5, type: 'component', action: 'Created Modal component', time: '3 days ago' },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">System Health</h1>
                            <p className="text-xs text-muted-foreground">
                                Monitor the quality and completeness of your design system
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Last updated</p>
                            <p className="text-sm font-bold">{metrics.lastUpdated}</p>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Export Report
                        </Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 max-w-7xl space-y-8">
                    {/* Overall Health Score */}
                    <div className="p-8 border rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black mb-1">Overall Health Score</h2>
                                <p className="text-sm text-muted-foreground">
                                    Based on token coverage, components, documentation, and accessibility
                                </p>
                            </div>
                            <Badge className={`${healthColor} text-lg px-4 py-2`}>
                                {healthStatus.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="flex items-end gap-4 mb-4">
                            <div className={`text-7xl font-black ${healthColor}`}>
                                {metrics.overallHealth}
                            </div>
                            <div className="text-3xl font-black text-muted-foreground mb-2">/100</div>
                            <div className="flex items-center gap-2 mb-3 ml-4">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-bold text-green-500">+5% from last week</span>
                            </div>
                        </div>

                        <Progress value={metrics.overallHealth} className="h-3" />
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-6 border rounded-xl bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-pink-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Token Coverage
                                    </p>
                                    <p className="text-2xl font-black">{metrics.tokenCoverage}%</p>
                                </div>
                            </div>
                            <Progress value={metrics.tokenCoverage} className="h-2 mb-2" />
                            <p className="text-xs text-muted-foreground">
                                {metrics.totalTokens} tokens defined
                            </p>
                        </div>

                        <div className="p-6 border rounded-xl bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Components
                                    </p>
                                    <p className="text-2xl font-black">{metrics.componentCoverage}%</p>
                                </div>
                            </div>
                            <Progress value={metrics.componentCoverage} className="h-2 mb-2" />
                            <p className="text-xs text-muted-foreground">
                                {metrics.componentCount} components built
                            </p>
                        </div>

                        <div className="p-6 border rounded-xl bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Documentation
                                    </p>
                                    <p className="text-2xl font-black">{metrics.documentationCoverage}%</p>
                                </div>
                            </div>
                            <Progress value={metrics.documentationCoverage} className="h-2 mb-2" />
                            <p className="text-xs text-muted-foreground">
                                Well documented
                            </p>
                        </div>

                        <div className="p-6 border rounded-xl bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Accessibility
                                    </p>
                                    <p className="text-2xl font-black">{metrics.accessibilityScore}%</p>
                                </div>
                            </div>
                            <Progress value={metrics.accessibilityScore} className="h-2 mb-2" />
                            <p className="text-xs text-muted-foreground">
                                WCAG AA compliant
                            </p>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Recommendations */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-black">Recommendations</h3>
                            <div className="space-y-3">
                                {recommendations.map((rec) => (
                                    <div key={rec.id} className="p-4 border rounded-xl hover:border-primary/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {rec.priority === 'high' && (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                {rec.priority === 'medium' && (
                                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                                )}
                                                {rec.priority === 'low' && (
                                                    <AlertCircle className="w-5 h-5 text-blue-500" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-sm">{rec.title}</h4>
                                                    <Badge
                                                        variant={
                                                            rec.priority === 'high' ? 'destructive' :
                                                                rec.priority === 'medium' ? 'default' : 'secondary'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {rec.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {rec.description}
                                                </p>
                                                <p className="text-xs text-primary font-bold">
                                                    💡 {rec.impact}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-black">Recent Activity</h3>
                            <div className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-4 border rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0">
                                                {activity.type === 'token' && (
                                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                                        <Palette className="w-4 h-4 text-pink-500" />
                                                    </div>
                                                )}
                                                {activity.type === 'component' && (
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                )}
                                                {activity.type === 'documentation' && (
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-purple-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold">{activity.action}</p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* System Stats */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black">System Statistics</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-6 border rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <Type className="w-5 h-5 text-muted-foreground" />
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                </div>
                                <p className="text-3xl font-black mb-1">
                                    {Object.keys(typography.fontSizes).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Font sizes defined</p>
                            </div>

                            <div className="p-6 border rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <Palette className="w-5 h-5 text-muted-foreground" />
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                </div>
                                <p className="text-3xl font-black mb-1">
                                    {Object.keys(tokens.colors).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Color tokens</p>
                            </div>

                            <div className="p-6 border rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                </div>
                                <p className="text-3xl font-black mb-1">
                                    {Math.floor(Math.random() * 10) + 5}
                                </p>
                                <p className="text-sm text-muted-foreground">Team members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default HealthDashboard;
