import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, Copy, Download, CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';

const ToastBuilder = () => {
    const [activeTab, setActiveTab] = useState('config');
    const [activeToast, setActiveToast] = useState<ToastType | null>(null);

    const [config, setConfig] = useState({
        position: 'top-right' as ToastPosition,
        duration: 4000,
        showIcon: true,
        showClose: true,
        showProgress: true,
        showAction: false,
        actionLabel: 'Undo',
        rounded: 'lg' as 'sm' | 'md' | 'lg' | 'xl' | 'full',
        style: 'default' as 'default' | 'filled' | 'minimal',
    });

    const [content, setContent] = useState({
        success: { title: 'Changes saved!', description: 'Your changes have been saved successfully.' },
        error: { title: 'Something went wrong', description: 'An error occurred. Please try again.' },
        warning: { title: 'Heads up!', description: 'This action might have unintended side effects.' },
        info: { title: 'New update available', description: 'A new version of the app is ready to install.' },
    });

    const types: { id: ToastType; icon: React.ReactNode; colors: Record<string, string> }[] = [
        { id: 'success', icon: <CheckCircle2 className="w-5 h-5" />, colors: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', icon: '#22c55e', filled: '#22c55e' } },
        { id: 'error', icon: <XCircle className="w-5 h-5" />, colors: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', icon: '#ef4444', filled: '#ef4444' } },
        { id: 'warning', icon: <AlertTriangle className="w-5 h-5" />, colors: { bg: '#fffbeb', border: '#fde68a', text: '#d97706', icon: '#f59e0b', filled: '#f59e0b' } },
        { id: 'info', icon: <Info className="w-5 h-5" />, colors: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', icon: '#3b82f6', filled: '#3b82f6' } },
    ];

    const borderRadii = { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '1.5rem' };

    const getToastStyle = (colors: Record<string, string>) => {
        if (config.style === 'filled') return { background: colors.filled, borderColor: colors.filled, color: '#fff' };
        if (config.style === 'minimal') return { background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' };
        return { background: colors.bg, borderColor: colors.border, color: colors.text };
    };

    const renderToast = (t: typeof types[0], previewActive = false) => {
        const style = getToastStyle(t.colors);
        const isFilled = config.style === 'filled';
        const isMinimal = config.style === 'minimal';
        return (
            <div key={t.id} style={{
                border: `1.5px solid ${style.borderColor}`,
                background: style.background,
                color: style.color,
                borderRadius: borderRadii[config.rounded],
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                minWidth: 300,
                maxWidth: 400,
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                position: 'relative',
                overflow: 'hidden',
                opacity: previewActive && activeToast !== t.id ? 0.4 : 1,
                transition: 'opacity 0.2s',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {config.showIcon && (
                        <span style={{ color: isFilled ? '#fff' : isMinimal ? t.colors.icon : t.colors.icon, flexShrink: 0, marginTop: 1 }}>
                            {t.icon}
                        </span>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{content[t.id].title}</div>
                        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{content[t.id].description}</div>
                        {config.showAction && (
                            <button style={{ marginTop: 8, fontWeight: 700, fontSize: 12, background: 'transparent', border: `1.5px solid ${isFilled ? 'rgba(255,255,255,0.4)' : style.borderColor}`, borderRadius: '0.375rem', padding: '3px 10px', cursor: 'pointer', color: isFilled ? '#fff' : style.color }}>
                                {config.actionLabel}
                            </button>
                        )}
                    </div>
                    {config.showClose && (
                        <button style={{ opacity: 0.5, cursor: 'pointer', background: 'transparent', border: 'none', padding: 2, flexShrink: 0 }}>
                            <X style={{ width: 14, height: 14 }} />
                        </button>
                    )}
                </div>
                {config.showProgress && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: isFilled ? 'rgba(255,255,255,0.3)' : t.colors.border }}>
                        <div style={{ width: '60%', height: '100%', background: isFilled ? '#fff' : t.colors.icon, borderRadius: 99 }} />
                    </div>
                )}
            </div>
        );
    };

    const generateReactCode = () => `import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
  showProgress?: boolean;
  action?: { label: string; onClick: () => void };
  onDismiss: (id: string) => void;
}

const icons = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };
const styles = {
  success: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-200 dark:border-green-800', icon: 'text-green-500', bar: 'bg-green-400' },
  error:   { bg: 'bg-red-50 dark:bg-red-950',   border: 'border-red-200 dark:border-red-800',   icon: 'text-red-500',   bar: 'bg-red-400' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-500', bar: 'bg-amber-400' },
  info:    { bg: 'bg-blue-50 dark:bg-blue-950',  border: 'border-blue-200 dark:border-blue-800',  icon: 'text-blue-500',  bar: 'bg-blue-400' },
};

export const Toast = ({ id, type = 'info', title, description, duration = 4000, showProgress = true, action, onDismiss }: ToastProps) => {
  const [progress, setProgress] = useState(100);
  const s = styles[type];
  const Icon = icons[type];

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
    }, 50);
    const timeout = setTimeout(() => onDismiss(id), duration);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [id, duration, onDismiss]);

  return (
    <div className={cn('relative overflow-hidden rounded-${config.rounded} border shadow-lg p-4 w-80 flex gap-3', s.bg, s.border)}>
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', s.icon)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">{title}</p>
        {description && <p className="text-xs opacity-75 mt-0.5">{description}</p>}
        {action && <button onClick={action.onClick} className="mt-2 text-xs font-bold underline underline-offset-2">{action.label}</button>}
      </div>
      <button onClick={() => onDismiss(id)} className="shrink-0 opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
      {showProgress && <div className="absolute bottom-0 left-0 h-0.5 bg-black/10 right-0"><div className={cn('h-full', s.bar)} style={{ width: \`\${progress}%\` }} /></div>}
    </div>
  );
};

// Usage:
// const [toasts, setToasts] = useState<ToastProps[]>([]);
// const addToast = (t: Omit<ToastProps, 'id' | 'onDismiss'>) => setToasts(prev => [...prev, { ...t, id: crypto.randomUUID(), onDismiss: id => setToasts(p => p.filter(t => t.id !== id)) }]);
`;

    const copyCode = async () => {
        try { await navigator.clipboard.writeText(generateReactCode()); }
        catch { const ta = document.createElement('textarea'); ta.value = generateReactCode(); document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    };

    const exportComponent = () => {
        const blob = new Blob([generateReactCode()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'Toast.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Toast Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-90">Component Workbench</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
                                <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
                            </TabsList>

                            <TabsContent value="config" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Appearance</Label>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Style', key: 'style', opts: ['default', 'filled', 'minimal'] },
                                            { label: 'Position', key: 'position', opts: ['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'] },
                                            { label: 'Border Radius', key: 'rounded', opts: ['sm', 'md', 'lg', 'xl', 'full'] },
                                        ].map(({ label, key, opts }) => (
                                            <div key={key} className="space-y-2">
                                                <Label className="text-xs">{label}</Label>
                                                <Select value={(config as Record<string, string>)[key]} onValueChange={v => setConfig({ ...config, [key]: v })}>
                                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                    <SelectContent>{opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Duration (ms)</Label>
                                            <Input type="number" step={500} min={1000} max={10000} value={config.duration} onChange={e => setConfig({ ...config, duration: parseInt(e.target.value) || 4000 })} className="h-9" />
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-90">Options</Label>
                                    {[
                                        { label: 'Show Icon', key: 'showIcon' },
                                        { label: 'Show Close Button', key: 'showClose' },
                                        { label: 'Show Progress Bar', key: 'showProgress' },
                                        { label: 'Show Action Button', key: 'showAction' },
                                    ].map(({ label, key }) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <Label className="text-sm">{label}</Label>
                                            <Switch checked={(config as Record<string, boolean>)[key]} onCheckedChange={c => setConfig({ ...config, [key]: c })} />
                                        </div>
                                    ))}
                                    {config.showAction && (
                                        <div className="space-y-2">
                                            <Label className="text-xs">Action Label</Label>
                                            <Input value={config.actionLabel} onChange={e => setConfig({ ...config, actionLabel: e.target.value })} className="h-9" />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="space-y-6 mt-6">
                                {types.map(t => (
                                    <div key={t.id} className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-wider opacity-90 capitalize">{t.id}</Label>
                                        <div className="space-y-2">
                                            <Input placeholder="Title" value={content[t.id].title} onChange={e => setContent({ ...content, [t.id]: { ...content[t.id], title: e.target.value } })} className="h-9 text-sm" />
                                            <Input placeholder="Description" value={content[t.id].description} onChange={e => setContent({ ...content, [t.id]: { ...content[t.id], description: e.target.value } })} className="h-9 text-sm" />
                                        </div>
                                        <Separator />
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
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
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">All Variants — Click to focus</h4>
                            <div className="flex flex-col gap-3">
                                {types.map(t => (
                                    <div key={t.id} onClick={() => setActiveToast(activeToast === t.id ? null : t.id)} style={{ cursor: 'pointer' }}>
                                        {renderToast(t, !!activeToast)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-90">Style Comparison</h4>
                            {(['default', 'filled', 'minimal'] as const).map(style => (
                                <div key={style}>
                                    <p className="text-xs font-bold text-muted-foreground mb-3 capitalize">{style}</p>
                                    <div className="flex flex-col gap-2">
                                        {types.slice(0, 2).map(t => {
                                            const s = config.style;
                                            // temporarily override style for comparison
                                            const overrideCfg = { ...config, style };
                                            const overrideStyle = style === 'filled'
                                                ? { background: t.colors.filled, borderColor: t.colors.filled, color: '#fff' }
                                                : style === 'minimal'
                                                    ? { background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }
                                                    : { background: t.colors.bg, borderColor: t.colors.border, color: t.colors.text };
                                            return (
                                                <div key={t.id} style={{ border: `1.5px solid ${overrideStyle.borderColor}`, background: overrideStyle.background, color: overrideStyle.color, borderRadius: borderRadii[config.rounded], padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', minWidth: 240 }}>
                                                    {config.showIcon && <span style={{ color: style === 'filled' ? '#fff' : t.colors.icon, flexShrink: 0 }}>{t.icon}</span>}
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: 13 }}>{content[t.id].title}</div>
                                                        <div style={{ fontSize: 11, opacity: 0.75 }}>{content[t.id].description}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
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

export default ToastBuilder;
