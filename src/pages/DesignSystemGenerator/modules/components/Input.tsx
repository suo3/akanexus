import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Type, Copy, Download, Search, Mail, Lock, Hash, AlertCircle } from 'lucide-react';
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
        rounded: false,
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
        const props = [
            `variant?: '${variants.map((v) => v.id).join("' | '")}'`,
            `size?: '${sizes.map((s) => s.id).join("' | '")}'`,
        ];

        if (config.label) props.push('label?: string');
        if (config.helperText) props.push('helperText?: string');
        if (config.errorState) props.push('error?: string');
        if (config.leftIcon) props.push('leftIcon?: React.ReactNode');
        if (config.rightIcon) props.push('rightIcon?: React.ReactNode');

        const destructuring = [
            "className",
            "variant = 'default'",
            "size = 'md'",
            config.label ? "label" : "",
            config.helperText ? "helperText" : "",
            config.errorState ? "error" : "",
            config.leftIcon ? "leftIcon" : "",
            config.rightIcon ? "rightIcon" : "",
            "disabled",
            "...props"
        ].filter(Boolean).join(",\n    ");

        return `import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ${props.join(';\n  ')};
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    ${destructuring}
  }, ref) => {
    const variants = {
      ${variants.map((v) => `${v.id}: 'border-[${v.border}] bg-[${v.background}] focus:border-[${v.focusBorder}] focus:ring-[${v.focusRing}]'`).join(',\n      ')}
    };

    const sizes = {
      ${sizes.map((s) => `${s.id}: 'h-[${s.height}] px-[${s.padding.split(' ')[1]}] text-[${s.fontSize}]'`).join(',\n      ')}
    };

    return (
      <div className="w-full">
        ${config.label ? `{label && (
          <label className="block text-sm font-bold mb-2">
            {label}
          </label>
        )}` : ''}
        <div className="relative">
          ${config.leftIcon ? `{leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}` : ''}
          <input
            ref={ref}
            className={cn(
              'w-full border-2 transition-all outline-none',
              '${config.rounded ? `rounded-[${tokens.radius}rem]` : ''}',
              'focus:ring-4',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              ${config.leftIcon ? "leftIcon && 'pl-10'," : ''}
              ${config.rightIcon ? "rightIcon && 'pr-10'," : ''}
              ${config.errorState ? "error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'," : ''}
              variants[variant],
              sizes[size],
              className
            )}
            disabled={disabled}
            {...props}
          />
          ${config.rightIcon ? `{rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}` : ''}
        </div>
        ${config.errorState ? `{error ? (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        ) : ${config.helperText ? `helperText ? (
          <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
        ) : null` : 'null'}}` : config.helperText ? `{helperText && (
          <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
        )}` : ''}
      </div>
    );
  }
);

Input.displayName = 'Input';
`;
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(generateReactCode());
            console.log('Code copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy code:', err);
            const textArea = document.createElement('textarea');
            textArea.value = generateReactCode();
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                console.log('Code copied using fallback method!');
            } catch (fallbackErr) {
                console.error('Fallback copy also failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    };

    const exportComponent = () => {
        const code = generateReactCode();
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Input.tsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                        <div className="w-9 h-9 rounded-none bg-primary/10 flex items-center justify-center">
                            <Type className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight uppercase">INPUT_COMPILER</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
                                COMPONENT_v2.0
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full rounded-none">
                                <TabsTrigger value="variants" className="text-xs rounded-none mono-label uppercase">VARIANTS</TabsTrigger>
                                <TabsTrigger value="sizes" className="text-xs rounded-none mono-label uppercase">SIZES</TabsTrigger>
                                <TabsTrigger value="config" className="text-xs rounded-none mono-label uppercase">CONFIG</TabsTrigger>
                            </TabsList>

                            <TabsContent value="variants" className="space-y-6 mt-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mono-label">
                                        INPUT_TYPE
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {inputTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`p-3 rounded-none border-2 transition-all ${selectedType === type.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4 mx-auto mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest mono-label">{type.name}</span>
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
                    <Button onClick={copyCode} variant="outline" className="w-full gap-2 rounded-none mono-label text-xs uppercase">
                        <Copy className="w-4 h-4" />
                        COPY_REACT_SRC
                    </Button>
                    <Button onClick={exportComponent} className="w-full gap-2 rounded-none mono-label text-xs uppercase">
                        <Download className="w-4 h-4" />
                        EXPORT_ENTITY
                    </Button>
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-muted/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono-label">
                        INPUT_PREVIEW_PORT
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
                                            ...getInputStyle(config.errorState ? 'error' : 'default'),
                                            paddingLeft: config.leftIcon ? '2.5rem' : currentSize?.padding.split(' ')[1],
                                            paddingRight: config.rightIcon ? '2.5rem' : currentSize?.padding.split(' ')[1],
                                        }}
                                    />
                                    {config.rightIcon && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                {config.errorState ? (
                                    <p className="text-sm text-red-500 mt-1">Invalid email address</p>
                                ) : config.helperText ? (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        We'll never share your {selectedType}.
                                    </p>
                                ) : null}
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
                            <pre className="text-xs font-mono bg-muted/50 p-6 rounded-none border border-dashed overflow-x-auto max-h-96 overflow-y-auto mono-label">
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
