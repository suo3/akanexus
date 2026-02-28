import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LayoutList, Copy, Download, Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

interface TabItem { id: string; label: string; icon: string; badge?: string; disabled?: boolean; content: string; }

const TabsBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState(0);

    const [config, setConfig] = useState({
        variant: 'underline' as 'underline' | 'pills' | 'boxed' | 'lifted',
        size: 'md' as 'sm' | 'md' | 'lg',
        position: 'top' as 'top' | 'left',
        fullWidth: false,
        showIcons: true,
        showBadges: true,
    });

    const [tabs, setTabs] = useState<TabItem[]>([
        { id: '1', label: 'Overview', icon: '📊', badge: '', content: 'Overview content goes here. This is the main dashboard view with key metrics and summaries.' },
        { id: '2', label: 'Analytics', icon: '📈', badge: '3', content: 'Analytics content. Detailed charts, graphs, and data analysis tools.' },
        { id: '3', label: 'Settings', icon: '⚙️', badge: '', content: 'Settings and configuration options for your account and preferences.' },
        { id: '4', label: 'Billing', icon: '💳', badge: 'Pro', disabled: false, content: 'Billing history, payment methods, and subscription details.' },
    ]);

    const [selected, setSelected] = useState(0);

    const sizes = { sm: { font: 12, padding: '6px 12px', h: 32 }, md: { font: 13, padding: '8px 16px', h: 38 }, lg: { font: 14, padding: '10px 20px', h: 44 } };
    const sz = sizes[config.size];

    const getTabStyle = (i: number, disabled = false) => {
        const isActive = i === selected;
        const base: React.CSSProperties = { fontSize: sz.font, padding: sz.padding, fontWeight: isActive ? 700 : 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', userSelect: 'none', border: 'none', background: 'transparent' };
        if (config.variant === 'underline') return { ...base, borderBottom: `2px solid ${isActive ? tokens.colors.primary : 'transparent'}`, color: isActive ? tokens.colors.primary : 'var(--muted-foreground)', borderRadius: 0, marginBottom: -2 };
        if (config.variant === 'pills') return { ...base, background: isActive ? tokens.colors.primary : 'transparent', color: isActive ? '#fff' : 'var(--muted-foreground)', borderRadius: 99, padding: sz.padding };
        if (config.variant === 'boxed') return { ...base, background: isActive ? 'var(--background)' : 'transparent', color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)', borderRadius: `${tokens.radius * 0.5}rem`, boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.10)' : 'none', border: isActive ? '1px solid var(--border)' : '1px solid transparent' };
        if (config.variant === 'lifted') return { ...base, background: isActive ? 'var(--background)' : 'var(--muted)', color: isActive ? tokens.colors.primary : 'var(--muted-foreground)', borderRadius: `${tokens.radius * 0.5}rem ${tokens.radius * 0.5}rem 0 0`, borderBottom: isActive ? '2px solid var(--background)' : '2px solid transparent', marginBottom: -2 };
        return base;
    };

    const getContainerStyle = (): React.CSSProperties => {
        if (config.variant === 'underline') return { borderBottom: '2px solid var(--border)', display: 'flex', gap: 4, ...(config.fullWidth ? { justifyContent: 'stretch' } : {}) };
        if (config.variant === 'pills') return { display: 'flex', gap: 4, background: 'var(--muted)', padding: 4, borderRadius: 99 };
        if (config.variant === 'boxed') return { display: 'flex', gap: 2, background: 'var(--muted)', padding: 4, borderRadius: `${tokens.radius * 0.5}rem` };
        if (config.variant === 'lifted') return { display: 'flex', gap: 2, borderBottom: '2px solid var(--border)' };
        return { display: 'flex', gap: 4 };
    };

    const generateReactCode = () => `import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab { id: string; label: string; icon?: React.ReactNode; badge?: string; disabled?: boolean; }
interface TabsProps { tabs: Tab[]; variant?: 'underline' | 'pills' | 'boxed' | 'lifted'; size?: 'sm' | 'md' | 'lg'; children: React.ReactNode[]; }

export const Tabs = ({ tabs, variant = '${config.variant}', size = '${config.size}', children }: TabsProps) => {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className={cn('flex', variant === 'underline' && 'border-b border-border gap-1', variant === 'pills' && 'bg-muted p-1 rounded-full gap-1', variant === 'boxed' && 'bg-muted p-1 rounded-lg gap-1', variant === 'lifted' && 'gap-1 border-b border-border')}>
        {tabs.map((tab, i) => (
          <button key={tab.id} disabled={tab.disabled} onClick={() => setActive(i)}
            className={cn('flex items-center gap-2 font-semibold transition-all',
              size === 'sm' && 'text-xs px-3 py-1.5', size === 'md' && 'text-sm px-4 py-2', size === 'lg' && 'text-base px-5 py-2.5',
              variant === 'underline' && (i === active ? 'border-b-2 border-primary text-primary -mb-0.5' : 'text-muted-foreground border-b-2 border-transparent -mb-0.5'),
              variant === 'pills' && (i === active ? 'bg-primary text-white rounded-full' : 'text-muted-foreground'),
              variant === 'boxed' && (i === active ? 'bg-background text-foreground rounded-md shadow-sm border border-border' : 'text-muted-foreground'),
              variant === 'lifted' && (i === active ? 'bg-background text-primary rounded-t-md border-b-2 border-background' : 'bg-muted text-muted-foreground rounded-t-md'),
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}>
            {tab.icon}
            {tab.label}
            {tab.badge && <span className="ml-1 text-[10px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
          </button>
        ))}
      </div>
      <div className="mt-4">{children[active]}</div>
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
        const a = document.createElement('a'); a.href = url; a.download = 'Tabs.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <LayoutList className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Tabs Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-90">Component Workbench</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Appearance</Label>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs">Variant</Label>
                                    <Select value={config.variant} onValueChange={v => setConfig({ ...config, variant: v as typeof config.variant })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['underline', 'pills', 'boxed', 'lifted'].map(v => <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Size</Label>
                                    <Select value={config.size} onValueChange={v => setConfig({ ...config, size: v as typeof config.size })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['sm', 'md', 'lg'].map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Options</Label>
                            {[
                                { label: 'Full Width Tabs', key: 'fullWidth' },
                                { label: 'Show Icons', key: 'showIcons' },
                                { label: 'Show Badges', key: 'showBadges' },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <Label className="text-sm">{label}</Label>
                                    <Switch checked={(config as Record<string, boolean>)[key]} onCheckedChange={c => setConfig({ ...config, [key]: c })} />
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Tabs</Label>
                                <Button size="sm" variant="ghost" className="h-7 gap-1.5" onClick={() => setTabs([...tabs, { id: Date.now().toString(), label: `Tab ${tabs.length + 1}`, icon: '📄', badge: '', content: 'New tab content.' }])}>
                                    <Plus className="w-3 h-3" />Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {tabs.map((tab, i) => (
                                    <div key={tab.id} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${activeTab === i ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => setActiveTab(i)}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Input value={tab.icon} onChange={e => setTabs(tabs.map((t, j) => j === i ? { ...t, icon: e.target.value } : t))} className="h-7 w-12 text-center px-1 text-base" />
                                                <Input value={tab.label} onChange={e => setTabs(tabs.map((t, j) => j === i ? { ...t, label: e.target.value } : t))} className="h-7 text-sm font-bold flex-1" />
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={e => { e.stopPropagation(); setTabs(tabs.filter((_, j) => j !== i)); if (activeTab >= tabs.length - 1) setActiveTab(0); }}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input placeholder="Badge" value={tab.badge || ''} onChange={e => setTabs(tabs.map((t, j) => j === i ? { ...t, badge: e.target.value } : t))} className="h-7 text-xs w-20" />
                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <Label className="text-xs">Disabled</Label>
                                                <Switch checked={!!tab.disabled} onCheckedChange={c => setTabs(tabs.map((t, j) => j === i ? { ...t, disabled: c } : t))} />
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
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">Interactive Preview</h4>
                            <div>
                                <div style={getContainerStyle()}>
                                    {tabs.map((tab, i) => (
                                        <button key={tab.id} onClick={() => !tab.disabled && setSelected(i)} style={{ ...getTabStyle(i, tab.disabled), flex: config.fullWidth ? 1 : undefined, justifyContent: config.fullWidth ? 'center' : undefined }}>
                                            {config.showIcons && tab.icon}
                                            {tab.label}
                                            {config.showBadges && tab.badge && (
                                                <span style={{ fontSize: 10, fontWeight: 700, background: tokens.colors.primary + '20', color: tokens.colors.primary, padding: '1px 6px', borderRadius: 99 }}>{tab.badge}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 rounded-lg bg-muted/30 border text-sm text-muted-foreground">
                                    {tabs[selected]?.content}
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-8">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">All Variants</h4>
                            {(['underline', 'pills', 'boxed', 'lifted'] as const).map(variant => {
                                const getVStyle = (i: number): React.CSSProperties => {
                                    const isActive = i === 0;
                                    const base: React.CSSProperties = { fontSize: 13, padding: '8px 16px', fontWeight: isActive ? 700 : 600, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', border: 'none', background: 'transparent' };
                                    if (variant === 'underline') return { ...base, borderBottom: `2px solid ${isActive ? tokens.colors.primary : 'transparent'}`, color: isActive ? tokens.colors.primary : 'var(--muted-foreground)', marginBottom: -2 };
                                    if (variant === 'pills') return { ...base, background: isActive ? tokens.colors.primary : 'transparent', color: isActive ? '#fff' : 'var(--muted-foreground)', borderRadius: 99 };
                                    if (variant === 'boxed') return { ...base, background: isActive ? 'var(--background)' : 'transparent', color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)', borderRadius: 8, boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.10)' : 'none', border: isActive ? '1px solid var(--border)' : '1px solid transparent' };
                                    if (variant === 'lifted') return { ...base, background: isActive ? 'var(--background)' : 'var(--muted)', color: isActive ? tokens.colors.primary : 'var(--muted-foreground)', borderRadius: '6px 6px 0 0', borderBottom: isActive ? '2px solid var(--background)' : 'none', marginBottom: -2 };
                                    return base;
                                };
                                const cStyle: React.CSSProperties = variant === 'underline' ? { display: 'flex', gap: 4, borderBottom: '2px solid var(--border)' } : variant === 'pills' ? { display: 'flex', gap: 4, background: 'var(--muted)', padding: 4, borderRadius: 99 } : variant === 'boxed' ? { display: 'flex', gap: 2, background: 'var(--muted)', padding: 4, borderRadius: 8 } : { display: 'flex', gap: 2, borderBottom: '2px solid var(--border)' };
                                return (
                                    <div key={variant}>
                                        <p className="text-xs font-bold text-muted-foreground mb-3 capitalize">{variant}</p>
                                        <div style={cStyle}>
                                            {tabs.slice(0, 3).map((tab, i) => (
                                                <button key={tab.id} style={getVStyle(i)}>{config.showIcons && tab.icon} {tab.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">Generated Code</h4>
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

export default TabsBuilder;
