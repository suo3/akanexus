import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { List, Copy, Download, Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

interface ListItem { id: string; label: string; description: string; icon: string; badge: string; disabled: boolean; }

const ListBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [config, setConfig] = useState({
        variant: 'default' as 'default' | 'bordered' | 'divided' | 'card',
        size: 'md' as 'sm' | 'md' | 'lg',
        selectable: true,
        multiSelect: false,
        showIcons: true,
        showBadges: true,
        showDescriptions: true,
        showAvatar: false,
        showCheckbox: false,
        interactive: true,
        draggable: false,
    });

    const [items, setItems] = useState<ListItem[]>([
        { id: '1', label: 'Design System', description: 'Core UI component library', icon: '🎨', badge: 'New', disabled: false },
        { id: '2', label: 'Component Library', description: 'Reusable React components', icon: '⚛️', badge: '', disabled: false },
        { id: '3', label: 'Token Manager', description: 'Design tokens & variables', icon: '🪙', badge: '3', disabled: false },
        { id: '4', label: 'Documentation', description: 'Guides and API references', icon: '📄', badge: '', disabled: false },
        { id: '5', label: 'Theme Editor', description: 'Customize colors and spacing', icon: '🎭', badge: '', disabled: true },
    ]);

    const [selected, setSelected] = useState<Set<string>>(new Set(['1']));

    const handleSelect = (id: string) => {
        if (config.multiSelect) {
            setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
        } else {
            setSelected(new Set([id]));
        }
    };

    const sizes = {
        sm: { pad: '8px 12px', font: 12, descFont: 11, iconSize: 20 },
        md: { pad: '12px 16px', font: 14, descFont: 12, iconSize: 24 },
        lg: { pad: '16px 20px', font: 15, descFont: 13, iconSize: 28 },
    };
    const sz = sizes[config.size];
    const radius = `${tokens.radius * 0.5}rem`;

    const getContainerStyle = (): React.CSSProperties => {
        if (config.variant === 'card') return { border: '1px solid var(--border)', borderRadius: radius, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' };
        if (config.variant === 'bordered') return { border: '1px solid var(--border)', borderRadius: radius, overflow: 'hidden' };
        return { borderRadius: radius, overflow: 'hidden' };
    };

    const getItemStyle = (item: ListItem, i: number): React.CSSProperties => {
        const isSelected = selected.has(item.id);
        const base: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: sz.iconSize / 2, padding: sz.pad, cursor: item.disabled ? 'not-allowed' : config.selectable ? 'pointer' : 'default', opacity: item.disabled ? 0.4 : 1, transition: 'all 0.15s', fontSize: sz.font };
        if (config.variant === 'divided' && i > 0) base.borderTop = '1px solid var(--border)';
        if (isSelected && config.selectable) return { ...base, background: tokens.colors.primary + '10', borderLeft: `3px solid ${tokens.colors.primary}` };
        if (config.variant === 'card' && config.interactive) return { ...base, background: 'var(--background)' };
        return { ...base, background: 'transparent' };
    };

    const generateReactCode = () => `import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ListItem { id: string; label: string; description?: string; icon?: string; badge?: string; disabled?: boolean; }
interface ListProps {
  items: ListItem[];
  variant?: 'default' | 'bordered' | 'divided' | 'card';
  selectable?: boolean;
  multiple?: boolean;
  onSelect?: (selected: string[]) => void;
}

export const List = ({ items, variant = '${config.variant}', selectable, multiple, onSelect }: ListProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (id: string) => {
    setSelected(s => { const n = new Set(multiple ? s : []); n.has(id) ? n.delete(id) : n.add(id); onSelect?.([...n]); return n; });
  };
  return (
    <ul className={cn('overflow-hidden', variant === 'bordered' && 'border border-border rounded-xl', variant === 'card' && 'border border-border rounded-xl shadow-sm')}>
      {items.map((item, i) => (
        <li key={item.id} onClick={() => !item.disabled && selectable && handleSelect(item.id)}
          className={cn('flex items-center gap-3 px-4 py-3 transition-all', selectable && !item.disabled && 'cursor-pointer hover:bg-muted/50', item.disabled && 'opacity-40 cursor-not-allowed', variant === 'divided' && i > 0 && 'border-t border-border', selected.has(item.id) && selectable && 'bg-primary/5 border-l-2 border-primary')}>
          {item.icon && <span className="text-xl shrink-0">{item.icon}</span>}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{item.label}</div>
            {item.description && <div className="text-xs text-muted-foreground truncate">{item.description}</div>}
          </div>
          {item.badge && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">{item.badge}</span>}
          {selected.has(item.id) && selectable && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
        </li>
      ))}
    </ul>
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
        const a = document.createElement('a'); a.href = url; a.download = 'List.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <List className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">List Builder</h2>
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
                                    { label: 'Variant', key: 'variant', opts: ['default', 'bordered', 'divided', 'card'] },
                                    { label: 'Size', key: 'size', opts: ['sm', 'md', 'lg'] },
                                ].map(({ label, key, opts }) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="text-xs">{label}</Label>
                                        <Select value={(config as unknown as Record<string, string>)[key]} onValueChange={v => setConfig({ ...config, [key]: v })}>
                                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                            <SelectContent>{opts.map(o => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Features</Label>
                            {[
                                { label: 'Selectable', key: 'selectable' },
                                { label: 'Multi-Select', key: 'multiSelect' },
                                { label: 'Show Icons', key: 'showIcons' },
                                { label: 'Show Descriptions', key: 'showDescriptions' },
                                { label: 'Show Badges', key: 'showBadges' },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <Label className="text-sm">{label}</Label>
                                    <Switch checked={(config as unknown as Record<string, boolean>)[key]} onCheckedChange={c => setConfig({ ...config, [key]: c })} />
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">List Items</Label>
                                <Button size="sm" variant="ghost" className="h-7 gap-1.5" onClick={() => setItems([...items, { id: Date.now().toString(), label: `Item ${items.length + 1}`, description: 'Description text', icon: '📌', badge: '', disabled: false }])}>
                                    <Plus className="w-3 h-3" />Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {items.map((item, i) => (
                                    <div key={item.id} className="p-3 rounded-lg border space-y-2">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                                            <Input value={item.icon} onChange={e => setItems(items.map((it, j) => j === i ? { ...it, icon: e.target.value } : it))} className="h-7 w-12 text-center px-1 text-base" />
                                            <Input value={item.label} onChange={e => setItems(items.map((it, j) => j === i ? { ...it, label: e.target.value } : it))} className="h-7 flex-1 text-sm font-bold" />
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 pl-6">
                                            <Input placeholder="Badge" value={item.badge} onChange={e => setItems(items.map((it, j) => j === i ? { ...it, badge: e.target.value } : it))} className="h-7 text-xs w-20" />
                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <Label className="text-xs">Disabled</Label>
                                                <Switch checked={item.disabled} onCheckedChange={c => setItems(items.map((it, j) => j === i ? { ...it, disabled: c } : it))} />
                                            </div>
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

            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-card/30">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Preview</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        <div className="space-y-6 max-w-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Interactive Preview</h4>
                            <div style={getContainerStyle()}>
                                {items.map((item, i) => (
                                    <div key={item.id} style={getItemStyle(item, i)} onClick={() => !item.disabled && config.selectable && handleSelect(item.id)}>
                                        {config.showIcons && <span style={{ fontSize: sz.iconSize, flexShrink: 0 }}>{item.icon}</span>}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: sz.font, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                                            {config.showDescriptions && <div style={{ fontSize: sz.descFont, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>}
                                        </div>
                                        {config.showBadges && item.badge && (
                                            <span style={{ fontSize: 10, fontWeight: 700, background: tokens.colors.primary + '20', color: tokens.colors.primary, padding: '2px 8px', borderRadius: 99, flexShrink: 0 }}>{item.badge}</span>
                                        )}
                                        {selected.has(item.id) && config.selectable && <CheckCircle2 style={{ width: 16, height: 16, color: tokens.colors.primary, flexShrink: 0 }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Variants</h4>
                            <div className="grid grid-cols-2 gap-6">
                                {(['default', 'bordered', 'divided', 'card'] as const).map(variant => {
                                    const cs: React.CSSProperties = variant === 'card' ? { border: '1px solid var(--border)', borderRadius: radius, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' } : variant === 'bordered' ? { border: '1px solid var(--border)', borderRadius: radius, overflow: 'hidden' } : { borderRadius: radius, overflow: 'hidden' };
                                    return (
                                        <div key={variant}>
                                            <p className="text-xs font-bold text-muted-foreground mb-2 capitalize">{variant}</p>
                                            <div style={cs}>
                                                {items.slice(0, 3).map((item, i) => {
                                                    const is: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'transparent', borderTop: variant === 'divided' && i > 0 ? '1px solid var(--border)' : 'none', fontSize: 13 };
                                                    return (
                                                        <div key={item.id} style={is}>
                                                            <span style={{ fontSize: 18 }}>{item.icon}</span>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
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

export default ListBuilder;
