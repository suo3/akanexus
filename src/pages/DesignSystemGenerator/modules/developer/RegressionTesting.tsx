import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Camera,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Play,
    Clock,
    ExternalLink,
    ChevronRight,
    Eye,
    GitCommit
} from 'lucide-react';

const MOCK_RUNS = [
    { id: 'build-1024', status: 'failed', time: '2 mins ago', commit: 'feat: update primary button color', total: 42, passed: 40, failed: 2 },
    { id: 'build-1023', status: 'passed', time: '4 hours ago', commit: 'fix: input padding mobile', total: 42, passed: 42, failed: 0 },
    { id: 'build-1022', status: 'passed', time: 'Yesterday', commit: 'chore: bump dependencies', total: 42, passed: 42, failed: 0 },
];

const MOCK_DIFFS = [
    {
        id: 'diff-1',
        component: 'Button',
        variant: 'Primary',
        status: 'changed',
        baseline: 'https://via.placeholder.com/300x100/333/fff?text=Baseline',
        comparison: 'https://via.placeholder.com/300x100/333/f00?text=Changed',
        diff: 'https://via.placeholder.com/300x100/000/ff0000?text=Diff'
    },
    {
        id: 'diff-2',
        component: 'Card',
        variant: 'Shadow',
        status: 'changed',
        baseline: 'https://via.placeholder.com/300x200/333/fff?text=Baseline',
        comparison: 'https://via.placeholder.com/300x200/333/fff?text=Changed+Shadow',
        diff: 'https://via.placeholder.com/300x200/000/ff00ff?text=Diff'
    }
];

export default function RegressionTesting() {
    const [activeRun, setActiveRun] = useState(MOCK_RUNS[0]);
    const [activeDiff, setActiveDiff] = useState(MOCK_DIFFS[0]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Camera className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Visual Regression</h1>
                            <p className="text-sm text-muted-foreground">Automated UI testing & snapshot comparison</p>
                        </div>
                    </div>
                    <Button size="lg" className="gap-2 font-bold shadow-lg shadow-primary/20">
                        <Play className="w-4 h-4" />
                        Run Test Suite
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Runs Sidebar */}
                <div className="w-80 border-r bg-card/10 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="font-bold text-sm text-muted-foreground uppercase">Build History</h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="divide-y">
                            {MOCK_RUNS.map(run => (
                                <button
                                    key={run.id}
                                    onClick={() => setActiveRun(run)}
                                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors flex flex-col gap-2 ${activeRun.id === run.id ? 'bg-background border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs font-bold">{run.id}</span>
                                        <Badge
                                            variant="outline"
                                            className={run.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}
                                        >
                                            {run.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium line-clamp-1">{run.commit}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {run.time}</span>
                                        <span>{run.failed > 0 ? `${run.failed} failed` : 'All passed'}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {activeRun.status === 'failed' ? (
                        <div className="flex-1 flex flex-col">
                            <div className="p-6 border-b bg-card/30 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <AlertTriangle className="text-red-500 w-5 h-5" />
                                        {activeRun.failed} Visual Changes Detected
                                    </h2>
                                    <p className="text-sm text-muted-foreground">Review changes to approve or reject this build.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">Reject Build</Button>
                                    <Button className="bg-green-600 hover:bg-green-700">Approve All Changes</Button>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {/* Diffs List */}
                                <div className="w-64 border-r overflow-auto">
                                    {MOCK_DIFFS.map(diff => (
                                        <button
                                            key={diff.id}
                                            onClick={() => setActiveDiff(diff)}
                                            className={`w-full p-3 text-left border-b hover:bg-muted/50 transition-colors ${activeDiff.id === diff.id ? 'bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="font-bold text-sm">{diff.component}</div>
                                            <div className="text-xs text-muted-foreground">{diff.variant}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Canvas */}
                                <div className="flex-1 overflow-auto bg-[#1a1a1a] p-8 flex flex-col items-center gap-8">
                                    <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase block text-center">Baseline</span>
                                            <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl">
                                                <img src={activeDiff.baseline} className="w-full h-auto opacity-80" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase block text-center">New Build</span>
                                            <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl">
                                                <img src={activeDiff.comparison} className="w-full h-auto" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-red-500 uppercase block text-center">Diff Overlay</span>
                                            <div className="rounded-lg overflow-hidden border border-red-500/30 shadow-xl shadow-red-500/10">
                                                <img src={activeDiff.diff} className="w-full h-auto" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-card/50 px-6 py-3 rounded-full border shadow-lg backdrop-blur-md">
                                        <Button size="icon" variant="ghost" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-500/20">
                                            <XCircle className="w-6 h-6" />
                                        </Button>
                                        <span className="text-sm font-bold text-muted-foreground">Reviewing {activeDiff.component}</span>
                                        <Button size="icon" variant="ghost" className="rounded-full text-green-500 hover:text-green-600 hover:bg-green-500/20">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Build Passed</h2>
                            <p className="text-muted-foreground max-w-md">
                                No visual regressions detected in this build. All components match their baselines.
                            </p>
                            <div className="flex gap-4">
                                <Button variant="outline">View Report</Button>
                                <Button>Deploy to Staging</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
