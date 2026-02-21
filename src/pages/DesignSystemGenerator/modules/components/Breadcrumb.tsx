import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, Copy, Download, Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

interface Crumb { id: string; label: string; icon: boolean; }

const BreadcrumbBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [config, setConfig] = useState({
        separator: 'chevron' as 'chevron' | 'slash' | 'dot' | 'arrow',
        size: 'md' as 'sm' | 'md' | 'lg',
        showHomeIcon: true,
        maxItems: 0,
        style: 'default' as 'default' | 'rounded' | 'elevated',
        activeColor: tokens.colors.primary,
    });

    const [items, setItems] = useState<Crumb[]>([
        { id: '1', label: 'Home', icon: true },
        { id: '2', label: 'Products', icon: false },
        { id: '3', label: 'Electronics', icon: false },
        { id: '4', label: 'Laptops', icon: false },
    ]);

    const sizePx = { sm: 12, md: 14, lg: 16 };
    const gapPx = { sm: 4, md: 6, lg: 8 };

    const sepChar: Record<string, React.ReactNode> = {
        chevron: <ChevronRight style={{ width: sizePx[config.size] - 2, height: sizePx[config.size] - 2, opacity: 0.4 }} />,
        slash: <span style={{ opacity: 0.4, fontSize: sizePx[config.size] - 1 }}>/</span>,
        dot: <span style={{ opacity: 0.4, fontSize: sizePx[config.size] }}>·</span>,
        arrow: <span style={{ opacity: 0.4, fontSize: sizePx[config.size] - 1 }}>→</span>,
    };

    const generateReactCode = () => `import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem { label: string; href?: string; icon?: boolean; }
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot' | 'arrow';
  size?: 'sm' | 'md' | 'lg';
}

export const Breadcrumb = ({ items, separator = '${config.separator}', size = '${config.size}' }: BreadcrumbProps) => {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  const sep = { chevron: <ChevronRight className="w-3.5 h-3.5 opacity-40" />, slash: <span className="opacity-40">/</span>, dot: <span className="opacity-40">·</span>, arrow: <span className="opacity-40">→</span> };
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn('flex items-center gap-1.5 flex-wrap', sizes[size])}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {i > 0 && sep[separator]}
              {isLast ? (
                <span className="font-bold text-foreground" aria-current="page">
                  {item.icon && <Home className="w-3.5 h-3.5 inline mr-1" />}
                  {item.label}
                </span>
              ) : (
                <a href={item.href ?? '#'} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  {item.icon && <Home className="w-3.5 h-3.5" />}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
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
        const a = document.createElement('a'); a.href = url; a.download = 'Breadcrumb.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const renderBreadcrumb = (crumbs: Crumb[], style = config.style) => {
        const sz = sizePx[config.size];
        const gap = gapPx[config.size];
        const containerStyle: React.CSSProperties = style === 'elevated' ? { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: `${tokens.radius * 0.5}rem`, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: gap + 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : style === 'rounded' ? { background: 'var(--muted)', borderRadius: 99, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: gap + 2 } : { display: 'inline-flex', alignItems: 'center', gap: gap + 2 };
        return (
            <nav style={containerStyle}>
                {crumbs.map((item, i) => {
                    const isLast = i === crumbs.length - 1;
                    return (
                        <React.Fragment key={item.id}>
                            {i > 0 && sepChar[config.separator]}
                            <span style={{ fontSize: sz, fontWeight: isLast ? 700 : 500, color: isLast ? config.activeColor : 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: 4, cursor: isLast ? 'default' : 'pointer', transition: 'color 0.15s' }}>
                                {i === 0 && config.showHomeIcon && <Home style={{ width: sz, height: sz }} />}
                                {!(i === 0 && config.showHomeIcon) || i > 0 ? item.label : item.label}
                            </span>
                        </React.Fragment>
                    );
                })}
            </nav>
        );
    };

    const pages = [
        items,
        [...items.slice(0, 2), { id: 'ellipsis', label: '…', icon: false }, items[items.length - 1]],
    ];

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Breadcrumb Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Component Workbench</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Appearance</Label>
                            <div className="space-y-3">
                                {[
                                    { label: 'Separator', key: 'separator', opts: ['chevron', 'slash', 'dot', 'arrow'] },
                                    { label: 'Size', key: 'size', opts: ['sm', 'md', 'lg'] },
                                    { label: 'Style', key: 'style', opts: ['default', 'rounded', 'elevated'] },
                                ].map(({ label, key, opts }) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="text-xs">{label}</Label>
                                        <Select value={(config as Record<string, string>)[key]} onValueChange={v => setConfig({ ...config, [key]: v })}>
                                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                            <SelectContent>{opts.map(o => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <Label className="text-xs">Active Link Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" value={config.activeColor} onChange={e => setConfig({ ...config, activeColor: e.target.value })} className="w-12 h-9 p-1" />
                                        <Input value={config.activeColor} onChange={e => setConfig({ ...config, activeColor: e.target.value })} className="flex-1 h-9 font-mono text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Options</Label>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Show Home Icon</Label>
                                <Switch checked={config.showHomeIcon} onCheckedChange={c => setConfig({ ...config, showHomeIcon: c })} />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Breadcrumb Items</Label>
                                <Button size="sm" variant="ghost" className="h-7 gap-1.5" onClick={() => setItems([...items, { id: Date.now().toString(), label: `Page ${items.length + 1}`, icon: false }])}>
                                    <Plus className="w-3 h-3" />Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {items.map((item, i) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <Input value={item.label} onChange={e => setItems(items.map((it, j) => j === i ? { ...it, label: e.target.value } : it))} className="h-8 text-sm flex-1" />
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive shrink-0" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
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

            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-card/30">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Preview</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Current Configuration</h4>
                            <div>{renderBreadcrumb(items)}</div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Styles</h4>
                            <div className="space-y-4">
                                {(['default', 'rounded', 'elevated'] as const).map(style => (
                                    <div key={style}>
                                        <p className="text-xs font-bold text-muted-foreground mb-2 capitalize">{style}</p>
                                        {renderBreadcrumb(items, style)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Separators</h4>
                            <div className="space-y-4">
                                {(['chevron', 'slash', 'dot', 'arrow'] as const).map(sep => (
                                    <div key={sep}>
                                        <p className="text-xs font-bold text-muted-foreground mb-2 capitalize">{sep}</p>
                                        <nav style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                            {items.slice(0, 3).map((item, i) => (
                                                <React.Fragment key={item.id}>
                                                    {i > 0 && { chevron: <ChevronRight style={{ width: 13, height: 13, opacity: 0.4 }} />, slash: <span style={{ opacity: 0.4 }}>/</span>, dot: <span style={{ opacity: 0.4 }}>·</span>, arrow: <span style={{ opacity: 0.4 }}>→</span> }[sep]}
                                                    <span style={{ fontSize: 14, fontWeight: i === 2 ? 700 : 500, color: i === 2 ? config.activeColor : 'var(--muted-foreground)' }}>{item.label}</span>
                                                </React.Fragment>
                                            ))}
                                        </nav>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Generated Code</h4>
                                <Button size="sm" variant="ghost" onClick={copyCode} className="gap-2"><Copy className="w-3 h-3" />Copy</Button>
                            </div>
                            <pre className="text-xs font-mono bg-muted p-6 rounded-xl overflow-x-auto max-h-96 overflow-y-auto">{generateReactCode()}</pre>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default BreadcrumbBuilder;
