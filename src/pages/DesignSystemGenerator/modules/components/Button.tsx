import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Component, Copy, Download, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ButtonVariant {
    id: string;
    name: string;
    background: string;
    foreground: string;
    border: string;
    hoverBackground: string;
    hoverForeground: string;
    activeBackground: string;
}

interface ButtonSize {
    id: string;
    name: string;
    padding: string;
    fontSize: string;
    height: string;
}

const ButtonComponentBuilder = () => {
    const { tokens, typography } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('variants');
    const [selectedVariant, setSelectedVariant] = useState('primary');
    const [selectedSize, setSelectedSize] = useState('md');
    const [selectedState, setSelectedState] = useState('default');

    const [variants, setVariants] = useState<ButtonVariant[]>([
        {
            id: 'primary',
            name: 'Primary',
            background: tokens.colors.primary,
            foreground: '#ffffff',
            border: 'transparent',
            hoverBackground: tokens.colors.primaryScale[600] || tokens.colors.primary,
            hoverForeground: '#ffffff',
            activeBackground: tokens.colors.primaryScale[700] || tokens.colors.primary,
        },
        {
            id: 'secondary',
            name: 'Secondary',
            background: tokens.colors.secondary,
            foreground: '#ffffff',
            border: 'transparent',
            hoverBackground: tokens.colors.secondaryScale[600] || tokens.colors.secondary,
            hoverForeground: '#ffffff',
            activeBackground: tokens.colors.secondaryScale[700] || tokens.colors.secondary,
        },
        {
            id: 'outline',
            name: 'Outline',
            background: 'transparent',
            foreground: tokens.colors.primary,
            border: tokens.colors.primary,
            hoverBackground: tokens.colors.primary,
            hoverForeground: '#ffffff',
            activeBackground: tokens.colors.primaryScale[700] || tokens.colors.primary,
        },
        {
            id: 'ghost',
            name: 'Ghost',
            background: 'transparent',
            foreground: tokens.colors.foreground,
            border: 'transparent',
            hoverBackground: tokens.colors.muted,
            hoverForeground: tokens.colors.foreground,
            activeBackground: tokens.colors.mutedScale[200] || tokens.colors.muted,
        },
    ]);

    const [sizes, setSizes] = useState<ButtonSize[]>([
        { id: 'sm', name: 'Small', padding: '0.5rem 1rem', fontSize: '0.875rem', height: '2rem' },
        { id: 'md', name: 'Medium', padding: '0.75rem 1.5rem', fontSize: '1rem', height: '2.5rem' },
        { id: 'lg', name: 'Large', padding: '1rem 2rem', fontSize: '1.125rem', height: '3rem' },
        { id: 'xl', name: 'Extra Large', padding: '1.25rem 2.5rem', fontSize: '1.25rem', height: '3.5rem' },
    ]);

    const [config, setConfig] = useState({
        rounded: true,
        iconSupport: true,
        loadingState: true,
        disabledState: true,
        fullWidth: false,
    });

    const generateReactCode = () => {
        return `import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: '${variants.map((v) => v.id).join("' | '")}';
  size?: '${sizes.map((s) => s.id).join("' | '")}';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      ${variants.map((v) => `${v.id}: 'bg-[${v.background}] text-[${v.foreground}] border-[${v.border}] hover:bg-[${v.hoverBackground}] hover:text-[${v.hoverForeground}]'`).join(',\n      ')}
    };

    const sizes = {
      ${sizes.map((s) => `${s.id}: 'h-[${s.height}] px-[${s.padding.split(' ')[1]}] text-[${s.fontSize}]'`).join(',\n      ')}
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-bold transition-all',
          'border ${config.rounded ? `rounded-[${tokens.radius}rem]` : ''}',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
`;
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateReactCode());
    };

    const currentVariant = variants.find((v) => v.id === selectedVariant);
    const currentSize = sizes.find((s) => s.id === selectedSize);

    const getButtonStyle = (state: string = 'default') => {
        if (!currentVariant || !currentSize) return {};

        const baseStyle = {
            background: currentVariant.background,
            color: currentVariant.foreground,
            border: `2px solid ${currentVariant.border}`,
            padding: currentSize.padding,
            fontSize: currentSize.fontSize,
            height: currentSize.height,
            borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
            fontWeight: 700,
            transition: 'all 200ms ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
        };

        if (state === 'hover') {
            return {
                ...baseStyle,
                background: currentVariant.hoverBackground,
                color: currentVariant.hoverForeground,
            };
        }

        if (state === 'active') {
            return {
                ...baseStyle,
                background: currentVariant.activeBackground,
                color: currentVariant.hoverForeground,
            };
        }

        if (state === 'disabled') {
            return {
                ...baseStyle,
                opacity: 0.5,
                cursor: 'not-allowed',
            };
        }

        return baseStyle;
    };

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Component className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Button Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
                                Component Workbench
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="variants" className="text-xs">Variants</TabsTrigger>
                                <TabsTrigger value="sizes" className="text-xs">Sizes</TabsTrigger>
                                <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
                            </TabsList>

                            <TabsContent value="variants" className="space-y-6 mt-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                            Variants
                                        </Label>
                                        <Button size="sm" variant="ghost" className="h-7 gap-1.5">
                                            <Plus className="w-3 h-3" />
                                            Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant.id)}
                                                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedVariant === variant.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold">{variant.name}</span>
                                                    <div className="flex gap-1">
                                                        <div
                                                            className="w-4 h-4 rounded border"
                                                            style={{ background: variant.background }}
                                                        />
                                                        <div
                                                            className="w-4 h-4 rounded border"
                                                            style={{ background: variant.foreground }}
                                                        />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {currentVariant && (
                                    <>
                                        <Separator />
                                        <div className="space-y-4">
                                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                                Edit {currentVariant.name}
                                            </Label>

                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Background</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="color"
                                                            value={currentVariant.background}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, background: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="w-12 h-9 p-1"
                                                        />
                                                        <Input
                                                            value={currentVariant.background}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, background: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="flex-1 h-9 font-mono text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs">Foreground</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="color"
                                                            value={currentVariant.foreground}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, foreground: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="w-12 h-9 p-1"
                                                        />
                                                        <Input
                                                            value={currentVariant.foreground}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, foreground: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="flex-1 h-9 font-mono text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs">Hover Background</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="color"
                                                            value={currentVariant.hoverBackground}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, hoverBackground: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="w-12 h-9 p-1"
                                                        />
                                                        <Input
                                                            value={currentVariant.hoverBackground}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, hoverBackground: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="flex-1 h-9 font-mono text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="sizes" className="space-y-6 mt-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Size Presets
                                    </Label>
                                    <div className="space-y-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSize(size.id)}
                                                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedSize === size.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold">{size.name}</span>
                                                    <span className="text-xs font-mono text-muted-foreground">
                                                        {size.height}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="config" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Component Options
                                    </Label>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Rounded Corners</Label>
                                            <Switch
                                                checked={config.rounded}
                                                onCheckedChange={(checked) => setConfig({ ...config, rounded: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Icon Support</Label>
                                            <Switch
                                                checked={config.iconSupport}
                                                onCheckedChange={(checked) => setConfig({ ...config, iconSupport: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Loading State</Label>
                                            <Switch
                                                checked={config.loadingState}
                                                onCheckedChange={(checked) => setConfig({ ...config, loadingState: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Disabled State</Label>
                                            <Switch
                                                checked={config.disabledState}
                                                onCheckedChange={(checked) =>
                                                    setConfig({ ...config, disabledState: checked })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>

                <div className="border-t p-4 space-y-2">
                    <Button onClick={copyCode} variant="outline" className="w-full gap-2">
                        <Copy className="w-4 h-4" />
                        Copy React Code
                    </Button>
                    <Button className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Export Component
                    </Button>
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-card/30">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Live Preview
                    </h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* Interactive Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Interactive Preview
                            </h4>
                            <div className="flex items-center justify-center p-16 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
                                <button style={getButtonStyle()}>Click Me</button>
                            </div>
                        </div>

                        <Separator />

                        {/* States */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                States
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Default
                                    </p>
                                    <button style={getButtonStyle('default')}>Button</button>
                                </div>

                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Hover
                                    </p>
                                    <button style={getButtonStyle('hover')}>Button</button>
                                </div>

                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Active
                                    </p>
                                    <button style={getButtonStyle('active')}>Button</button>
                                </div>

                                <div className="p-6 border rounded-xl bg-card space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Disabled
                                    </p>
                                    <button style={getButtonStyle('disabled')}>Button</button>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* All Variants */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                All Variants
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {variants.map((variant) => (
                                    <div key={variant.id} className="p-6 border rounded-xl bg-card space-y-3">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {variant.name}
                                        </p>
                                        <button
                                            style={{
                                                background: variant.background,
                                                color: variant.foreground,
                                                border: `2px solid ${variant.border}`,
                                                padding: currentSize?.padding,
                                                fontSize: currentSize?.fontSize,
                                                height: currentSize?.height,
                                                borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {variant.name} Button
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* All Sizes */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                All Sizes
                            </h4>
                            <div className="space-y-4">
                                {sizes.map((size) => (
                                    <div key={size.id} className="flex items-center gap-6">
                                        <span className="text-xs font-bold text-muted-foreground w-24">
                                            {size.name}
                                        </span>
                                        <button
                                            style={{
                                                background: currentVariant?.background,
                                                color: currentVariant?.foreground,
                                                border: `2px solid ${currentVariant?.border}`,
                                                padding: size.padding,
                                                fontSize: size.fontSize,
                                                height: size.height,
                                                borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {size.name} Button
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Code Preview */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                    Generated Code
                                </h4>
                                <Button size="sm" variant="ghost" onClick={copyCode} className="gap-2">
                                    <Copy className="w-3 h-3" />
                                    Copy
                                </Button>
                            </div>
                            <pre className="text-xs font-mono bg-muted p-6 rounded-xl overflow-x-auto max-h-96 overflow-y-auto">
                                {generateReactCode()}
                            </pre>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default ButtonComponentBuilder;
