import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Tag, Copy, Download, Plus, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BadgeVariant {
    id: string;
    name: string;
    background: string;
    foreground: string;
    border: string;
}

const BadgeBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('variants');
    const [selectedVariant, setSelectedVariant] = useState('primary');

    const [variants, setVariants] = useState<BadgeVariant[]>([
        { id: 'primary', name: 'Primary', background: tokens.colors.primary + '20', foreground: tokens.colors.primary, border: tokens.colors.primary + '40' },
        { id: 'success', name: 'Success', background: '#22c55e20', foreground: '#16a34a', border: '#22c55e40' },
        { id: 'warning', name: 'Warning', background: '#f59e0b20', foreground: '#d97706', border: '#f59e0b40' },
        { id: 'danger', name: 'Danger', background: '#ef444420', foreground: '#dc2626', border: '#ef444440' },
        { id: 'neutral', name: 'Neutral', background: tokens.colors.muted, foreground: tokens.colors.foreground, border: tokens.colors.border },
    ]);

    const [config, setConfig] = useState({
        size: 'md' as 'sm' | 'md' | 'lg',
        style: 'soft' as 'soft' | 'solid' | 'outline',
        rounded: 'sm' as 'full' | 'md' | 'sm',
        removable: false,
        dotIndicator: false,
        uppercase: true,
    });

    const currentVariant = variants.find(v => v.id === selectedVariant)!;

    const sizeStyles = {
        sm: { padding: '0.125rem 0.5rem', fontSize: '0.65rem', height: '1.25rem' },
        md: { padding: '0.25rem 0.75rem', fontSize: '0.75rem', height: '1.5rem' },
        lg: { padding: '0.375rem 1rem', fontSize: '0.875rem', height: '1.75rem' },
    };

    const borderRadii = { full: '9999px', md: '0.5rem', sm: '0.25rem' };

    const getBadgeStyle = (v: BadgeVariant) => {
        const base = {
            padding: sizeStyles[config.size].padding,
            fontSize: sizeStyles[config.size].fontSize,
            height: sizeStyles[config.size].height,
            borderRadius: borderRadii[config.rounded],
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            letterSpacing: config.uppercase ? '0.05em' : 'normal',
            textTransform: config.uppercase ? 'uppercase' as const : 'none' as const,
            lineHeight: 1,
        };
        if (config.style === 'solid') return { ...base, background: v.foreground, color: '#fff', border: `1px solid transparent` };
        if (config.style === 'outline') return { ...base, background: 'transparent', color: v.foreground, border: `1.5px solid ${v.border}` };
        return { ...base, background: v.background, color: v.foreground, border: `1.5px solid ${v.border}` };
    };

    const generateReactCode = () => `import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface BadgeProps {
  variant?: '${variants.map(v => v.id).join("' | '")}';
  size?: 'sm' | 'md' | 'lg';
  style?: 'soft' | 'solid' | 'outline';
  removable?: boolean;
  dotIndicator?: boolean;
  children: React.ReactNode;
  onRemove?: () => void;
}

export const Badge = ({ variant = 'primary', size = 'md', style = 'soft', removable, dotIndicator, children, onRemove }: BadgeProps) => {
  const sizes = { sm: 'text-[10px] px-2 py-0.5 h-5', md: 'text-xs px-3 py-1 h-6', lg: 'text-sm px-4 py-1.5 h-7' };
  const variants = {
${variants.map(v => `    ${v.id}: { soft: 'bg-[${v.background}] text-[${v.foreground}] border-[${v.border}]', solid: 'bg-[${v.foreground}] text-white border-transparent', outline: 'bg-transparent text-[${v.foreground}] border-[${v.border}]' }`).join(',\n')}
  };
  const styleClass = variants[variant]?.[style] ?? variants.primary.soft;
  return (
    <span className={cn('inline-flex items-center gap-1 border font-bold rounded-${config.rounded}', sizes[size], styleClass${config.uppercase ? ", 'uppercase tracking-wider'" : ''})}>
      {dotIndicator && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
      {removable && <button onClick={onRemove} className="ml-0.5 opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>}
    </span>
  );
};
`;

    const copyCode = async () => {
        try { await navigator.clipboard.writeText(generateReactCode()); }
        catch { const t = document.createElement('textarea'); t.value = generateReactCode(); document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
    };

    const exportComponent = () => {
        const blob = new Blob([generateReactCode()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'Badge.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const sampleLabels = ['New', 'Beta', 'Pro', 'Sale', 'Hot'];

    return (
        <div className="h-full flex overflow-hidden">
            {/* Left Panel */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-none bg-primary/10 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight uppercase">TAG_COMPILER</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">COMPONENT_v2.0</p>
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
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mono-label">TAG_VARIANTS</Label>
                                        <Button size="sm" variant="ghost" className="h-7 gap-1.5" onClick={() => {
                                            const id = `variant-${Date.now()}`;
                                            setVariants([...variants, { id, name: `Variant ${variants.length + 1}`, background: tokens.colors.primary + '20', foreground: tokens.colors.primary, border: tokens.colors.primary + '40' }]);
                                        }}>
                                            <Plus className="w-3 h-3" />Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {variants.map(v => (
                                            <button key={v.id} onClick={() => setSelectedVariant(v.id)}
                                                className={`w-full p-3 rounded-none border-2 transition-all text-left flex items-center justify-between ${selectedVariant === v.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                                <span className="text-sm font-bold mono-label uppercase">{v.name}</span>
                                                <span style={getBadgeStyle(v)} className="shrink-0">{v.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {currentVariant && (
                                    <>
                                        <Separator />
                                        <div className="space-y-4">
                                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Edit {currentVariant.name}</Label>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Background', key: 'background' as const },
                                                    { label: 'Text Color', key: 'foreground' as const },
                                                    { label: 'Border Color', key: 'border' as const },
                                                ].map(({ label, key }) => (
                                                    <div key={key} className="space-y-2">
                                                        <Label className="text-xs">{label}</Label>
                                                        <div className="flex gap-2">
                                                            <Input type="color" value={currentVariant[key]} onChange={e => setVariants(variants.map(v => v.id === selectedVariant ? { ...v, [key]: e.target.value } : v))} className="w-12 h-9 p-1" />
                                                            <Input value={currentVariant[key]} onChange={e => setVariants(variants.map(v => v.id === selectedVariant ? { ...v, [key]: e.target.value } : v))} className="flex-1 h-9 font-mono text-xs" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="config" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Appearance</Label>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Style</Label>
                                            <Select value={config.style} onValueChange={(v: 'soft' | 'solid' | 'outline') => setConfig({ ...config, style: v })}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="soft">Soft</SelectItem>
                                                    <SelectItem value="solid">Solid</SelectItem>
                                                    <SelectItem value="outline">Outline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Size</Label>
                                            <Select value={config.size} onValueChange={(v: 'sm' | 'md' | 'lg') => setConfig({ ...config, size: v })}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sm">Small</SelectItem>
                                                    <SelectItem value="md">Medium</SelectItem>
                                                    <SelectItem value="lg">Large</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Border Radius</Label>
                                            <Select value={config.rounded} onValueChange={(v: 'full' | 'md' | 'sm') => setConfig({ ...config, rounded: v })}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="full">Pill (Full)</SelectItem>
                                                    <SelectItem value="md">Rounded</SelectItem>
                                                    <SelectItem value="sm">Sharp</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Options</Label>
                                    {[
                                        { label: 'Removable (×)', key: 'removable' as const },
                                        { label: 'Dot Indicator', key: 'dotIndicator' as const },
                                        { label: 'Uppercase Text', key: 'uppercase' as const },
                                    ].map(({ label, key }) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <Label className="text-sm">{label}</Label>
                                            <Switch checked={config[key]} onCheckedChange={c => setConfig({ ...config, [key]: c })} />
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>

                <div className="border-t p-4 space-y-2">
                    <Button onClick={copyCode} variant="outline" className="w-full gap-2 rounded-none mono-label text-xs uppercase"><Copy className="w-4 h-4" />COPY_REACT_SRC</Button>
                    <Button onClick={exportComponent} className="w-full gap-2 rounded-none mono-label text-xs uppercase"><Download className="w-4 h-4" />EXPORT_ENTITY</Button>
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-muted/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono-label">TAG_PREVIEW_PORT</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* All Variants */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Variants</h4>
                            <div className="flex flex-wrap gap-3">
                                {variants.map(v => (
                                    <span key={v.id} style={getBadgeStyle(v)}>
                                        {config.dotIndicator && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />}
                                        {v.name}
                                        {config.removable && <X style={{ width: 12, height: 12, opacity: 0.7 }} />}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Style Comparison */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Style Comparison</h4>
                            <div className="space-y-4">
                                {(['soft', 'solid', 'outline'] as const).map(style => (
                                    <div key={style} className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-muted-foreground w-16 capitalize">{style}</span>
                                        <div className="flex flex-wrap gap-2">
                                            {variants.map(v => {
                                                const s = { ...getBadgeStyle(v) };
                                                if (style === 'solid') { s.background = v.foreground; s.color = '#fff'; s.border = '1.5px solid transparent'; }
                                                else if (style === 'outline') { s.background = 'transparent'; s.color = v.foreground; s.border = `1.5px solid ${v.border}`; }
                                                return <span key={v.id} style={s}>{v.name}</span>;
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Real-world examples */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Real-World Usage</h4>
                            <div className="space-y-4">
                                <div className="p-4 border rounded-none bg-muted/5 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold uppercase tracking-tight">PREMIUM_PLAN</span>
                                            <span style={getBadgeStyle(variants[0])}>PRO</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mono-label uppercase">UNLIM_PROJECTS_v1</p>
                                    </div>
                                    <span style={getBadgeStyle(variants[1])}>ACTIVE</span>
                                </div>
                                <div className="p-4 border rounded-none bg-muted/5 flex flex-wrap gap-2">
                                    {sampleLabels.map((l, i) => (
                                        <span key={l} style={getBadgeStyle(variants[i % variants.length])}>
                                            {config.dotIndicator && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />}
                                            {l}
                                            {config.removable && <X style={{ width: 12, height: 12, opacity: 0.7, cursor: 'pointer' }} />}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Code */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Generated Code</h4>
                                <Button size="sm" variant="ghost" onClick={copyCode} className="gap-2"><Copy className="w-3 h-3" />Copy</Button>
                            </div>
                            <pre className="text-xs font-mono bg-muted/50 p-6 rounded-none border border-dashed overflow-x-auto max-h-96 overflow-y-auto mono-label">{generateReactCode()}</pre>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default BadgeBuilder;
