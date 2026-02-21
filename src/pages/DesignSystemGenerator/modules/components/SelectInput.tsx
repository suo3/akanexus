import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronDown, Copy, Download, Search, Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

const SelectBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [config, setConfig] = useState({
        size: 'md' as 'sm' | 'md' | 'lg',
        variant: 'default' as 'default' | 'filled' | 'underline',
        searchable: true,
        clearable: true,
        multiSelect: false,
        showOptionIcons: true,
        placeholder: 'Select an option...',
        label: 'Framework',
        required: false,
        disabled: false,
        error: '',
        helper: 'Choose your preferred framework',
    });

    const options = [
        { value: 'react', label: 'React', icon: '⚛️', description: 'UI library by Meta' },
        { value: 'vue', label: 'Vue.js', icon: '💚', description: 'Progressive framework' },
        { value: 'angular', label: 'Angular', icon: '🔺', description: 'Platform by Google' },
        { value: 'svelte', label: 'Svelte', icon: '🟠', description: 'Compiler-based' },
        { value: 'solid', label: 'SolidJS', icon: '🔷', description: 'Fine-grained reactivity' },
        { value: 'next', label: 'Next.js', icon: '⬛', description: 'React framework' },
    ];

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
    const selectedOptions = options.filter(o => selected.includes(o.value));

    const handleSelect = (value: string) => {
        if (config.multiSelect) {
            setSelected(sel => sel.includes(value) ? sel.filter(s => s !== value) : [...sel, value]);
        } else {
            setSelected([value]);
            setOpen(false);
        }
        setSearch('');
    };

    const sizes = { sm: { height: 34, font: 12, pad: '0 10px' }, md: { height: 40, font: 14, pad: '0 12px' }, lg: { height: 48, font: 15, pad: '0 14px' } };
    const sz = sizes[config.size];
    const borderRadius = `${tokens.radius * 0.5}rem`;

    const getTriggerStyle = (): React.CSSProperties => {
        const base: React.CSSProperties = { height: sz.height, padding: sz.pad, fontSize: sz.font, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: config.disabled ? 'not-allowed' : 'pointer', opacity: config.disabled ? 0.5 : 1, transition: 'all 0.15s', gap: 8, width: '100%' };
        if (config.error) { base.borderColor = '#ef4444'; }
        if (config.variant === 'underline') return { ...base, background: 'transparent', border: 'none', borderBottom: `2px solid ${config.error ? '#ef4444' : open ? tokens.colors.primary : 'var(--border)'}`, borderRadius: 0, padding: `0 0 0 2px` };
        if (config.variant === 'filled') return { ...base, background: open ? tokens.colors.primary + '12' : 'var(--muted)', border: `1.5px solid ${config.error ? '#ef4444' : open ? tokens.colors.primary : 'transparent'}`, borderRadius };
        return { ...base, background: 'var(--background)', border: `1.5px solid ${config.error ? '#ef4444' : open ? tokens.colors.primary : 'var(--border)'}`, borderRadius };
    };

    const generateReactCode = () => `import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Search, Check, X } from 'lucide-react';

interface Option { value: string; label: string; icon?: string; description?: string; }
interface SelectProps {
  options: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: string;
  helper?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Select = ({ options, value, onChange, placeholder = 'Select...', label, multiple, searchable, clearable, disabled, error, helper, size = 'md' }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const sizes = { sm: 'h-8 text-xs', md: 'h-10 text-sm', lg: 'h-12 text-base' };

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));

  const handleSelect = (v: string) => {
    if (multiple) { onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v]); }
    else { onChange(v); setOpen(false); }
    setQ('');
  };

  const selectedLabels = options.filter(o => selected.includes(o.value));

  return (
    <div className="space-y-1.5" ref={ref}>
      {label && <label className="text-sm font-bold">{label}</label>}
      <div className={cn('relative flex items-center justify-between gap-2 border border-border bg-background rounded-lg px-3 cursor-pointer', sizes[size], open && 'border-primary ring-1 ring-primary/20', error && 'border-destructive', disabled && 'opacity-50 pointer-events-none')} onClick={() => setOpen(o => !o)}>
        <div className="flex-1 flex flex-wrap gap-1 min-w-0">
          {selected.length === 0 ? <span className="text-muted-foreground truncate">{placeholder}</span> : multiple ? selectedLabels.map(o => (
            <span key={o.value} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              {o.label} <X className="w-3 h-3 cursor-pointer" onClick={e => { e.stopPropagation(); handleSelect(o.value); }} />
            </span>
          )) : <span className="font-medium truncate">{selectedLabels[0]?.label}</span>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {clearable && selected.length > 0 && <X className="w-4 h-4 opacity-40 hover:opacity-100" onClick={e => { e.stopPropagation(); onChange(multiple ? [] : ''); }} />}
          <ChevronDown className={cn('w-4 h-4 opacity-50 transition-transform', open && 'rotate-180')} />
        </div>
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded-lg">
                <Search className="w-4 h-4 opacity-40" />
                <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent text-sm outline-none" onClick={e => e.stopPropagation()} />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.map(opt => (
              <button key={opt.value} onClick={() => handleSelect(opt.value)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted text-left transition-colors', selected.includes(opt.value) && 'bg-primary/5')}>
                {opt.icon && <span>{opt.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{opt.label}</div>
                  {opt.description && <div className="text-xs text-muted-foreground">{opt.description}</div>}
                </div>
                {selected.includes(opt.value) && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
      {(error || helper) && <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{error || helper}</p>}
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
        const a = document.createElement('a'); a.href = url; a.download = 'Select.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ChevronDown className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Select Builder</h2>
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
                                    { label: 'Variant', key: 'variant', opts: ['default', 'filled', 'underline'] },
                                    { label: 'Size', key: 'size', opts: ['sm', 'md', 'lg'] },
                                ].map(({ label, key, opts }) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="text-xs">{label}</Label>
                                        <Select value={(config as Record<string, string>)[key]} onValueChange={v => setConfig({ ...config, [key]: v })}>
                                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                            <SelectContent>{opts.map(o => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Options</Label>
                            {[
                                { label: 'Searchable', key: 'searchable' },
                                { label: 'Clearable', key: 'clearable' },
                                { label: 'Multi-Select', key: 'multiSelect' },
                                { label: 'Show Option Icons', key: 'showOptionIcons' },
                                { label: 'Required', key: 'required' },
                                { label: 'Disabled', key: 'disabled' },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <Label className="text-sm">{label}</Label>
                                    <Switch checked={(config as Record<string, boolean>)[key]} onCheckedChange={c => setConfig({ ...config, [key]: c })} />
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Content</Label>
                            {[
                                { label: 'Label', key: 'label' },
                                { label: 'Placeholder', key: 'placeholder' },
                                { label: 'Helper Text', key: 'helper' },
                                { label: 'Error Message', key: 'error' },
                            ].map(({ label, key }) => (
                                <div key={key} className="space-y-2">
                                    <Label className="text-xs">{label}</Label>
                                    <Input value={(config as Record<string, string>)[key]} onChange={e => setConfig({ ...config, [key]: e.target.value })} className="h-9 text-sm" />
                                </div>
                            ))}
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
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Interactive Select</h4>
                            <div className="max-w-xs space-y-1.5" ref={containerRef}>
                                {config.label && (
                                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                                        {config.label}{config.required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
                                    </div>
                                )}
                                <div style={{ position: 'relative' }}>
                                    <div style={getTriggerStyle()} onClick={() => !config.disabled && setOpen(o => !o)}>
                                        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 4, minWidth: 0 }}>
                                            {selected.length === 0 ? (
                                                <span style={{ color: 'var(--muted-foreground)', fontSize: sz.font }}>{config.placeholder}</span>
                                            ) : config.multiSelect ? (
                                                selectedOptions.map(o => (
                                                    <span key={o.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: tokens.colors.primary + '20', color: tokens.colors.primary, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                                                        {config.showOptionIcons && o.icon} {o.label}
                                                        <X style={{ width: 11, height: 11, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleSelect(o.value); }} />
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontWeight: 500, fontSize: sz.font }}>{config.showOptionIcons && selectedOptions[0]?.icon} {selectedOptions[0]?.label}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                                            {config.clearable && selected.length > 0 && <X style={{ width: 14, height: 14, opacity: 0.4, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setSelected([]); }} />}
                                            <ChevronDown style={{ width: 16, height: 16, opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                                        </div>
                                    </div>
                                    {open && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, background: 'var(--background)', border: '1.5px solid var(--border)', borderRadius, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                                            {config.searchable && (
                                                <div style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--muted)', borderRadius: 8, padding: '5px 10px' }}>
                                                        <Search style={{ width: 14, height: 14, opacity: 0.4 }} />
                                                        <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13 }} onClick={e => e.stopPropagation()} />
                                                        {search && <X style={{ width: 12, height: 12, opacity: 0.5, cursor: 'pointer' }} onClick={() => setSearch('')} />}
                                                    </div>
                                                </div>
                                            )}
                                            <div style={{ maxHeight: 220, overflowY: 'auto', padding: '4px 0' }}>
                                                {filtered.length === 0 ? (
                                                    <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted-foreground)', textAlign: 'center' }}>No results found</div>
                                                ) : filtered.map(opt => (
                                                    <button key={opt.value} onClick={() => handleSelect(opt.value)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: selected.includes(opt.value) ? tokens.colors.primary + '10' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}>
                                                        {config.showOptionIcons && <span style={{ fontSize: 18 }}>{opt.icon}</span>}
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                                                            <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{opt.description}</div>
                                                        </div>
                                                        {selected.includes(opt.value) && <Check style={{ width: 14, height: 14, color: tokens.colors.primary, flexShrink: 0 }} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {(config.error || config.helper) && (
                                    <div style={{ fontSize: 12, color: config.error ? '#ef4444' : 'var(--muted-foreground)', marginTop: 4 }}>
                                        {config.error || config.helper}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Variants</h4>
                            <div className="space-y-4 max-w-xs">
                                {(['default', 'filled', 'underline'] as const).map(variant => {
                                    const vs = (): React.CSSProperties => {
                                        const base: React.CSSProperties = { height: 40, padding: '0 12px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 8, width: '100%' };
                                        if (variant === 'underline') return { ...base, background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', borderRadius: 0, padding: '0 2px' };
                                        if (variant === 'filled') return { ...base, background: 'var(--muted)', border: '1.5px solid transparent', borderRadius };
                                        return { ...base, background: 'var(--background)', border: '1.5px solid var(--border)', borderRadius };
                                    };
                                    return (
                                        <div key={variant}>
                                            <p className="text-xs font-bold text-muted-foreground mb-1.5 capitalize">{variant}</p>
                                            <div style={vs()}>
                                                <span style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>Select framework…</span>
                                                <ChevronDown style={{ width: 16, height: 16, opacity: 0.4 }} />
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

export default SelectBuilder;
