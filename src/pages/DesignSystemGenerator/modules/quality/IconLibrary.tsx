import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Image,
    Upload,
    Search,
    Grid3x3,
    List,
    Download,
    Trash2,
    Copy,
    Star,
    Filter,
    Folder,
    File,
    Palette,
    Zap,
    Box,
    Heart,
    ShoppingCart,
    User,
    Settings,
    Home,
    Mail
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Asset {
    id: string;
    name: string;
    type: 'icon' | 'image' | 'illustration';
    category: string;
    size: string;
    format: string;
    tags: string[];
    favorite?: boolean;
    usage?: number;
}

const IconLibrary = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Mock icon library
    const sampleIcons = [
        { Icon: Home, name: 'home' },
        { Icon: User, name: 'user' },
        { Icon: Settings, name: 'settings' },
        { Icon: Mail, name: 'mail' },
        { Icon: Heart, name: 'heart' },
        { Icon: Star, name: 'star' },
        { Icon: ShoppingCart, name: 'shopping-cart' },
        { Icon: Search, name: 'search' },
        { Icon: Upload, name: 'upload' },
        { Icon: Download, name: 'download' },
        { Icon: Trash2, name: 'trash' },
        { Icon: Copy, name: 'copy' },
        { Icon: Palette, name: 'palette' },
        { Icon: Zap, name: 'zap' },
        { Icon: Box, name: 'box' },
        { Icon: Image, name: 'image' },
    ];

    const assets: Asset[] = useMemo(() => {
        return sampleIcons.map((icon, index) => ({
            id: `icon-${index}`,
            name: icon.name,
            type: 'icon' as const,
            category: index % 3 === 0 ? 'UI' : index % 3 === 1 ? 'Actions' : 'Social',
            size: '24x24',
            format: 'SVG',
            tags: [icon.name, 'lucide', 'icon'],
            favorite: index % 5 === 0,
            usage: Math.floor(Math.random() * 50),
        }));
    }, []);

    const categories = [
        { id: 'ui', name: 'UI Elements', count: assets.filter(a => a.category === 'UI').length },
        { id: 'actions', name: 'Actions', count: assets.filter(a => a.category === 'Actions').length },
        { id: 'social', name: 'Social', count: assets.filter(a => a.category === 'Social').length },
    ];

    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            const matchesSearch =
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = !selectedCategory || asset.category.toLowerCase() === selectedCategory.toLowerCase();
            const matchesType = !selectedType || asset.type === selectedType;
            return matchesSearch && matchesCategory && matchesType;
        });
    }, [assets, searchQuery, selectedCategory, selectedType]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-7xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Image className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Icon & Asset Library</h1>
                                <p className="text-xs text-muted-foreground">
                                    {assets.length} assets available
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                        }`}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                            <Button className="gap-2">
                                <Upload className="w-4 h-4" />
                                Upload Assets
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search icons and assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Filters
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-6">
                            {/* Type Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Asset Type
                                </Label>
                                <div className="space-y-1">
                                    {['icon', 'image', 'illustration'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(selectedType === type ? null : type)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedType === type ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                                }`}
                                        >
                                            <span className="capitalize">{type}s</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Categories
                                </Label>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.name)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.name
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'hover:bg-muted'
                                                }`}
                                        >
                                            <span className="text-sm font-bold">{category.name}</span>
                                            <Badge variant="secondary">{category.count}</Badge>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Quick Filters */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Quick Filters
                                </Label>
                                <div className="space-y-1">
                                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-muted transition-colors">
                                        <Star className="w-3 h-3 inline mr-2" />
                                        Favorites
                                    </button>
                                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-muted transition-colors">
                                        <Zap className="w-3 h-3 inline mr-2" />
                                        Most Used
                                    </button>
                                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-muted transition-colors">
                                        <Upload className="w-3 h-3 inline mr-2" />
                                        Recently Added
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b px-6 py-3 bg-card/30">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold">
                                {filteredAssets.length} assets
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Sort
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export All
                                </Button>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-6 gap-4">
                                    {filteredAssets.map((asset, index) => {
                                        const IconComponent = sampleIcons[index % sampleIcons.length].Icon;
                                        return (
                                            <div
                                                key={asset.id}
                                                className="group relative p-6 border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer"
                                            >
                                                {asset.favorite && (
                                                    <Star className="absolute top-2 right-2 w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                )}
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 flex items-center justify-center">
                                                        <IconComponent className="w-full h-full" />
                                                    </div>
                                                    <div className="text-center w-full">
                                                        <p className="text-xs font-bold truncate">{asset.name}</p>
                                                        <p className="text-xs text-muted-foreground">{asset.format}</p>
                                                    </div>
                                                </div>

                                                {/* Hover Actions */}
                                                <div className="absolute inset-0 bg-background/95 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                        <Download className="w-3 h-3" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                        <Star className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredAssets.map((asset, index) => {
                                        const IconComponent = sampleIcons[index % sampleIcons.length].Icon;
                                        return (
                                            <div
                                                key={asset.id}
                                                className="group p-4 border rounded-xl hover:border-primary/50 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg">
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-sm">{asset.name}</h4>
                                                            {asset.favorite && (
                                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                            )}
                                                            <Badge variant="outline" className="text-xs">
                                                                {asset.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span>{asset.format}</span>
                                                            <span>•</span>
                                                            <span>{asset.size}</span>
                                                            <span>•</span>
                                                            <span>Used {asset.usage} times</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Copy className="w-3 h-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Download className="w-3 h-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Panel - Asset Details */}
                <div className="w-80 border-l bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Library Stats
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-6">
                            {/* Stats */}
                            <div className="space-y-3">
                                <div className="p-4 border rounded-xl">
                                    <div className="text-3xl font-black mb-1">{assets.length}</div>
                                    <p className="text-sm text-muted-foreground">Total Assets</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 border rounded-lg">
                                        <div className="text-xl font-black mb-1">
                                            {assets.filter(a => a.type === 'icon').length}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Icons</p>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="text-xl font-black mb-1">
                                            {assets.filter(a => a.favorite).length}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Favorites</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Most Used */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Most Used
                                </Label>
                                <div className="space-y-2">
                                    {assets
                                        .sort((a, b) => (b.usage || 0) - (a.usage || 0))
                                        .slice(0, 5)
                                        .map((asset, index) => {
                                            const IconComponent = sampleIcons[index].Icon;
                                            return (
                                                <div
                                                    key={asset.id}
                                                    className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                                                >
                                                    <div className="w-8 h-8 flex items-center justify-center bg-muted rounded">
                                                        <IconComponent className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold truncate">{asset.name}</p>
                                                        <p className="text-xs text-muted-foreground">{asset.usage} uses</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                        <Upload className="w-4 h-4" />
                                        Upload Assets
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Folder className="w-4 h-4" />
                                        Create Category
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Download className="w-4 h-4" />
                                        Export Library
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

export default IconLibrary;
