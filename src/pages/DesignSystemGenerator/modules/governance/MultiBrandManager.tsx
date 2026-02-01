import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Palette,
    Plus,
    Copy,
    Trash2,
    Eye,
    Download,
    Settings,
    Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Brand {
    id: string;
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    isActive: boolean;
    createdDate: string;
}

const MultiBrandManager = () => {
    const { tokens } = useDesignSystemStore();
    const [selectedBrand, setSelectedBrand] = useState<string | null>('default');

    // Mock brands
    const brands: Brand[] = [
        {
            id: 'default',
            name: 'Default Brand',
            description: 'Primary brand theme',
            colors: {
                primary: '#3b82f6',
                secondary: '#8b5cf6',
                accent: '#f59e0b',
                background: '#ffffff',
            },
            isActive: true,
            createdDate: '2024-01-15',
        },
        {
            id: 'dark',
            name: 'Dark Theme',
            description: 'Dark mode variant',
            colors: {
                primary: '#60a5fa',
                secondary: '#a78bfa',
                accent: '#fbbf24',
                background: '#0f172a',
            },
            isActive: false,
            createdDate: '2024-02-20',
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Professional enterprise theme',
            colors: {
                primary: '#1e40af',
                secondary: '#6366f1',
                accent: '#0891b2',
                background: '#f8fafc',
            },
            isActive: false,
            createdDate: '2024-03-10',
        },
    ];

    const activeBrand = brands.find(b => b.id === selectedBrand) || brands[0];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-7xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Palette className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Multi-Brand Manager</h1>
                                <p className="text-xs text-muted-foreground">
                                    Manage multiple brand variations of your design system
                                </p>
                            </div>
                        </div>

                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Brand
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Brand List */}
                <div className="w-80 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Brands ({brands.length})
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-2">
                            {brands.map((brand) => (
                                <button
                                    key={brand.id}
                                    onClick={() => setSelectedBrand(brand.id)}
                                    className={`w-full p-4 border rounded-xl text-left transition-all ${selectedBrand === brand.id
                                            ? 'border-primary/50 bg-primary/5'
                                            : 'hover:border-primary/30'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold">{brand.name}</h4>
                                                {brand.isActive && (
                                                    <Badge variant="default" className="text-xs">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {brand.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Color Preview */}
                                    <div className="flex gap-1.5">
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-border"
                                            style={{ backgroundColor: brand.colors.primary }}
                                        />
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-border"
                                            style={{ backgroundColor: brand.colors.secondary }}
                                        />
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-border"
                                            style={{ backgroundColor: brand.colors.accent }}
                                        />
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-border"
                                            style={{ backgroundColor: brand.colors.background }}
                                        />
                                    </div>

                                    <div className="mt-3 text-xs text-muted-foreground">
                                        Created {new Date(brand.createdDate).toLocaleDateString()}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t">
                        <Button variant="outline" className="w-full gap-2" size="sm">
                            <Download className="w-4 h-4" />
                            Import Brand
                        </Button>
                    </div>
                </div>

                {/* Main Content - Brand Editor */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b px-6 py-4 bg-card/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black">{activeBrand.name}</h2>
                                <p className="text-sm text-muted-foreground">{activeBrand.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Copy className="w-4 h-4" />
                                    Duplicate
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-8 max-w-4xl space-y-8">
                            {/* Brand Colors */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-black">Brand Colors</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(activeBrand.colors).map(([key, value]) => (
                                        <div key={key} className="p-6 border rounded-xl">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div
                                                    className="w-16 h-16 rounded-xl border-2 border-border"
                                                    style={{ backgroundColor: value }}
                                                />
                                                <div className="flex-1">
                                                    <Label className="text-sm font-bold capitalize mb-2 block">
                                                        {key}
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        value={value}
                                                        className="font-mono text-sm"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Typography Override */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-black">Typography</h3>
                                <div className="p-6 border rounded-xl">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-bold mb-2 block">
                                                Primary Font Family
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder="Inter, sans-serif"
                                                className="font-mono"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-bold mb-2 block">
                                                Heading Font Family
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder="Poppins, sans-serif"
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Component Overrides */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-black">Component Overrides</h3>
                                <div className="space-y-3">
                                    <div className="p-4 border rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm mb-1">Button Styles</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Customize button appearance for this brand
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm mb-1">Input Styles</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Customize input appearance for this brand
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm mb-1">Card Styles</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Customize card appearance for this brand
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Preview */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-black">Live Preview</h3>
                                <div
                                    className="p-8 border-2 rounded-xl"
                                    style={{ backgroundColor: activeBrand.colors.background }}
                                >
                                    <div className="space-y-4">
                                        <h2
                                            className="text-2xl font-black"
                                            style={{ color: activeBrand.colors.primary }}
                                        >
                                            {activeBrand.name} Preview
                                        </h2>
                                        <p className="text-muted-foreground">
                                            This is how your components will look with this brand theme applied.
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                className="px-4 py-2 rounded-lg font-bold text-white"
                                                style={{ backgroundColor: activeBrand.colors.primary }}
                                            >
                                                Primary Button
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded-lg font-bold text-white"
                                                style={{ backgroundColor: activeBrand.colors.secondary }}
                                            >
                                                Secondary Button
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded-lg font-bold text-white"
                                                style={{ backgroundColor: activeBrand.colors.accent }}
                                            >
                                                Accent Button
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Panel - Actions */}
                <div className="w-80 border-l bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Brand Actions
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-6">
                            {/* Status */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Status
                                </Label>
                                <div className="p-4 border rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-bold">Active Brand</span>
                                        <Badge variant={activeBrand.isActive ? 'default' : 'secondary'}>
                                            {activeBrand.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    {!activeBrand.isActive && (
                                        <Button className="w-full gap-2" size="sm">
                                            <Sparkles className="w-4 h-4" />
                                            Set as Active
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Quick Actions */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Quick Actions
                                </Label>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Copy className="w-4 h-4" />
                                        Duplicate Brand
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Download className="w-4 h-4" />
                                        Export Theme
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                                        <Eye className="w-4 h-4" />
                                        Preview Site
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Brand
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Token Overrides */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Token Overrides
                                </Label>
                                <div className="p-4 border rounded-xl">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Colors</span>
                                            <Badge variant="secondary">4</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Typography</span>
                                            <Badge variant="secondary">2</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Components</span>
                                            <Badge variant="secondary">3</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Info */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Information
                                </Label>
                                <div className="text-sm space-y-2">
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Created</p>
                                        <p className="font-bold">
                                            {new Date(activeBrand.createdDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Last Modified</p>
                                        <p className="font-bold">2 days ago</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Used By</p>
                                        <p className="font-bold">3 projects</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default MultiBrandManager;
