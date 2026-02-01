import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    History,
    GitBranch,
    Tag,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    User,
    ExternalLink,
    ChevronRight,
    Zap,
    Box,
    Palette,
    Type
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VersionEntry {
    id: string;
    version: string;
    type: 'major' | 'minor' | 'patch';
    date: string;
    author: string;
    title: string;
    description: string;
    changes: {
        type: 'feat' | 'fix' | 'breaking' | 'refactor';
        content: string;
        module: string;
    }[];
    status: 'published' | 'draft' | 'archived';
}

const Changelog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const versions: VersionEntry[] = [
        {
            id: 'v2.1.0',
            version: '2.1.0',
            type: 'minor',
            date: '2024-05-15',
            author: 'John Doe',
            title: 'Foundation Builders & Component Workbench',
            description: 'Major update focusing on foundation customization and new component builders for production-ready design systems.',
            status: 'published',
            changes: [
                { type: 'feat', module: 'Foundations', content: 'Added Shadow & Elevation builder with realistic previews.' },
                { type: 'feat', module: 'Components', content: 'Implemented Card and Modal component builders.' },
                { type: 'feat', module: 'Governance', content: 'Launched Multi-Brand theme management.' },
                { type: 'breaking', module: 'Project', content: 'Project structure refactored to support Vite 5.' },
            ],
        },
        {
            id: 'v2.0.4',
            version: '2.0.4',
            type: 'patch',
            date: '2024-05-10',
            author: 'Jane Smith',
            title: 'Accessibility & Design Quality',
            description: 'Internal release to address accessibility issues and improve overall system health metrics.',
            status: 'published',
            changes: [
                { type: 'fix', module: 'Quality', content: 'Fixed color contrast issues in primary button variants.' },
                { type: 'feat', module: 'Quality', content: 'Added automated accessibility scanner (WCAG 2.1).' },
                { type: 'refactor', module: 'Tokens', content: 'Simplified token export logic for SCSS variables.' },
            ],
        },
        {
            id: 'v2.0.0',
            version: '2.0.0',
            type: 'major',
            date: '2024-04-30',
            author: 'John Doe',
            title: 'Akanexus Studio 2.1 Launch',
            description: 'Initial release of the new Design System Generator platform with core architecture and foundation builders.',
            status: 'published',
            changes: [
                { type: 'feat', module: 'Core', content: 'New modular architecture with Zustand global state.' },
                { type: 'feat', module: 'Tokens', content: 'Multi-format token export (CSS, JSON, Tailwind).' },
                { type: 'feat', module: 'Developer', content: 'Complete React starter project export via JSZip.' },
            ],
        },
    ];

    const filteredVersions = useMemo(() => {
        return versions.filter((v) => {
            const matchesSearch =
                v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.changes.some(c => c.content.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesType = !selectedType || v.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [searchQuery, selectedType]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-500/10 text-green-500';
            case 'draft': return 'bg-yellow-500/10 text-yellow-500';
            case 'archived': return 'bg-gray-500/10 text-gray-500';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getChangeTypeIcon = (type: string) => {
        switch (type) {
            case 'feat': return <Zap className="w-3 h-3 text-blue-500" />;
            case 'fix': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
            case 'breaking': return <AlertCircle className="w-3 h-3 text-red-500" />;
            default: return <Box className="w-3 h-3 text-purple-500" />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-7xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <History className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">System Changelog</h1>
                                <p className="text-xs text-muted-foreground">
                                    Track every evolution of your design system versions
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="gap-2">
                                <Tag className="w-4 h-4" />
                                Latest: v2.1.0
                            </Button>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                New Release
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by version, title, or change details..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Stats & Filters */}
                <div className="w-80 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Version Stats
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GitBranch className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold">Total Versions</span>
                                    </div>
                                    <Badge variant="secondary">32</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold">Last Published</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">2 days ago</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Release Types
                                </Label>
                                <div className="space-y-1">
                                    {['major', 'minor', 'patch'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(selectedType === type ? null : type)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedType === type ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                                }`}
                                        >
                                            <span className="text-sm font-bold capitalize">{type}</span>
                                            <Badge variant="outline" className="text-[10px] uppercase">
                                                {versions.filter(v => v.type === type).length}
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-primary" />
                                    Auto-Sync Enabled
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Your changelog is automatically synced with GitHub releases and internal design token deployments.
                                </p>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 bg-muted/10">
                    <ScrollArea className="h-full">
                        <div className="max-w-4xl mx-auto p-12">
                            <div className="relative border-l-2 border-border ml-6 pl-12 space-y-16">
                                {filteredVersions.map((version) => (
                                    <div key={version.id} className="relative group">
                                        {/* Timeline Node */}
                                        <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-background border-4 border-primary z-10 shadow-sm" />

                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h2 className="text-2xl font-black">v{version.version}</h2>
                                                        <Badge className={getStatusColor(version.status)}>
                                                            {version.status}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                            {version.date}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-primary/80">{version.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" className="h-8 gap-2">
                                                        <ExternalLink className="w-3 h-3" />
                                                        Diff
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8">
                                                        Deploy
                                                    </Button>
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                                {version.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-background border rounded-2xl">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                                                        Changes List
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {version.changes.map((change, idx) => (
                                                            <div key={idx} className="flex items-start gap-3">
                                                                <div className="mt-1">{getChangeTypeIcon(change.type)}</div>
                                                                <div>
                                                                    <p className="text-sm">
                                                                        <span className="font-bold text-xs uppercase opacity-60 mr-2">
                                                                            {change.module}:
                                                                        </span>
                                                                        {change.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-background border rounded-2xl">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                                                        Released By
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                            {version.author.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">{version.author}</p>
                                                            <p className="text-xs text-muted-foreground">Product Designer</p>
                                                        </div>
                                                    </div>
                                                    <Separator className="my-4" />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="text-center p-2 rounded-lg bg-muted/50">
                                                            <p className="text-xs font-bold">128</p>
                                                            <p className="text-[10px] text-muted-foreground">Commits</p>
                                                        </div>
                                                        <div className="text-center p-2 rounded-lg bg-muted/50">
                                                            <p className="text-xs font-bold">4</p>
                                                            <p className="text-[10px] text-muted-foreground">PRs</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default Changelog;
