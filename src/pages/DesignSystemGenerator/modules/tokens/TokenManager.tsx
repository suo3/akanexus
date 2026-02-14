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
    Code,
    Download
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    const {
        tokens,
        typography,
        spacing,
        shadows,
        motion,
        updateTokens,
        updateTypography,
        updateSpacing,
        updateShadows,
        updateMotion
    } = useDesignSystemStore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Dialog states
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [aliasDialogOpen, setAliasDialogOpen] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);

    // Form states
    const [editForm, setEditForm] = useState({ name: '', value: '', description: '' });
    const [createForm, setCreateForm] = useState({ name: '', value: '', category: 'Colors', type: 'color', description: '' });
    const [aliasForm, setAliasForm] = useState({ name: '', reference: '', description: '' });
    const [exportFormat, setExportFormat] = useState<'json' | 'css' | 'scss'>('json');

    // Compile all tokens from the store
    const allTokens: Token[] = useMemo(() => {
        const tokenList: Token[] = [];

        // Color tokens (exclude scale objects)
        Object.entries(tokens.colors).forEach(([key, value]) => {
            // Skip scale objects (primaryScale, secondaryScale, etc.)
            if (key.endsWith('Scale') || typeof value !== 'string') {
                return;
            }
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

        // Font weights
        Object.entries(typography.fontWeights).forEach(([key, value]) => {
            tokenList.push({
                id: `font-weight-${key}`,
                name: `font-weight-${key}`,
                value: String(value),
                category: 'Typography',
                type: 'font-weight',
                description: `${key} font weight`,
                usage: Math.floor(Math.random() * 20),
            });
        });

        // Line heights
        Object.entries(typography.lineHeights).forEach(([key, value]) => {
            tokenList.push({
                id: `line-height-${key}`,
                name: `line-height-${key}`,
                value: String(value),
                category: 'Typography',
                type: 'line-height',
                description: `${key} line height`,
                usage: Math.floor(Math.random() * 18),
            });
        });

        // Letter spacing
        Object.entries(typography.letterSpacing).forEach(([key, value]) => {
            tokenList.push({
                id: `letter-spacing-${key}`,
                name: `letter-spacing-${key}`,
                value: value as string,
                category: 'Typography',
                type: 'letter-spacing',
                description: `${key} letter spacing`,
                usage: Math.floor(Math.random() * 12),
            });
        });

        // Spacing tokens
        if (spacing?.scale) {
            Object.entries(spacing.scale).forEach(([key, value]) => {
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
        if (shadows?.levels) {
            shadows.levels.forEach((level) => {
                tokenList.push({
                    id: `shadow-${level.name}`,
                    name: `shadow-${level.name}`,
                    value: level.shadow,
                    category: 'Shadows',
                    type: 'shadow',
                    description: level.description,
                    usage: Math.floor(Math.random() * 10),
                });
            });
        }

        // Motion tokens - Easings
        if (motion?.easings) {
            Object.entries(motion.easings).forEach(([key, value]) => {
                tokenList.push({
                    id: `easing-${key}`,
                    name: `easing-${key}`,
                    value: value as string,
                    category: 'Motion',
                    type: 'easing',
                    description: `${key} easing curve`,
                    usage: Math.floor(Math.random() * 8),
                });
            });
        }

        // Motion tokens - Durations
        if (motion?.durations) {
            Object.entries(motion.durations).forEach(([key, value]) => {
                tokenList.push({
                    id: `duration-${key}`,
                    name: `duration-${key}`,
                    value: `${value}ms`,
                    category: 'Motion',
                    type: 'duration',
                    description: `${key} animation duration`,
                    usage: Math.floor(Math.random() * 8),
                });
            });
        }

        // Breakpoints
        if (spacing?.breakpoints) {
            Object.entries(spacing.breakpoints).forEach(([key, value]) => {
                tokenList.push({
                    id: `breakpoint-${key}`,
                    name: `breakpoint-${key}`,
                    value: value as string,
                    category: 'Spacing',
                    type: 'breakpoint',
                    description: `${key} breakpoint`,
                    usage: Math.floor(Math.random() * 15),
                });
            });
        }

        // Grid system
        if (spacing?.grid) {
            Object.entries(spacing.grid).forEach(([key, value]) => {
                tokenList.push({
                    id: `grid-${key}`,
                    name: `grid-${key}`,
                    value: String(value),
                    category: 'Spacing',
                    type: 'grid',
                    description: `Grid ${key}`,
                    usage: Math.floor(Math.random() * 10),
                });
            });
        }

        // Border radius
        if (tokens.radius !== undefined) {
            tokenList.push({
                id: 'border-radius',
                name: 'border-radius',
                value: `${tokens.radius}rem`,
                category: 'Spacing',
                type: 'radius',
                description: 'Default border radius',
                usage: Math.floor(Math.random() * 25),
            });
        }

        return tokenList;
    }, [tokens, typography, spacing, shadows, motion]);

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

        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cssVar).then(() => {
                toast({
                    title: 'Copied to clipboard',
                    description: `${cssVar} copied successfully`,
                });
            }).catch(() => {
                // Fallback if clipboard API fails
                fallbackCopy(cssVar);
            });
        } else {
            // Fallback for browsers without clipboard API
            fallbackCopy(cssVar);
        }
    };

    const fallbackCopy = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            toast({
                title: 'Copied to clipboard',
                description: `${text} copied successfully`,
            });
        } catch (err) {
            toast({
                title: 'Copy failed',
                description: 'Please copy manually: ' + text,
                variant: 'destructive',
            });
        }
        document.body.removeChild(textarea);
    };

    const handleEdit = (token: Token) => {
        setSelectedToken(token);
        setEditForm({ name: token.name, value: token.value, description: token.description || '' });
        setEditDialogOpen(true);
    };

    const handleDelete = (token: Token) => {
        setSelectedToken(token);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedToken) return;

        toast({
            title: 'Delete not supported',
            description: 'Deleting core tokens is not recommended. Use edit to modify values instead.',
            variant: 'destructive',
        });
        setDeleteDialogOpen(false);
        setSelectedToken(null);
    };

    const saveEdit = () => {
        if (!selectedToken) return;

        const tokenKey = selectedToken.name.replace(/^(font-size-|font-weight-|line-height-|letter-spacing-|font-|spacing-|shadow-|easing-|duration-|breakpoint-|grid-|color-|border-)/, '');

        // Update based on category
        if (selectedToken.category === 'Colors') {
            updateTokens({
                colors: {
                    ...tokens.colors,
                    [tokenKey]: editForm.value
                }
            });
        } else if (selectedToken.category === 'Typography') {
            if (selectedToken.type === 'font-family') {
                updateTypography({
                    fontFamilies: {
                        ...typography.fontFamilies,
                        [tokenKey]: editForm.value
                    }
                });
            } else if (selectedToken.type === 'font-size') {
                updateTypography({
                    fontSizes: {
                        ...typography.fontSizes,
                        [tokenKey]: editForm.value
                    }
                });
            } else if (selectedToken.type === 'font-weight') {
                updateTypography({
                    fontWeights: {
                        ...typography.fontWeights,
                        [tokenKey]: parseInt(editForm.value)
                    }
                });
            } else if (selectedToken.type === 'line-height') {
                updateTypography({
                    lineHeights: {
                        ...typography.lineHeights,
                        [tokenKey]: parseFloat(editForm.value)
                    }
                });
            } else if (selectedToken.type === 'letter-spacing') {
                updateTypography({
                    letterSpacing: {
                        ...typography.letterSpacing,
                        [tokenKey]: editForm.value
                    }
                });
            }
        } else if (selectedToken.category === 'Spacing') {
            if (selectedToken.type === 'spacing' && spacing?.scale) {
                updateSpacing({
                    scale: {
                        ...spacing.scale,
                        [tokenKey]: editForm.value
                    }
                });
            } else if (selectedToken.type === 'breakpoint' && spacing?.breakpoints) {
                updateSpacing({
                    breakpoints: {
                        ...spacing.breakpoints,
                        [tokenKey]: editForm.value
                    }
                });
            } else if (selectedToken.type === 'grid' && spacing?.grid) {
                updateSpacing({
                    grid: {
                        ...spacing.grid,
                        [tokenKey]: editForm.value
                    }
                });
            } else if (selectedToken.type === 'radius') {
                updateTokens({ radius: parseFloat(editForm.value) });
            }
        } else if (selectedToken.category === 'Shadows' && shadows?.levels) {
            const updatedLevels = shadows.levels.map(level =>
                level.name === tokenKey ? { ...level, shadow: editForm.value } : level
            );
            updateShadows({ levels: updatedLevels });
        } else if (selectedToken.category === 'Motion') {
            if (selectedToken.type === 'easing' && motion?.easings) {
                updateMotion({
                    easings: {
                        ...motion.easings,
                        [tokenKey]: editForm.value
                    }
                });
            } else if (selectedToken.type === 'duration' && motion?.durations) {
                updateMotion({
                    durations: {
                        ...motion.durations,
                        [tokenKey]: parseInt(editForm.value)
                    }
                });
            }
        }

        toast({
            title: 'Token updated',
            description: `${editForm.name} has been updated successfully`,
        });
        setEditDialogOpen(false);
        setSelectedToken(null);
    };

    const createToken = () => {
        if (!createForm.name || !createForm.value) {
            toast({
                title: 'Validation error',
                description: 'Please provide both name and value',
                variant: 'destructive',
            });
            return;
        }

        // Create based on category
        if (createForm.category === 'Colors') {
            updateTokens({
                colors: {
                    ...tokens.colors,
                    [createForm.name]: createForm.value
                }
            });
        } else if (createForm.category === 'Typography') {
            if (createForm.type === 'font-size') {
                updateTypography({
                    fontSizes: {
                        ...typography.fontSizes,
                        [createForm.name]: createForm.value
                    }
                });
            } else if (createForm.type === 'font-weight') {
                updateTypography({
                    fontWeights: {
                        ...typography.fontWeights,
                        [createForm.name]: parseInt(createForm.value)
                    }
                });
            }
        } else if (createForm.category === 'Spacing' && spacing?.scale) {
            updateSpacing({
                scale: {
                    ...spacing.scale,
                    [createForm.name]: createForm.value
                }
            });
        }

        toast({
            title: 'Token created',
            description: `${createForm.name} has been created successfully`,
        });
        setCreateDialogOpen(false);
        setCreateForm({ name: '', value: '', category: 'Colors', type: 'color', description: '' });
    };

    const createAlias = () => {
        if (!aliasForm.name || !aliasForm.reference) {
            toast({
                title: 'Validation error',
                description: 'Please provide both alias name and reference',
                variant: 'destructive',
            });
            return;
        }

        // Create alias as a CSS variable reference
        updateTokens({
            colors: {
                ...tokens.colors,
                [aliasForm.name]: `var(--${aliasForm.reference})`
            }
        });

        toast({
            title: 'Alias created',
            description: `${aliasForm.name} now references ${aliasForm.reference}`,
        });
        setAliasDialogOpen(false);
        setAliasForm({ name: '', reference: '', description: '' });
    };

    const handleExport = () => {
        let exportData = '';
        const tokensToExport = selectedCategory ? filteredTokens : allTokens;

        switch (exportFormat) {
            case 'json':
                const jsonData: Record<string, any> = {};
                tokensToExport.forEach(token => {
                    jsonData[token.name] = token.value;
                });
                exportData = JSON.stringify(jsonData, null, 2);
                break;
            case 'css':
                exportData = ':root {\n';
                tokensToExport.forEach(token => {
                    exportData += `  --${token.name}: ${token.value};\n`;
                });
                exportData += '}';
                break;
            case 'scss':
                tokensToExport.forEach(token => {
                    exportData += `$${token.name}: ${token.value};\n`;
                });
                break;
        }

        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tokens.${exportFormat}`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
            title: 'Export successful',
            description: `Tokens exported as ${exportFormat.toUpperCase()}`,
        });
        setExportDialogOpen(false);
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
                        <Button onClick={() => setCreateDialogOpen(true)} className="w-full gap-2" size="sm">
                            <Plus className="w-4 h-4" />
                            New Token
                        </Button>
                        <Button onClick={() => setAliasDialogOpen(true)} variant="outline" size="sm">
                            <Link2 className="w-4 h-4" />
                            Create Alias
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
                                <Button onClick={() => setPreviewDialogOpen(true)} variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                </Button>
                                <Button onClick={() => setExportDialogOpen(true)} variant="ghost" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
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
                                                                onClick={() => handleEdit(token)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(token)}
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
                                    <Button onClick={() => setCreateDialogOpen(true)} variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Plus className="w-4 h-4" />
                                        Create Token
                                    </Button>
                                    <Button onClick={() => setAliasDialogOpen(true)} variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Link2 className="w-4 h-4" />
                                        Create Alias
                                    </Button>
                                    <Button onClick={() => setExportDialogOpen(true)} variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Download className="w-4 h-4" />
                                        Export All
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Edit Token Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Token</DialogTitle>
                        <DialogDescription>
                            Update the token details below
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Token Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                placeholder="e.g., primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-value">Value</Label>
                            <Input
                                id="edit-value"
                                value={editForm.value}
                                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                placeholder="e.g., #3b82f6"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Textarea
                                id="edit-description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Describe this token..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Token Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Token</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedToken?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Token Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Token</DialogTitle>
                        <DialogDescription>
                            Add a new design token to your system
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Token Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.name}
                                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                placeholder="e.g., accent-dark"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-category">Category</Label>
                            <Select
                                value={createForm.category}
                                onValueChange={(value) => setCreateForm({ ...createForm, category: value })}
                            >
                                <SelectTrigger id="create-category">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Colors">Colors</SelectItem>
                                    <SelectItem value="Typography">Typography</SelectItem>
                                    <SelectItem value="Spacing">Spacing</SelectItem>
                                    <SelectItem value="Shadows">Shadows</SelectItem>
                                    <SelectItem value="Motion">Motion</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-value">Value</Label>
                            <Input
                                id="create-value"
                                value={createForm.value}
                                onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })}
                                placeholder="e.g., #f59e0b"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-description">Description (Optional)</Label>
                            <Textarea
                                id="create-description"
                                value={createForm.description}
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                placeholder="Describe this token..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createToken}>Create Token</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Alias Dialog */}
            <Dialog open={aliasDialogOpen} onOpenChange={setAliasDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Token Alias</DialogTitle>
                        <DialogDescription>
                            Create an alias that references an existing token
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="alias-name">Alias Name</Label>
                            <Input
                                id="alias-name"
                                value={aliasForm.name}
                                onChange={(e) => setAliasForm({ ...aliasForm, name: e.target.value })}
                                placeholder="e.g., button-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="alias-reference">Reference Token</Label>
                            <Input
                                id="alias-reference"
                                value={aliasForm.reference}
                                onChange={(e) => setAliasForm({ ...aliasForm, reference: e.target.value })}
                                placeholder="e.g., color-primary"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the name of the token to reference
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="alias-description">Description (Optional)</Label>
                            <Textarea
                                id="alias-description"
                                value={aliasForm.description}
                                onChange={(e) => setAliasForm({ ...aliasForm, description: e.target.value })}
                                placeholder="Describe the purpose of this alias..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAliasDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createAlias}>Create Alias</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Token Preview</DialogTitle>
                        <DialogDescription>
                            Preview of {selectedCategory || 'all'} tokens ({filteredTokens.length} total)
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="grid grid-cols-2 gap-4">
                            {filteredTokens.map((token) => (
                                <div key={token.id} className="p-4 border rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm font-bold">{token.name}</span>
                                        <Badge variant="outline" className="text-xs">{token.category}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {getTokenPreview(token)}
                                        </div>
                                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                                            {token.value}
                                        </code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Export Dialog */}
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Export Tokens</DialogTitle>
                        <DialogDescription>
                            Export {selectedCategory ? `${selectedCategory} tokens` : 'all tokens'} in your preferred format
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Export Format</Label>
                            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="json">JSON</SelectItem>
                                    <SelectItem value="css">CSS Variables</SelectItem>
                                    <SelectItem value="scss">SCSS Variables</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                {selectedCategory ? filteredTokens.length : allTokens.length} tokens will be exported as {exportFormat.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TokenManager;
