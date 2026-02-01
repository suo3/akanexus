import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Type, Copy, Download, Search, Mail, Lock, Hash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface InputVariant {
    id: string;
    name: string;
    border: string;
    background: string;
    focusBorder: string;
    focusRing: string;
}

interface InputSize {
    id: string;
    name: string;
    height: string;
    padding: string;
    fontSize: string;
}

const InputComponentBuilder = () => {
    const { tokens, typography } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('variants');
    const [selectedVariant, setSelectedVariant] = useState('default');
    const [selectedSize, setSelectedSize] = useState('md');
    const [selectedType, setSelectedType] = useState('text');

    const [variants, setVariants] = useState<InputVariant[]>([
        {
            id: 'default',
            name: 'Default',
            border: tokens.colors.border,
            background: tokens.colors.background,
            focusBorder: tokens.colors.primary,
            focusRing: `${tokens.colors.primary}33`,
        },
        {
            id: 'filled',
            name: 'Filled',
            border: 'transparent',
            background: tokens.colors.muted,
            focusBorder: tokens.colors.primary,
            focusRing: `${tokens.colors.primary}33`,
        },
        {
            id: 'flushed',
            name: 'Flushed',
            border: 'transparent',
            background: 'transparent',
            focusBorder: tokens.colors.primary,
            focusRing: 'transparent',
        },
    ]);

    const [sizes, setSizes] = useState<InputSize[]>([
        { id: 'sm', name: 'Small', height: '2rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
        { id: 'md', name: 'Medium', height: '2.5rem', padding: '0.75rem 1rem', fontSize: '1rem' },
        { id: 'lg', name: 'Large', height: '3rem', padding: '1rem 1.25rem', fontSize: '1.125rem' },
        { id: 'xl', name: 'Extra Large', height: '3.5rem', padding: '1.25rem 1.5rem', fontSize: '1.25rem' },
    ]);

    const [config, setConfig] = useState({
        rounded: true,
        leftIcon: true,
        rightIcon: false,
        label: true,
        helperText: true,
        errorState: true,
        disabledState: true,
    });

    const inputTypes = [
        { id: 'text', name: 'Text', icon: Type },
        { id: 'email', name: 'Email', icon: Mail },
        { id: 'password', name: 'Password', icon: Lock },
        { id: 'number', name: 'Number', icon: Hash },
        { id: 'search', name: 'Search', icon: Search },
    ];

    const generateReactCode = () => {
        return `import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: '${variants.map((v) => v.id).join("' | '")}';
  size?: '${sizes.map((s) => s.id).join("' | '")}';
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    label,
    helperText,
    error,
    leftIcon, 
    rightIcon, 
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      ${variants.map((v) => `${v.id}: 'border-[${v.border}] bg-[${v.background}] focus:border-[${v.focusBorder}] focus:ring-[${v.focusRing}]'`).join(',\n      ')}
    };

    const sizes = {
      ${sizes.map((s) => `${s.id}: 'h-[${s.height}] px-[${s.padding.split(' ')[1]}] text-[${s.fontSize}]'`).join(',\n      ')}
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full border-2 transition-all outline-none',
              '${config.rounded ? `rounded-[${tokens.radius}rem]` : ''}',
              'focus:ring-4',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              variants[variant],
              sizes[size],
              className
            )}
            disabled={disabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
`;
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateReactCode());
    };

    const currentVariant = variants.find((v) => v.id === selectedVariant);
    const currentSize = sizes.find((s) => s.id === selectedSize);
    const currentType = inputTypes.find((t) => t.id === selectedType);

    const getInputStyle = (state: string = 'default') => {
        if (!currentVariant || !currentSize) return {};

        const baseStyle = {
            border: `2px solid ${currentVariant.border}`,
            background: currentVariant.background,
            padding: currentSize.padding,
            fontSize: currentSize.fontSize,
            height: currentSize.height,
            borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
            transition: 'all 200ms ease',
            outline: 'none',
            width: '100%',
        };

        if (state === 'focus') {
            return {
                ...baseStyle,
                border: `2px solid ${currentVariant.focusBorder}`,
                boxShadow: `0 0 0 4px ${currentVariant.focusRing}`,
            };
        }

        if (state === 'error') {
            return {
                ...baseStyle,
                border: '2px solid #ef4444',
                boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.2)',
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
                            <Type className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Input Builder</h2>
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
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Input Type
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {inputTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`p-3 rounded-lg border-2 transition-all ${selectedType === type.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4 mx-auto mb-1" />
                                                    <span className="text-xs font-bold">{type.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Style Variants
                                    </Label>
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
                                                <span className="text-sm font-bold">{variant.name}</span>
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
                                                    <Label className="text-xs">Border Color</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="color"
                                                            value={currentVariant.border}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, border: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="w-12 h-9 p-1"
                                                        />
                                                        <Input
                                                            value={currentVariant.border}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, border: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="flex-1 h-9 font-mono text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs">Focus Border</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="color"
                                                            value={currentVariant.focusBorder}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, focusBorder: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="w-12 h-9 p-1"
                                                        />
                                                        <Input
                                                            value={currentVariant.focusBorder}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, focusBorder: e.target.value } : v
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
                                            <Label className="text-sm">Left Icon</Label>
                                            <Switch
                                                checked={config.leftIcon}
                                                onCheckedChange={(checked) => setConfig({ ...config, leftIcon: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Right Icon</Label>
                                            <Switch
                                                checked={config.rightIcon}
                                                onCheckedChange={(checked) => setConfig({ ...config, rightIcon: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Label</Label>
                                            <Switch
                                                checked={config.label}
                                                onCheckedChange={(checked) => setConfig({ ...config, label: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Helper Text</Label>
                                            <Switch
                                                checked={config.helperText}
                                                onCheckedChange={(checked) => setConfig({ ...config, helperText: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Error State</Label>
                                            <Switch
                                                checked={config.errorState}
                                                onCheckedChange={(checked) => setConfig({ ...config, errorState: checked })}
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
                            <div className="max-w-md">
                                {config.label && (
                                    <label className="block text-sm font-bold mb-2">Email Address</label>
                                )}
                                <div className="relative">
                                    {config.leftIcon && currentType && (
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {React.createElement(currentType.icon, { className: 'w-4 h-4' })}
                                        </div>
                                    )}
                                    <input
                                        type={selectedType}
                                        placeholder={`Enter your ${selectedType}...`}
                                        style={{
                                            ...getInputStyle(),
                                            paddingLeft: config.leftIcon ? '2.5rem' : currentSize?.padding.split(' ')[1],
                                            paddingRight: config.rightIcon ? '2.5rem' : currentSize?.padding.split(' ')[1],
                                        }}
                                    />
                                </div>
                                {config.helperText && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        We'll never share your {selectedType}.
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* States */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                States
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Default
                                    </p>
                                    <input
                                        type={selectedType}
                                        placeholder="Default state"
                                        style={getInputStyle('default')}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Focus
                                    </p>
                                    <input
                                        type={selectedType}
                                        placeholder="Focus state"
                                        style={getInputStyle('focus')}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Error
                                    </p>
                                    <input
                                        type={selectedType}
                                        placeholder="Error state"
                                        style={getInputStyle('error')}
                                    />
                                    <p className="text-sm text-red-500">This field is required</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Disabled
                                    </p>
                                    <input
                                        type={selectedType}
                                        placeholder="Disabled state"
                                        disabled
                                        style={getInputStyle('disabled')}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* All Variants */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                All Variants
                            </h4>
                            <div className="space-y-4">
                                {variants.map((variant) => (
                                    <div key={variant.id} className="space-y-2">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {variant.name}
                                        </p>
                                        <input
                                            type={selectedType}
                                            placeholder={`${variant.name} variant`}
                                            style={{
                                                border: `2px solid ${variant.border}`,
                                                background: variant.background,
                                                padding: currentSize?.padding,
                                                fontSize: currentSize?.fontSize,
                                                height: currentSize?.height,
                                                borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
                                                transition: 'all 200ms ease',
                                                outline: 'none',
                                                width: '100%',
                                            }}
                                        />
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
                                    <div key={size.id} className="space-y-2">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {size.name}
                                        </p>
                                        <input
                                            type={selectedType}
                                            placeholder={`${size.name} size`}
                                            style={{
                                                border: `2px solid ${currentVariant?.border}`,
                                                background: currentVariant?.background,
                                                padding: size.padding,
                                                fontSize: size.fontSize,
                                                height: size.height,
                                                borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
                                                transition: 'all 200ms ease',
                                                outline: 'none',
                                                width: '100%',
                                            }}
                                        />
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

export default InputComponentBuilder;
