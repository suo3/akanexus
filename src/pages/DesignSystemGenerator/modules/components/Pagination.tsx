import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Copy, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

const PaginationBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [config, setConfig] = useState({
        variant: 'default' as 'default' | 'rounded' | 'minimal' | 'outline',
        size: 'md' as 'sm' | 'md' | 'lg',
        totalPages: 12,
        siblingCount: 1,
        showFirst: true,
        showLast: true,
        showPrevNext: true,
        showPageInfo: true,
        showPageSizeSelector: false,
    });

    const [currentPage, setCurrentPage] = useState(4);

    const sz = { sm: 28, md: 34, lg: 40 };
    const fs = { sm: 12, md: 13, lg: 14 };
    const btnSize = sz[config.size];
    const fontSize = fs[config.size];
    const radius = { default: `${tokens.radius * 0.4}rem`, rounded: '50%', minimal: 0, outline: `${tokens.radius * 0.4}rem` };

    const getRange = (current: number, total: number, siblings: number) => {
        const totalDisplayed = siblings * 2 + 5;
        if (total <= totalDisplayed) return Array.from({ length: total }, (_, i) => i + 1);
        const leftSiblings = Math.max(current - siblings, 1);
        const rightSiblings = Math.min(current + siblings, total);
        const showLeftDots = leftSiblings > 2;
        const showRightDots = rightSiblings < total - 1;
        const pages: (number | '...')[] = [1];
        if (showLeftDots) pages.push('...');
        for (let i = leftSiblings; i <= rightSiblings; i++) if (i !== 1 && i !== total) pages.push(i);
        if (showRightDots) pages.push('...');
        pages.push(total);
        return pages;
    };

    const pages = getRange(currentPage, config.totalPages, config.siblingCount);

    const getButtonStyle = (isActive: boolean, isDisabled = false): React.CSSProperties => {
        const base: React.CSSProperties = { width: btnSize, height: btnSize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: isActive ? 700 : 600, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.35 : 1, transition: 'all 0.15s', border: 'none', flexShrink: 0 };
        const br = radius[config.variant];
        if (config.variant === 'outline') {
            return { ...base, border: `1.5px solid ${isActive ? tokens.colors.primary : 'var(--border)'}`, background: isActive ? tokens.colors.primary : 'transparent', color: isActive ? '#fff' : 'var(--foreground)', borderRadius: br };
        }
        if (config.variant === 'minimal') {
            return { ...base, background: 'transparent', color: isActive ? tokens.colors.primary : 'var(--muted-foreground)', fontWeight: isActive ? 900 : 500, borderBottom: isActive ? `2px solid ${tokens.colors.primary}` : '2px solid transparent' };
        }
        return { ...base, background: isActive ? tokens.colors.primary : 'var(--muted)', color: isActive ? '#fff' : 'var(--muted-foreground)', borderRadius: br };
    };

    const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
        width: btnSize, height: btnSize, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.3 : 1, transition: 'all 0.15s', border: config.variant === 'outline' ? '1.5px solid var(--border)' : 'none', background: config.variant === 'outline' || config.variant === 'minimal' ? 'transparent' : 'var(--muted)', borderRadius: config.variant === 'rounded' ? '50%' : `${tokens.radius * 0.4}rem`, color: 'var(--muted-foreground)',
    });

    const generateReactCode = () => `import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  variant?: 'default' | 'rounded' | 'minimal' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  showPageInfo?: boolean;
}

export const Pagination = ({ totalPages, defaultPage = 1, onChange, variant = '${config.variant}', size = '${config.size}', showFirstLast, showPageInfo }: PaginationProps) => {
  const [current, setCurrent] = useState(defaultPage);
  const go = (page: number) => { if (page < 1 || page > totalPages) return; setCurrent(page); onChange?.(page); };

  const getRange = (c: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (c > 3) pages.push('...');
    for (let i = Math.max(c - 1, 2); i <= Math.min(c + 1, total - 1); i++) pages.push(i);
    if (c < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  };

  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' };
  const base = cn('flex items-center justify-center font-semibold transition-all rounded-md', sizes[size]);

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => go(current - 1)} disabled={current === 1} className={cn(base, 'text-muted-foreground', current === 1 && 'opacity-30 cursor-not-allowed')}><ChevronLeft className="w-4 h-4" /></button>
      {getRange(current, totalPages).map((page, i) =>
        page === '...' ? <span key={'d' + i} className="px-1 text-muted-foreground">…</span> :
        <button key={page} onClick={() => go(page)} className={cn(base, page === current ? 'bg-primary text-white font-bold' : 'hover:bg-muted text-muted-foreground')}>{page}</button>
      )}
      <button onClick={() => go(current + 1)} disabled={current === totalPages} className={cn(base, 'text-muted-foreground', current === totalPages && 'opacity-30 cursor-not-allowed')}><ChevronRight className="w-4 h-4" /></button>
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
        const a = document.createElement('a'); a.href = url; a.download = 'Pagination.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const renderPaginator = (variant = config.variant, current = currentPage, onGo?: (p: number) => void) => {
        const go = onGo || setCurrentPage;
        const ps = getRange(current, config.totalPages, config.siblingCount);
        const vBtnSize = sz[config.size];
        const vFs = fs[config.size];
        const vRadius = { default: `${tokens.radius * 0.4}rem`, rounded: '50%', minimal: 0, outline: `${tokens.radius * 0.4}rem` };
        const getBtn = (isActive: boolean, isDisabled = false): React.CSSProperties => {
            const base: React.CSSProperties = { width: vBtnSize, height: vBtnSize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: vFs, fontWeight: isActive ? 700 : 600, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.35 : 1, transition: 'all 0.15s', border: 'none', flexShrink: 0 };
            if (variant === 'outline') return { ...base, border: `1.5px solid ${isActive ? tokens.colors.primary : 'var(--border)'}`, background: isActive ? tokens.colors.primary : 'transparent', color: isActive ? '#fff' : 'var(--foreground)', borderRadius: vRadius[variant] };
            if (variant === 'minimal') return { ...base, background: 'transparent', color: isActive ? tokens.colors.primary : 'var(--muted-foreground)', fontWeight: isActive ? 900 : 500, borderBottom: `2px solid ${isActive ? tokens.colors.primary : 'transparent'}` };
            return { ...base, background: isActive ? tokens.colors.primary : 'var(--muted)', color: isActive ? '#fff' : 'var(--muted-foreground)', borderRadius: vRadius[variant] };
        };
        const navBtn = (dis: boolean): React.CSSProperties => ({ width: vBtnSize, height: vBtnSize, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: dis ? 'not-allowed' : 'pointer', opacity: dis ? 0.3 : 1, transition: 'all 0.15s', border: variant === 'outline' ? '1.5px solid var(--border)' : 'none', background: variant === 'outline' || variant === 'minimal' ? 'transparent' : 'var(--muted)', borderRadius: variant === 'rounded' ? '50%' : `${tokens.radius * 0.4}rem`, color: 'var(--muted-foreground)' });
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: variant === 'minimal' ? 0 : 4 }}>
                {config.showFirst && <button style={navBtn(current === 1)} onClick={() => go(1)}><ChevronsLeft style={{ width: vFs, height: vFs }} /></button>}
                {config.showPrevNext && <button style={navBtn(current === 1)} onClick={() => go(Math.max(1, current - 1))}>{variant === 'default' ? <ChevronLeft style={{ width: vFs, height: vFs }} /> : <ArrowLeft style={{ width: vFs - 1, height: vFs - 1 }} />}</button>}
                {ps.map((p, i) => p === '...' ? (
                    <span key={`d${i}`} style={{ width: vBtnSize, textAlign: 'center', fontSize: vFs, color: 'var(--muted-foreground)', flexShrink: 0 }}>…</span>
                ) : (
                    <button key={p} style={getBtn(p === current)} onClick={() => go(p as number)}>{p}</button>
                ))}
                {config.showPrevNext && <button style={navBtn(current === config.totalPages)} onClick={() => go(Math.min(config.totalPages, current + 1))}>{variant === 'default' ? <ChevronRight style={{ width: vFs, height: vFs }} /> : <ArrowRight style={{ width: vFs - 1, height: vFs - 1 }} />}</button>}
                {config.showLast && <button style={navBtn(current === config.totalPages)} onClick={() => go(config.totalPages)}><ChevronsRight style={{ width: vFs, height: vFs }} /></button>}
            </div>
        );
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Pagination Builder</h2>
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
                                    { label: 'Variant', key: 'variant', opts: ['default', 'rounded', 'minimal', 'outline'] },
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
                                <div className="space-y-2">
                                    <Label className="text-xs">Total Pages</Label>
                                    <Input type="number" min={1} max={50} value={config.totalPages} onChange={e => { setConfig({ ...config, totalPages: parseInt(e.target.value) || 12 }); setCurrentPage(1); }} className="h-9" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Siblings Around Active Page</Label>
                                    <Input type="number" min={0} max={3} value={config.siblingCount} onChange={e => setConfig({ ...config, siblingCount: parseInt(e.target.value) || 1 })} className="h-9" />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Controls</Label>
                            {[
                                { label: 'Show Prev / Next', key: 'showPrevNext' },
                                { label: 'Show First / Last', key: 'showFirst' },
                                { label: 'Show Page Info', key: 'showPageInfo' },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <Label className="text-sm">{label}</Label>
                                    <Switch checked={(config as unknown as Record<string, boolean>)[key]} onCheckedChange={c => setConfig({ ...config, [key]: c })} />
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
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Interactive Preview</h4>
                            {config.showPageInfo && (
                                <p className="text-sm font-bold text-muted-foreground">Page {currentPage} of {config.totalPages}</p>
                            )}
                            {renderPaginator(config.variant, currentPage, setCurrentPage)}
                        </div>
                        <Separator />
                        <div className="space-y-8">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Variants</h4>
                            {(['default', 'rounded', 'minimal', 'outline'] as const).map(variant => (
                                <div key={variant} className="space-y-2">
                                    <p className="text-xs font-bold text-muted-foreground capitalize">{variant}</p>
                                    {renderPaginator(variant, 4)}
                                </div>
                            ))}
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

export default PaginationBuilder;
