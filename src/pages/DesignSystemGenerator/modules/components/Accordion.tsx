import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Copy, Download, Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { cn } from '@/lib/utils';

interface AccordionItem {
    id: string;
    title: string;
    content: string;
    icon: string;
    disabled: boolean;
}

const AccordionBuilder = () => {
    const { tokens } = useDesignSystemStore();

    const [config, setConfig] = useState({
        variant: 'default' as 'default' | 'bordered' | 'card' | 'ghost',
        size: 'md' as 'sm' | 'md' | 'lg',
        multiple: false,
        showIcons: true,
        animateChevron: true,
        flush: false,
    });

    const [items, setItems] = useState<AccordionItem[]>([
        { id: '1', title: 'What is a Design System?', content: 'A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.', icon: '🎨', disabled: false },
        { id: '2', title: 'Why use design tokens?', content: 'Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes.', icon: '🪙', disabled: false },
        { id: '3', title: 'How do I export components?', content: 'Use the Export button in the top toolbar or the Export Project page under Developer to download your full component library as a zip.', icon: '📦', disabled: false },
        { id: '4', title: 'Can I customize themes?', content: 'Yes! Head to the Foundation section to customize colors, typography, spacing, motion, and shadows. All changes reflect live across every component preview.', icon: '⚙️', disabled: false },
    ]);

    const [openIds, setOpenIds] = useState<Set<string>>(new Set(['1']));

    const toggle = (id: string) => {
        if (config.multiple) {
            setOpenIds(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
        } else {
            setOpenIds(s => s.has(id) ? new Set() : new Set([id]));
        }
    };

    const sizes = {
        sm: { trigger: 'px-3 py-2.5 text-sm', content: 'px-3 pb-3 text-xs', iconSize: 16, chevron: 14 },
        md: { trigger: 'px-4 py-3.5 text-sm', content: 'px-4 pb-4 text-sm', iconSize: 18, chevron: 16 },
        lg: { trigger: 'px-5 py-4 text-base', content: 'px-5 pb-5 text-sm', iconSize: 20, chevron: 18 },
    };
    const sz = sizes[config.size];
    const radius = `${tokens.radius * 0.5}rem`;

    const getWrapperClass = (variant = config.variant) => cn(
        'overflow-hidden',
        variant === 'bordered' && 'border border-border rounded-xl divide-y divide-border',
        variant === 'card' && 'space-y-2',
        variant === 'ghost' && 'space-y-1',
        variant === 'default' && !config.flush && 'border border-border rounded-xl divide-y divide-border',
        config.flush && variant === 'default' && 'border-t border-b border-border divide-y divide-border',
    );

    const getItemClass = (variant = config.variant) => cn(
        variant === 'card' && 'border border-border rounded-xl overflow-hidden shadow-sm',
        variant === 'ghost' && 'rounded-xl overflow-hidden',
    );

    const getTriggerStyle = (isOpen: boolean, isDisabled: boolean): React.CSSProperties => ({
        display: 'flex', alignItems: 'center', width: '100%',
        gap: 10, cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.4 : 1, border: 'none',
        background: isOpen
            ? (config.variant === 'ghost' ? tokens.colors.primary + '10' : 'var(--muted)')
            : 'transparent',
        fontWeight: isOpen ? 700 : 500,
        transition: 'all 0.15s',
    });

    const generateReactCode = () => `import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem { id: string; title: string; content: string; icon?: string; disabled?: boolean; }
interface AccordionProps {
  items: AccordionItem[];
  variant?: 'default' | 'bordered' | 'card' | 'ghost';
  multiple?: boolean;
  defaultOpen?: string[];
}

export const Accordion = ({ items, variant = '${config.variant}', multiple, defaultOpen = [] }: AccordionProps) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpenIds(s => {
      const n = new Set(multiple ? s : []);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className={cn('overflow-hidden', variant === 'default' && 'border border-border rounded-xl divide-y divide-border', variant === 'bordered' && 'border border-border rounded-xl divide-y divide-border', variant === 'card' && 'space-y-2', variant === 'ghost' && 'space-y-1')}>
      {items.map(item => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className={cn(variant === 'card' && 'border border-border rounded-xl overflow-hidden', variant === 'ghost' && 'rounded-xl overflow-hidden')}>
            <button onClick={() => !item.disabled && toggle(item.id)} disabled={item.disabled}
              className={cn('flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-all', isOpen ? 'bg-muted font-bold' : 'bg-transparent hover:bg-muted/50', item.disabled && 'opacity-40 cursor-not-allowed')}>
              {item.icon && <span className="shrink-0 text-base">{item.icon}</span>}
              <span className="flex-1">{item.title}</span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-1 duration-150">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
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
        const a = document.createElement('a'); a.href = url; a.download = 'Accordion.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const renderPreview = (variant = config.variant, openOverride?: Set<string>, onToggle?: (id: string) => void) => {
        const o = openOverride ?? openIds;
        const t = onToggle ?? toggle;
        const previewItems = items.slice(0, 3);

        return (
            <div className={getWrapperClass(variant)} style={{ borderRadius: variant !== 'ghost' && variant !== 'card' ? radius : undefined }}>
                {previewItems.map((item, i) => {
                    const isOpen = o.has(item.id);
                    return (
                        <div key={item.id} className={getItemClass(variant)} style={{ borderRadius: (variant === 'card' || variant === 'ghost') ? radius : undefined }}>
                            <button
                                className={cn('w-full text-left', sz.trigger)}
                                style={getTriggerStyle(isOpen, item.disabled)}
                                onClick={() => !item.disabled && t(item.id)}
                                disabled={item.disabled}
                            >
                                {config.showIcons && item.icon && (
                                    <span style={{ fontSize: sz.iconSize, flexShrink: 0 }}>{item.icon}</span>
                                )}
                                <span style={{ flex: 1 }}>{item.title}</span>
                                <ChevronDown
                                    style={{
                                        width: sz.chevron, height: sz.chevron, flexShrink: 0,
                                        color: 'var(--muted-foreground)',
                                        transition: 'transform 0.2s',
                                        transform: isOpen && config.animateChevron ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                />
                            </button>
                            {isOpen && (
                                <div className={sz.content} style={{ color: 'var(--muted-foreground)', lineHeight: 1.65 }}>
                                    {item.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="h-full flex overflow-hidden">
            {/* Left panel */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ChevronDown className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Accordion Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-90">Component Workbench</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">

                        {/* Appearance */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Appearance</Label>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs">Variant</Label>
                                    <Select value={config.variant} onValueChange={v => setConfig({ ...config, variant: v as typeof config.variant })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['default', 'bordered', 'card', 'ghost'].map(o => (
                                                <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Size</Label>
                                    <Select value={config.size} onValueChange={v => setConfig({ ...config, size: v as typeof config.size })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['sm', 'md', 'lg'].map(o => (
                                                <SelectItem key={o} value={o} className="uppercase">{o}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Options */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Options</Label>
                            {([
                                { label: 'Allow Multiple Open', key: 'multiple' },
                                { label: 'Show Icons', key: 'showIcons' },
                                { label: 'Animate Chevron', key: 'animateChevron' },
                                { label: 'Flush (no rounded corners)', key: 'flush' },
                            ] as { label: string; key: keyof typeof config }[]).map(({ label, key }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <Label className="text-sm">{label}</Label>
                                    <Switch
                                        checked={config[key] as boolean}
                                        onCheckedChange={c => setConfig({ ...config, [key]: c })}
                                    />
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Items */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Items</Label>
                                <Button size="sm" variant="ghost" className="h-7 gap-1.5" onClick={() =>
                                    setItems([...items, { id: Date.now().toString(), title: `New Item ${items.length + 1}`, content: 'Add your content here.', icon: '📌', disabled: false }])
                                }>
                                    <Plus className="w-3 h-3" />Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {items.map((item, i) => (
                                    <div key={item.id} className="p-3 rounded-lg border space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={item.icon}
                                                onChange={e => setItems(items.map((it, j) => j === i ? { ...it, icon: e.target.value } : it))}
                                                className="h-7 w-12 text-center px-1 text-base"
                                            />
                                            <Input
                                                value={item.title}
                                                onChange={e => setItems(items.map((it, j) => j === i ? { ...it, title: e.target.value } : it))}
                                                className="h-7 flex-1 text-sm font-bold"
                                                placeholder="Title"
                                            />
                                            <Button
                                                size="sm" variant="ghost"
                                                className="h-7 w-7 p-0 text-destructive shrink-0"
                                                onClick={() => setItems(items.filter((_, j) => j !== i))}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <Input
                                            value={item.content}
                                            onChange={e => setItems(items.map((it, j) => j === i ? { ...it, content: e.target.value } : it))}
                                            className="h-7 text-xs"
                                            placeholder="Content"
                                        />
                                        <div className="flex items-center gap-1.5">
                                            <Label className="text-xs">Disabled</Label>
                                            <Switch
                                                checked={item.disabled}
                                                onCheckedChange={c => setItems(items.map((it, j) => j === i ? { ...it, disabled: c } : it))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="border-t p-4 space-y-2">
                    <Button onClick={copyCode} variant="outline" className="w-full gap-2"><Copy className="w-4 h-4" />Copy React Code</Button>
                    <Button onClick={exportComponent} className="w-full gap-2"><Download className="w-4 h-4" />Export Component</Button>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-card/30">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Preview</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">

                        {/* Interactive preview */}
                        <div className="space-y-6 max-w-xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">Interactive Preview</h4>
                            {renderPreview()}
                        </div>

                        <Separator />

                        {/* All variants */}
                        <div className="space-y-8 max-w-xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">All Variants</h4>
                            {(['default', 'bordered', 'card', 'ghost'] as const).map(variant => {
                                const [variantOpen, setVariantOpen] = useState<Set<string>>(new Set(['1']));
                                const handleToggle = (id: string) => setVariantOpen(s => {
                                    const n = new Set(s);
                                    n.has(id) ? n.delete(id) : n.add(id);
                                    return n;
                                });
                                return (
                                    <div key={variant} className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground capitalize">{variant}</p>
                                        {renderPreview(variant, variantOpen, handleToggle)}
                                    </div>
                                );
                            })}
                        </div>

                        <Separator />

                        {/* Generated code */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">Generated Code</h4>
                                <Button size="sm" variant="ghost" onClick={copyCode} className="gap-2">
                                    <Copy className="w-3 h-3" />Copy
                                </Button>
                            </div>
                            <pre className="text-xs font-mono bg-muted p-6 rounded-xl overflow-x-auto max-h-96 overflow-y-auto">{generateReactCode()}</pre>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default AccordionBuilder;
