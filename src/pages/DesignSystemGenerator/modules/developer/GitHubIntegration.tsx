import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Github,
    GitBranch,
    GitPullRequest,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Save,
    Rocket,
    Plus
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const MOCK_REPOS = [
    'akanexus/web-platform',
    'akanexus/mobile-app',
    'akanexus/design-system-core'
];

export default function GitHubIntegration() {
    const [token, setToken] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState('');
    const [baseBranch, setBaseBranch] = useState('main');
    const [prBranch, setPrBranch] = useState('design-updates');
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    const handleConnect = () => {
        if (token.length > 10) {
            setIsConnected(true);
            setSelectedRepo(MOCK_REPOS[0]);
        }
    };

    const handleSync = () => {
        setIsSyncing(true);
        // Simulate API call
        setTimeout(() => {
            setIsSyncing(false);
            setLastSync(new Date());
        }, 2500);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#24292e] flex items-center justify-center text-white shadow-lg">
                        <Github className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">GitHub Integration</h1>
                        <p className="text-sm text-muted-foreground">Automate your design-to-code workflow with Pull Requests</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Config Area */}
                <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
                    {!isConnected ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
                                <Github className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h2 className="text-2xl font-bold">Connect to GitHub</h2>
                                <p className="text-muted-foreground">
                                    Generate a Personal Access Token (PAT) with <code>repo</code> scope to allow Akanexus to open Pull Requests on your behalf.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full max-w-sm">
                                <Input
                                    type="password"
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="font-mono text-sm"
                                />
                                <Button onClick={handleConnect} disabled={!token} className="w-full font-bold gap-2">
                                    <Github className="w-4 h-4" />
                                    Connect Account
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    Your token is stored locally and never sent to our servers.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {/* Connection Status */}
                            <div className="p-6 rounded-2xl border bg-card/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src="https://github.com/ghost.png"
                                            alt="User Avatar"
                                            className="w-12 h-12 rounded-full border-2 border-background"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Connected as @ghost</h3>
                                        <p className="text-xs text-muted-foreground">Access scopes: repo, workflow</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                                    Disconnect
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Configuration */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-bold">Target Repository</Label>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs text-primary gap-1">
                                                <Plus className="w-3 h-3" /> Add Repo
                                            </Button>
                                        </div>
                                        <select
                                            className="w-full p-2.5 rounded-lg border bg-background text-sm"
                                            value={selectedRepo}
                                            onChange={(e) => setSelectedRepo(e.target.value)}
                                        >
                                            {MOCK_REPOS.map(repo => (
                                                <option key={repo} value={repo}>{repo}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base font-bold">Branch Strategy</Label>
                                        <div className="grid gap-4 p-4 rounded-xl border bg-muted/10">
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-mono uppercase text-muted-foreground">Base Branch</Label>
                                                <div className="flex items-center gap-2">
                                                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        value={baseBranch}
                                                        onChange={(e) => setBaseBranch(e.target.value)}
                                                        className="h-8 font-mono text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-mono uppercase text-muted-foreground">PR Branch Name</Label>
                                                <div className="flex items-center gap-2">
                                                    <GitPullRequest className="w-4 h-4 text-primary" />
                                                    <Input
                                                        value={prBranch}
                                                        onChange={(e) => setPrBranch(e.target.value)}
                                                        className="h-8 font-mono text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full gap-2" disabled={isSyncing} onClick={() => { }}>
                                        <Save className="w-4 h-4" />
                                        Save Configuration
                                    </Button>
                                </div>

                                {/* Actions & History */}
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent space-y-4">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <Rocket className="w-5 h-5 text-primary" />
                                            Sync Updates
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            This will generate all design tokens and component files, commit them to <code>{prBranch}</code>, and open a Pull Request against <code>{baseBranch}</code>.
                                        </p>

                                        {lastSync && (
                                            <div className="flex items-center gap-2 p-2 rounded bg-green-500/10 text-green-600 text-xs font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Last synced: {lastSync.toLocaleTimeString()}
                                            </div>
                                        )}

                                        <Button
                                            size="lg"
                                            className={`w-full font-bold shadow-lg shadow-primary/20 ${isSyncing ? 'animate-pulse' : ''}`}
                                            onClick={handleSync}
                                            disabled={isSyncing}
                                        >
                                            {isSyncing ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Creating Pull Request...
                                                </>
                                            ) : (
                                                <>
                                                    <GitPullRequest className="w-4 h-4 mr-2" />
                                                    Create Pull Request
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="uppercase text-xs font-bold text-muted-foreground">Recent Activity</Label>
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <GitPullRequest className="w-4 h-4 text-purple-500" />
                                                        <div>
                                                            <div className="font-medium">Update colors & spacing</div>
                                                            <div className="text-xs text-muted-foreground">#10{i} • Merged 2h ago</div>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-500 border-purple-500/20">
                                                        Merged
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
