import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Copy, Download, CheckCircle2, XCircle, Info, X, Lightbulb } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

const AlertBuilder = () => {
    const [config, setConfig] = useState({
        variant: 'info' as AlertVariant,
        style: 'soft' as 'soft' | 'solid' | 'outline' | 'left-border',
        rounded: 'lg' as 'sm' | 'md' | 'lg' | 'xl',
        showIcon: true,
        showTitle: true,
        dismissible: true,
        showAction: false,
        actionLabel: 'Learn more',
    });

    const [content, setContent] = useState({
        title: 'Informational Alert',
        description: 'This is a helpful message to inform you about something important.',
    });

    const variants: Record<AlertVariant, { icon: React.ReactNode; colors: Record<string, string> }> = {
        info: { icon: <Info className="w-5 h-5" />, colors: { soft: '#eff6ff', solid: '#3b82f6', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6', leftBorder: '#3b82f6' } },
        success: { icon: <CheckCircle2 className="w-5 h-5" />, colors: { soft: '#f0fdf4', solid: '#22c55e', border: '#bbf7d0', text: '#15803d', icon: '#22c55e', leftBorder: '#22c55e' } },
        warning: { icon: <AlertTriangle className="w-5 h-5" />, colors: { soft: '#fffbeb', solid: '#f59e0b', border: '#fde68a', text: '#92400e', icon: '#f59e0b', leftBorder: '#f59e0b' } },
        error: { icon: <XCircle className="w-5 h-5" />, colors: { soft: '#fef2f2', solid: '#ef4444', border: '#fecaca', text: '#991b1b', icon: '#ef4444', leftBorder: '#ef4444' } },
        neutral: { icon: <Lightbulb className="w-5 h-5" />, colors: { soft: 'var(--muted)', solid: 'var(--foreground)', border: 'var(--border)', text: 'var(--foreground)', icon: 'var(--muted-foreground)', leftBorder: 'var(--border)' } },
    };

    const borderRadii = { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' };

    const getAlertStyle = (variant: AlertVariant, style: typeof config.style) => {
        const c = variants[variant].colors;
        if (style === 'solid') return { bg: c.solid, border: c.solid, text: '#fff', iconColor: '#fff' };
        if (style === 'outline') return { bg: 'transparent', border: c.border, text: c.text, iconColor: c.icon };
        if (style === 'left-border') return { bg: c.soft, border: 'transparent', text: c.text, iconColor: c.icon, leftBorder: `4px solid ${c.leftBorder}` };
        return { bg: c.soft, border: c.border, text: c.text, iconColor: c.icon };
    };

    const renderAlert = (v: AlertVariant, s = config.style, dismissible = config.dismissible) => {
        const [dismissed, setDismissed] = React.useState(false);
        if (dismissed) return <div key={v} className="text-xs text-muted-foreground italic">Alert dismissed</div>;
        const style = getAlertStyle(v, s);
        return (
            <div key={v} style={{ background: style.bg, border: `1.5px solid ${style.border}`, color: style.text, borderRadius: borderRadii[config.rounded], padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', borderLeft: style.leftBorder || undefined }}>
                {config.showIcon && <span style={{ color: style.iconColor, flexShrink: 0, marginTop: 1 }}>{variants[v].icon}</span>}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {config.showTitle && <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{content.title}</div>}
                    <div style={{ fontSize: 13, opacity: 0.9 }}>{content.description}</div>
                    {config.showAction && (
                        <button style={{ marginTop: 10, fontWeight: 700, fontSize: 12, background: 'transparent', border: `1.5px solid ${style.iconColor}`, borderRadius: '0.375rem', padding: '3px 10px', cursor: 'pointer', color: style.text }}>
                            {config.actionLabel}
                        </button>
                    )}
                </div>
                {dismissible && (
                    <button onClick={() => setDismissed(true)} style={{ opacity: 0.5, cursor: 'pointer', background: 'transparent', border: 'none', padding: 2, flexShrink: 0 }}>
                        <X style={{ width: 14, height: 14 }} />
                    </button>
                )}
            </div>
        );
    };

    const allVariants: AlertVariant[] = ['info', 'success', 'warning', 'error', 'neutral'];

    const generateReactCode = () => `import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';
type AlertStyle = 'soft' | 'solid' | 'outline' | 'left-border';

interface AlertProps {
  variant?: AlertVariant;
  style?: AlertStyle;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  action?: { label: string; onClick: () => void };
  className?: string;
}

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle, neutral: Info };
const styles = {
  info:    { soft: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200' },
  success: { soft: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200' },
  warning: { soft: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200' },
  error:   { soft: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200' },
  neutral: { soft: 'bg-muted border-border text-foreground' },
};

export const Alert = ({ variant = 'info', title, children, dismissible, action, className }: AlertProps) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const Icon = icons[variant];
  const s = styles[variant].soft;
  return (
    <div role="alert" className={cn('relative flex gap-3 items-start rounded-lg border p-4', s, className)}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-bold text-sm mb-1">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
        {action && <button onClick={action.onClick} className="mt-2 text-xs font-bold underline">{action.label}</button>}
      </div>
      {dismissible && <button onClick={() => setDismissed(true)} className="opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>}
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
        const a = document.createElement('a'); a.href = url; a.download = 'Alert.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Alert Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Component Workbench</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Appearance</Label>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs">Variant</Label>
                                    <Select value={config.variant} onValueChange={v => setConfig({ ...config, variant: v as AlertVariant })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {allVariants.map(v => <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Style</Label>
                                    <Select value={config.style} onValueChange={v => setConfig({ ...config, style: v as typeof config.style })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['soft', 'solid', 'outline', 'left-border'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Border Radius</Label>
                                    <Select value={config.rounded} onValueChange={v => setConfig({ ...config, rounded: v as typeof config.rounded })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['sm', 'md', 'lg', 'xl'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Options</Label>
                            {[
                                { label: 'Show Icon', key: 'showIcon' },
                                { label: 'Show Title', key: 'showTitle' },
                                { label: 'Dismissible', key: 'dismissible' },
                                { label: 'Show Action', key: 'showAction' },
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
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Content</Label>
                            <div className="space-y-2">
                                <Label className="text-xs">Title</Label>
                                <Input value={content.title} onChange={e => setContent({ ...content, title: e.target.value })} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Description</Label>
                                <Input value={content.description} onChange={e => setContent({ ...content, description: e.target.value })} className="h-9 text-sm" />
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
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Selected Configuration</h4>
                            {renderAlert(config.variant)}
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Variants ({config.style})</h4>
                            <div className="space-y-3">
                                {allVariants.map(v => renderAlert(v, config.style, false))}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Style Comparison</h4>
                            {(['soft', 'solid', 'outline', 'left-border'] as const).map(style => {
                                const s = getAlertStyle(config.variant, style);
                                return (
                                    <div key={style}>
                                        <p className="text-xs font-bold text-muted-foreground mb-2">{style}</p>
                                        <div style={{ background: s.bg, border: `1.5px solid ${s.border}`, color: s.text, borderRadius: borderRadii[config.rounded], padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start', borderLeft: s.leftBorder || undefined }}>
                                            {config.showIcon && <span style={{ color: s.iconColor, flexShrink: 0 }}>{variants[config.variant].icon}</span>}
                                            <div>
                                                {config.showTitle && <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{content.title}</div>}
                                                <div style={{ fontSize: 12, opacity: 0.9 }}>{content.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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

export default AlertBuilder;
