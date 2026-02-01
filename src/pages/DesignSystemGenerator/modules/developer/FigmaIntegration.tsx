import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Figma,
    Link as LinkIcon,
    RefreshCw,
    CheckCircle2,
    ExternalLink,
    Download,
    Upload,
    Palette
} from 'lucide-react';

const MOCK_FILES = [
    { id: 'file-1', name: 'Akanexus Core UI', key: 'fn23948sdf92', lastSync: '2 hours ago', status: 'synced' },
    { id: 'file-2', name: 'Marketing Website', key: 'xm938d829sd', lastSync: '2 days ago', status: 'outdated' },
];

export default function FigmaIntegration() {
    const [token, setToken] = useState('');
    const [fileKey, setFileKey] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [files, setFiles] = useState(MOCK_FILES);

    const handleConnect = () => {
        if (token) {
            setIsConnected(true);
        }
    };

    const handleSync = (fileId: string) => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setFiles(files.map(f => f.id === fileId ? { ...f, status: 'synced', lastSync: 'Just now' } : f));
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                        <Figma className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Figma Sync</h1>
                        <p className="text-sm text-muted-foreground">Bi-directional synchronization between design and code</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Connection Area */}
                <div className="flex-1 overflow-auto p-8 max-w-5xl mx-auto w-full">
                    {!isConnected ? (
                        <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">Connect your Figma account</h2>
                                    <p className="text-muted-foreground">
                                        Generate a Personal Access Token in Figma Settings to allow Akanexus to read your design files and extract tokens.
                                    </p>
                                </div>

                                <div className="space-y-4 p-6 rounded-2xl border bg-card/50">
                                    <div className="space-y-2">
                                        <Label>Personal Access Token</Label>
                                        <Input
                                            type="password"
                                            placeholder="figd_xxxxxxxxxxxxxxxx"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                        />
                                    </div>
                                    <Button className="w-full gap-2" onClick={handleConnect} disabled={!token}>
                                        <LinkIcon className="w-4 h-4" />
                                        Connect Figma
                                    </Button>
                                </div>
                            </div>
                            <div className="relative h-64 md:h-96 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#000000] flex items-center justify-center overflow-hidden border shadow-2xl">
                                {/* Visual representation of sync */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black"></div>
                                <div className="relative z-10 flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-2xl bg-[#000000] border border-white/10 flex items-center justify-center shadow-2xl">
                                        <Figma className="w-10 h-10 text-pink-500" />
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                                        <Palette className="w-10 h-10 text-cyan-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {/* Active Files */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {files.map(file => (
                                    <div key={file.id} className="p-6 rounded-xl border bg-card hover:shadow-md transition-all group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#2C2C2C] flex items-center justify-center">
                                                    <Figma className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{file.name}</h3>
                                                    <p className="text-xs text-muted-foreground font-mono">ID: {file.key}</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className={file.status === 'synced' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}>
                                                {file.status === 'synced' ? 'Synced' : 'Outdated'}
                                            </Badge>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Last synced: {file.lastSync}</span>
                                                <span>v42.0.1</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => handleSync(file.id)} disabled={isSyncing}>
                                                    {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                                    Pull Tokens
                                                </Button>
                                                <Button variant="ghost" size="sm" className="w-full gap-2 text-primary hover:text-primary">
                                                    <ExternalLink className="w-3 h-3" />
                                                    Open in Figma
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add New File */}
                                <div className="p-6 rounded-xl border border-dashed hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-center gap-2 cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-bold">Add Design File</h3>
                                    <p className="text-xs text-muted-foreground max-w-[200px]">Copy a Figma file URL to start syncing tokens</p>
                                </div>
                            </div>

                            {/* Sync Logic Explanation */}
                            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-blue-500" />
                                    How Sync Works
                                </h3>
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold mb-2">1</div>
                                        <h4 className="font-medium text-sm">Styles → Tokens</h4>
                                        <p className="text-xs text-muted-foreground">Figma Styles (Paint, Text, Effect) are converted into platform-agnostic design tokens.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold mb-2">2</div>
                                        <h4 className="font-medium text-sm">Variables → Theme</h4>
                                        <p className="text-xs text-muted-foreground">Figma Variables (Primitives, Semantics) are mapped to your component theme.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold mb-2">3</div>
                                        <h4 className="font-medium text-sm">Icons → Assets</h4>
                                        <p className="text-xs text-muted-foreground">Components marked as exportable SVGs are automatically added to the Icon Library.</p>
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
