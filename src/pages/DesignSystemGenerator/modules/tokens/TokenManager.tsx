import React, { useState, useMemo } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Database,
    Search,
    Copy,
    Edit,
    Trash2,
    Plus,
    Palette,
    Type,
    Ruler,
    Box,
    Zap,
    Link2,
    Eye,
    Code
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Token {
    id: string;
    name: string;
    value: string;
    category: string;
    type: string;
    description?: string;
    alias?: string;
    usage?: number;
}

const TokenManager = () => {
    const { tokens, typography } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Compile all tokens from the store
    const allTokens: Token[] = useMemo(() => {
        const tokenList: Token[] = [];

        // Color tokens
        Object.entries(tokens.colors).forEach(([key, value]) => {
            tokenList.push({
                id: `color-${key}`,
                name: key,
                value: value as string,
                category: 'Colors',
                type: 'color',
                description: `${key} color token`,
                usage: Math.floor(Math.random() * 20), // Mock usage count
            });
        });

        // Typography tokens
        Object.entries(typography.fontFamilies).forEach(([key, value]) => {
            tokenList.push({
                id: `font-${key}`,
                name: `font-${key}`,
                value: value as string,
                category: 'Typography',
                type: 'font-family',
                description: `${key} font family`,
                usage: Math.floor(Math.random() * 15),
            });
        });

        Object.entries(typography.fontSizes).forEach(([key, value]) => {
            tokenList.push({
                id: `font-size-${key}`,
                name: `font-size-${key}`,
                value: value as string,
                category: 'Typography',
                type: 'font-size',
                description: `${key} font size`,
                usage: Math.floor(Math.random() * 25),
            });
        });

        // Spacing tokens
        if (tokens.spacing) {
            Object.entries(tokens.spacing).forEach(([key, value]) => {
                tokenList.push({
                    id: `spacing-${key}`,
                    name: `spacing-${key}`,
                    value: value as string,
                    category: 'Spacing',
                    type: 'spacing',
                    description: `${key} spacing unit`,
                    usage: Math.floor(Math.random() * 30),
                });
            });
        }

        // Shadow tokens
        Object.entries(tokens.shadows || {}).forEach(([key, value]) => {
            tokenList.push({
                id: `shadow-${key}`,
                name: `shadow-${key}`,
                value: value as string,
                category: 'Shadows',
                type: 'shadow',
                description: `${key} shadow`,
                usage: Math.floor(Math.random() * 10),
            });
        });

        // Motion tokens
        Object.entries(tokens.motion || {}).forEach(([key, value]) => {
            tokenList.push({
                id: `motion-${key}`,
                name: `motion-${key}`,
                value: value as string,
                category: 'Motion',
                type: 'easing',
                description: `${key} easing curve`,
                usage: Math.floor(Math.random() * 8),
            });
        });

        return tokenList;
    }, [tokens, typography]);

    // Filter tokens based on search and category
    const filteredTokens = useMemo(() => {
        return allTokens.filter((token) => {
            const matchesSearch =
                token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !selectedCategory || token.category === selectedCategory;
            const matchesTab = activeTab === 'all' || token.category.toLowerCase() === activeTab;

            return matchesSearch && matchesCategory && matchesTab;
        });
    }, [allTokens, searchQuery, selectedCategory, activeTab]);

    // Get token counts by category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allTokens.forEach((token) => {
            counts[token.category] = (counts[token.category] || 0) + 1;
        });
        return counts;
    }, [allTokens]);

    const categories = [
        { id: 'colors', name: 'Colors', icon: Palette, color: 'text-pink-500' },
        { id: 'typography', name: 'Typography', icon: Type, color: 'text-blue-500' },
        { id: 'spacing', name: 'Spacing', icon: Ruler, color: 'text-green-500' },
        { id: 'shadows', name: 'Shadows', icon: Box, color: 'text-purple-500' },
        { id: 'motion', name: 'Motion', icon: Zap, color: 'text-yellow-500' },
    ];

    const copyToken = (token: Token) => {
        const cssVar = `var(--${token.name})`;
        navigator.clipboard.writeText(cssVar);
    };

    const getTokenPreview = (token: Token) => {
        switch (token.type) {
            case 'color':
                return (
                    <div
                        className="w-10 h-10 rounded-lg border-2 border-border"
                        style={{ backgroundColor: token.value }}
                    />
                );
            case 'font-family':
                return (
                    <div className="text-sm" style={{ fontFamily: token.value }}>
                        Aa
                    </div>
                );
            case 'font-size':
                return (
                    <div style={{ fontSize: token.value }}>
                        Aa
                    </div>
                );
            case 'spacing':
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="h-6 bg-primary/20 rounded"
                            style={{ width: token.value }}
                        />
                        <span className="text-xs text-muted-foreground">{token.value}</span>
                    </div>
                );
            case 'shadow':
                return (
                    <div
                        className="w-10 h-10 rounded-lg bg-background"
                        style={{ boxShadow: token.value }}
                    />
                );
            default:
                return <Code className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-7xl">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Database className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Token Manager</h1>
                            <p className="text-xs text-muted-foreground">
                                {allTokens.length} tokens across {Object.keys(categoryCounts).length} categories
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tokens by name, value, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Categories */}
                <div className="w-64 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Categories
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setActiveTab('all');
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${!selectedCategory
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <span className="text-sm font-bold">All Tokens</span>
                                <Badge variant="secondary">{allTokens.length}</Badge>
                            </button>

                            <Separator className="my-2" />

                            {categories.map((category) => {
                                const Icon = category.icon;
                                const count = categoryCounts[category.name] || 0;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.name);
                                            setActiveTab(category.id);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.name
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className={`w-4 h-4 ${category.color}`} />
                                            <span className="text-sm font-bold">{category.name}</span>
                                        </div>
                                        <Badge variant="secondary">{count}</Badge>
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t">
                        <Button className="w-full gap-2" size="sm">
                            <Plus className="w-4 h-4" />
                            New Token
                        </Button>
                    </div>
                </div>

                {/* Main Content - Token List */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b px-6 py-3 bg-card/30">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold">
                                {selectedCategory || 'All Tokens'} ({filteredTokens.length})
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Code className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            {filteredTokens.length === 0 ? (
                                <div className="text-center py-12">
                                    <Database className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                                    <p className="text-muted-foreground">No tokens found</p>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your search or filters
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredTokens.map((token) => (
                                        <div
                                            key={token.id}
                                            className="group p-4 border rounded-xl hover:border-primary/50 transition-all hover:shadow-sm"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Preview */}
                                                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-muted rounded-lg">
                                                    {getTokenPreview(token)}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-sm truncate">
                                                                    {token.name}
                                                                </h4>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {token.category}
                                                                </Badge>
                                                            </div>
                                                            {token.description && (
                                                                <p className="text-xs text-muted-foreground mb-2">
                                                                    {token.description}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-4 text-xs">
                                                                <code className="px-2 py-1 bg-muted rounded font-mono">
                                                                    {token.value}
                                                                </code>
                                                                {token.usage !== undefined && (
                                                                    <span className="text-muted-foreground">
                                                                        Used {token.usage} times
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => copyToken(token)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Alias/Reference */}
                                                    {token.alias && (
                                                        <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded">
                                                            <Link2 className="w-3 h-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">
                                                                References: <code className="font-mono">{token.alias}</code>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Panel - Token Details */}
                <div className="w-80 border-l bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Quick Stats
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-6">
                            {/* Category Breakdown */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    By Category
                                </Label>
                                <div className="space-y-2">
                                    {categories.map((category) => {
                                        const count = categoryCounts[category.name] || 0;
                                        const percentage = (count / allTokens.length) * 100;
                                        const Icon = category.icon;
                                        return (
                                            <div key={category.id} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-3 h-3 ${category.color}`} />
                                                        <span className="font-bold">{category.name}</span>
                                                    </div>
                                                    <span className="text-muted-foreground">{count}</span>
                                                </div>
                                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <Separator />

                            {/* Most Used Tokens */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Most Used
                                </Label>
                                <div className="space-y-2">
                                    {[...allTokens]
                                        .sort((a, b) => (b.usage || 0) - (a.usage || 0))
                                        .slice(0, 5)
                                        .map((token) => (
                                            <div
                                                key={token.id}
                                                className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted cursor-pointer"
                                            >
                                                <span className="font-mono text-xs truncate">
                                                    {token.name}
                                                </span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {token.usage}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Actions */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Actions
                                </Label>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Plus className="w-4 h-4" />
                                        Create Token
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Link2 className="w-4 h-4" />
                                        Create Alias
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Code className="w-4 h-4" />
                                        Export All
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default TokenManager;
