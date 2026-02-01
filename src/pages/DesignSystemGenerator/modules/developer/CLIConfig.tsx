import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Terminal,
    Copy,
    CheckCircle2,
    Box,
    FileCode,
    FolderOpen,
    ArrowRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CLIConfig() {
    const [projectId, setProjectId] = useState('prj_8f9s8d9f8s');
    const [componentsDir, setComponentsDir] = useState('src/components/ui');
    const [tokensDir, setTokensDir] = useState('src/styles/tokens');
    const [framework, setFramework] = useState('react');
    const [styleSystem, setStyleSystem] = useState('tailwind');
    const [copied, setCopied] = useState(false);

    const generateConfig = () => {
        const config = {
            projectId: projectId,
            framework: framework,
            styleSystem: styleSystem,
            paths: {
                components: componentsDir,
                tokens: tokensDir,
            },
            tokens: {
                format: styleSystem === 'tailwind' ? 'tailwind' : 'css',
                prefix: 'ds-',
            },
        };
        return `module.exports = ${JSON.stringify(config, null, 2)};`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateConfig());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">CLI Configuration</h1>
                        <p className="text-sm text-muted-foreground">Setup your local environment to consume design system updates</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Area */}
                <div className="flex-1 overflow-auto p-8 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12">

                    {/* Configuration Form */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Box className="w-5 h-5 text-primary" />
                                Project Settings
                            </h2>
                            <div className="space-y-4 p-6 rounded-xl border bg-card/50">
                                <div className="grid gap-2">
                                    <Label>Framework</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['react', 'vue', 'svelte'].map(fw => (
                                            <button
                                                key={fw}
                                                onClick={() => setFramework(fw)}
                                                className={`px-4 py-2 capitalize rounded-lg border text-sm font-bold transition-all ${framework === fw
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'hover:bg-muted'
                                                    }`}
                                            >
                                                {fw}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Styling System</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['tailwind', 'css-modules', 'styled-components', 'css'].map(ss => (
                                            <button
                                                key={ss}
                                                onClick={() => setStyleSystem(ss)}
                                                className={`px-4 py-2 capitalize rounded-lg border text-sm font-bold transition-all ${styleSystem === ss
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'hover:bg-muted'
                                                    }`}
                                            >
                                                {ss.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <FolderOpen className="w-5 h-5 text-primary" />
                                Output Paths
                            </h2>
                            <div className="space-y-4 p-6 rounded-xl border bg-card/50">
                                <div className="grid gap-2">
                                    <Label>Components Directory</Label>
                                    <Input
                                        value={componentsDir}
                                        onChange={(e) => setComponentsDir(e.target.value)}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">Where generated components should be placed</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Tokens Directory</Label>
                                    <Input
                                        value={tokensDir}
                                        onChange={(e) => setTokensDir(e.target.value)}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">Where style variables/tokens should be placed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview & Install */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-primary" />
                                Installation
                            </h2>
                            <div className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-white font-mono text-sm shadow-xl">
                                <div className="flex gap-2 mb-2 opacity-50 text-xs select-none">
                                    <span className="text-red-400">●</span>
                                    <span className="text-yellow-400">●</span>
                                    <span className="text-green-400">●</span>
                                    <span className="ml-2">bash</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <span className="text-green-500">$</span>
                                        <span>npm install -g akanexus-cli</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-green-500">$</span>
                                        <span>akanexus init</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <FileCode className="w-5 h-5 text-primary" />
                                    Generated Config
                                </h2>
                                <Button
                                    size="sm"
                                    variant={copied ? "default" : "outline"}
                                    onClick={copyToClipboard}
                                    className="gap-2"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied' : 'Copy Code'}
                                </Button>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                <div className="relative p-6 rounded-xl bg-[#1e1e1e] border border-white/10 text-white font-mono text-sm shadow-xl overflow-hidden">
                                    <div className="text-xs opacity-50 mb-2 border-b border-white/10 pb-2 flex justify-between">
                                        <span>akanexus.config.js</span>
                                        <span>{framework} • {styleSystem}</span>
                                    </div>
                                    <pre className="text-blue-300">
                                        {generateConfig()}
                                    </pre>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3 text-sm text-blue-400">
                                <Terminal className="w-5 h-5 shrink-0" />
                                <p>
                                    Run <code>akanexus sync</code> in your project root to pull the latest design system updates based on this configuration.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
