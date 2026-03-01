import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Copy, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface CardVariant {
    id: string;
    name: string;
    background: string;
    border: string;
    shadow: string;
}

const CardComponentBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('variants');
    const [selectedVariant, setSelectedVariant] = useState('default');

    const [variants, setVariants] = useState<CardVariant[]>([
        {
            id: 'default',
            name: 'Default',
            background: tokens.colors.background,
            border: tokens.colors.border,
            shadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
        },
        {
            id: 'elevated',
            name: 'Elevated',
            background: tokens.colors.background,
            border: 'transparent',
            shadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        },
        {
            id: 'outlined',
            name: 'Outlined',
            background: 'transparent',
            border: tokens.colors.border,
            shadow: 'none',
        },
        {
            id: 'filled',
            name: 'Filled',
            background: tokens.colors.muted,
            border: 'transparent',
            shadow: 'none',
        },
    ]);

    const [config, setConfig] = useState({
        header: true,
        footer: true,
        rounded: false,
        padding: true,
        dividers: true,
        hoverable: false,
        clickable: false,
    });

    const generateReactCode = () => {
        return `import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: '${variants.map((v) => v.id).join("' | '")}';
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable, clickable, children, ...props }, ref) => {
    const variants = {
      ${variants.map((v) => `${v.id}: 'bg-[${v.background}] border-[${v.border}]'`).join(',\n      ')}
    };

    const shadows = {
      ${variants.map((v) => `${v.id}: '${v.shadow}'`).join(',\n      ')}
    };

    return (
      <div
        ref={ref}
        className={cn(
          'border-2 ${config.rounded ? `rounded-[${tokens.radius}rem]` : ''}',
          '${config.padding ? 'p-6' : ''}',
          hoverable && 'transition-transform hover:scale-105',
          clickable && 'cursor-pointer',
          variants[variant],
          className
        )}
        style={{ boxShadow: shadows[variant] }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('${config.padding ? 'pb-4' : ''}', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-xl font-black tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('${config.padding ? 'py-4' : ''}', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('${config.padding ? 'pt-4' : ''} flex items-center gap-2', className)} {...props}>
    {children}
  </div>
);
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
        link.download = 'Card.tsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const currentVariant = variants.find((v) => v.id === selectedVariant);

    const getCardStyle = () => {
        if (!currentVariant) return {};

        return {
            background: currentVariant.background,
            border: `2px solid ${currentVariant.border}`,
            boxShadow: currentVariant.shadow,
            borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
            padding: config.padding ? '1.5rem' : '0',
        };
    };

    const getCardClassName = () => {
        return `${config.hoverable ? 'transition-transform hover:scale-105' : ''} ${config.clickable ? 'cursor-pointer' : ''}`;
    };

    return (
        <div className="h-full flex flex-col lg:flex-row">
            {/* Left Panel - Controls */}
            <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r flex flex-col bg-card/30 shrink-0">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-none bg-primary/10 flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight uppercase">CARD_COMPILER</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-90">
                                COMPONENT_v2.0
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-2 w-full rounded-none">
                                <TabsTrigger value="variants" className="text-xs rounded-none mono-label uppercase">VARIANTS</TabsTrigger>
                                <TabsTrigger value="config" className="text-xs rounded-none mono-label uppercase">CONFIG</TabsTrigger>
                            </TabsList>

                            <TabsContent value="variants" className="space-y-6 mt-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                        CARD_VARIANTS
                                    </Label>
                                    <div className="space-y-2">
                                        {variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant.id)}
                                                className={`w-full p-3 rounded-none border-2 transition-all text-left ${selectedVariant === variant.id
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
                                            <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                                EDIT_VARIANT: {currentVariant.id.toUpperCase()}
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
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-90 mono-label">HEX_COLOR</Label>
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
                                                            className="w-12 h-9 p-1 rounded-none"
                                                        />
                                                        <Input
                                                            value={currentVariant.border}
                                                            onChange={(e) => {
                                                                const updated = variants.map((v) =>
                                                                    v.id === selectedVariant ? { ...v, border: e.target.value } : v
                                                                );
                                                                setVariants(updated);
                                                            }}
                                                            className="flex-1 h-9 font-mono text-xs rounded-none mono-label"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-90 mono-label">SHADOW_VAL</Label>
                                                    <Input
                                                        value={currentVariant.shadow}
                                                        onChange={(e) => {
                                                            const updated = variants.map((v) =>
                                                                v.id === selectedVariant ? { ...v, shadow: e.target.value } : v
                                                            );
                                                            setVariants(updated);
                                                        }}
                                                        className="h-9 font-mono text-xs rounded-none mono-label"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="config" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-widest opacity-90 mono-label">
                                        CARD_SCHEMA
                                    </Label>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs uppercase mono-label opacity-90">HEADER_UNIT</Label>
                                            <Switch
                                                checked={config.header}
                                                onCheckedChange={(checked) => setConfig({ ...config, header: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Footer Section</Label>
                                            <Switch
                                                checked={config.footer}
                                                onCheckedChange={(checked) => setConfig({ ...config, footer: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Dividers</Label>
                                            <Switch
                                                checked={config.dividers}
                                                onCheckedChange={(checked) => setConfig({ ...config, dividers: checked })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-90">
                                        Styling Options
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
                                            <Label className="text-sm">Padding</Label>
                                            <Switch
                                                checked={config.padding}
                                                onCheckedChange={(checked) => setConfig({ ...config, padding: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Hoverable</Label>
                                            <Switch
                                                checked={config.hoverable}
                                                onCheckedChange={(checked) => setConfig({ ...config, hoverable: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Clickable</Label>
                                            <Switch
                                                checked={config.clickable}
                                                onCheckedChange={(checked) => setConfig({ ...config, clickable: checked })}
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
                <div className="border-b px-4 md:px-8 py-4 md:py-5 bg-muted/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono-label">
                        CARD_PREVIEW_PORT
                    </h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 md:p-12 space-y-12">
                        {/* Interactive Preview */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                INTERACTIVE_RENDER
                            </h4>
                            <div className="max-w-md">
                                <div style={getCardStyle()} className={getCardClassName()}>
                                    {config.header && (
                                        <>
                                            <div style={{ paddingBottom: config.padding ? '1rem' : '0' }}>
                                                <h3 className="text-xl font-black tracking-tight">Card Title</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Card description goes here
                                                </p>
                                            </div>
                                            {config.dividers && <hr className="border-t" />}
                                        </>
                                    )}

                                    <div style={{ padding: config.padding ? '1rem 0' : '0' }}>
                                        <p className="text-sm">
                                            This is the main content area of the card. You can put any content here
                                            including text, images, or other components.
                                        </p>
                                    </div>

                                    {config.footer && (
                                        <>
                                            {config.dividers && <hr className="border-t" />}
                                            <div
                                                style={{ paddingTop: config.padding ? '1rem' : '0' }}
                                                className="flex items-center gap-2"
                                            >
                                                <button className="px-4 py-2 bg-primary text-primary-foreground rounded font-bold text-sm">
                                                    Action
                                                </button>
                                                <button className="px-4 py-2 border-2 rounded font-bold text-sm">
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* All Variants */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                VARIANT_MATRIX
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {variants.map((variant) => (
                                    <div key={variant.id} className="space-y-3">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {variant.name}
                                        </p>
                                        <div
                                            className={getCardClassName()}
                                            style={{
                                                background: variant.background,
                                                border: `2px solid ${variant.border}`,
                                                boxShadow: variant.shadow,
                                                borderRadius: config.rounded ? `${tokens.radius}rem` : '0',
                                                padding: config.padding ? '1.5rem' : '0',
                                            }}
                                        >
                                            <h3 className="text-lg font-black">Card Title</h3>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {variant.name} card variant
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Use Cases */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                BEHAVIOR_PATTERNS
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div style={getCardStyle()} className={getCardClassName()}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/20" />
                                        <div>
                                            <h4 className="font-bold">User Profile</h4>
                                            <p className="text-xs text-muted-foreground">@username</p>
                                        </div>
                                    </div>
                                    <p className="text-sm">Bio information goes here...</p>
                                </div>

                                <div style={getCardStyle()} className={getCardClassName()}>
                                    <div className="aspect-video bg-muted border border-dashed rounded-none mb-3" />
                                    <h4 className="font-bold mb-1 mono-label uppercase">PROD_UNIT_404</h4>
                                    <p className="text-sm text-muted-foreground mb-3 font-mono">$99.99</p>
                                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-none font-bold text-xs uppercase tracking-widest mono-label">
                                        ADD_TO_CART
                                    </button>
                                </div>

                                <div style={getCardStyle()} className={getCardClassName()}>
                                    <h4 className="font-bold mb-2">Notification</h4>
                                    <p className="text-sm mb-3">You have a new message from John Doe</p>
                                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                </div>

                                <div style={getCardStyle()} className={getCardClassName()}>
                                    <h4 className="font-bold mb-2">Stats Card</h4>
                                    <p className="text-3xl font-black mb-1">1,234</p>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Code Preview */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90 mono-label">
                                    GENERATED_SRC
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

export default CardComponentBuilder;
