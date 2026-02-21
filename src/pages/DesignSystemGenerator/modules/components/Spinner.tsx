import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

const SpinnerBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [config, setConfig] = useState({
        type: 'spinner' as 'spinner' | 'dots' | 'bars' | 'ring' | 'pulse',
        size: 'md' as 'xs' | 'sm' | 'md' | 'lg' | 'xl',
        color: tokens.colors.primary,
        speed: 'normal' as 'slow' | 'normal' | 'fast',
        showProgress: true,
        progressValue: 65,
        progressStyle: 'bar' as 'bar' | 'circular' | 'steps',
        progressLabel: true,
        thickness: 3,
        steps: 4,
        currentStep: 2,
    });

    const sizes = { xs: 16, sm: 24, md: 36, lg: 48, xl: 64 };
    const speeds = { slow: '1.5s', normal: '0.9s', fast: '0.5s' };
    const sz = sizes[config.size];

    const generateReactCode = () => `import React from 'react';
import { cn } from '@/lib/utils';

export const Spinner = ({ size = 'md', color }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; color?: string }) => {
  const sizes = { xs: 'w-4 h-4 border-[2px]', sm: 'w-6 h-6 border-2', md: 'w-9 h-9 border-[3px]', lg: 'w-12 h-12 border-4', xl: 'w-16 h-16 border-4' };
  return <div className={cn('rounded-full border-primary/20 border-t-primary animate-spin', sizes[size])} style={color ? { borderColor: color + '33', borderTopColor: color } : undefined} />;
};

interface ProgressBarProps { value: number; max?: number; label?: boolean; color?: string; className?: string; }
export const ProgressBar = ({ value, max = 100, label, color, className }: ProgressBarProps) => (
  <div className={cn('space-y-1.5', className)}>
    {label && <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>Progress</span><span>{Math.round(value)}%</span></div>}
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: \`\${Math.min(100, value)}%\`, ...(color ? { background: color } : {}) }} />
    </div>
  </div>
);

interface StepperProps { steps: string[]; current: number; color?: string; }
export const Stepper = ({ steps, current, color }: StepperProps) => (
  <div className="flex items-center gap-0">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center gap-1">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all', i < current ? 'border-primary bg-primary text-primary-foreground' : i === current ? 'border-primary text-primary bg-background' : 'border-muted text-muted-foreground bg-background')} style={color ? { borderColor: i <= current ? color : undefined, background: i < current ? color : undefined } : undefined}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={cn('text-[10px] font-bold', i <= current ? 'text-foreground' : 'text-muted-foreground')}>{step}</span>
        </div>
        {i < steps.length - 1 && <div className={cn('flex-1 h-0.5 mb-4 min-w-8', i < current ? 'bg-primary' : 'bg-muted')} style={color && i < current ? { background: color } : undefined} />}
      </React.Fragment>
    ))}
  </div>
);
`;

    const copyCode = async () => {
        try { await navigator.clipboard.writeText(generateReactCode()); }
        catch { const t = document.createElement('textarea'); t.value = generateReactCode(); document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
    };

    const exportComponent = () => {
        const blob = new Blob([generateReactCode()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'Spinner.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const renderSpinner = (sz: number) => {
        const strokeWidth = config.thickness;
        const animClass = `spin-${config.speed}`;
        if (config.type === 'dots') {
            return (
                <div style={{ display: 'flex', gap: sz * 0.2, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            width: sz * 0.25, height: sz * 0.25, borderRadius: '50%', background: config.color,
                            animation: `pulse ${speeds[config.speed]} ease-in-out ${i * 0.15}s infinite`,
                        }} />
                    ))}
                </div>
            );
        }
        if (config.type === 'bars') {
            return (
                <div style={{ display: 'flex', gap: sz * 0.12, alignItems: 'center', height: sz }}>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{
                            width: sz * 0.18, height: sz * (0.4 + Math.sin(i * 1.2) * 0.3),
                            background: config.color, borderRadius: 99,
                            animation: `barPulse ${speeds[config.speed]} ease-in-out ${i * 0.12}s infinite`,
                        }} />
                    ))}
                </div>
            );
        }
        if (config.type === 'ring') {
            return (
                <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ animation: `spin ${speeds[config.speed]} linear infinite` }}>
                    <circle cx={sz / 2} cy={sz / 2} r={(sz - strokeWidth * 2) / 2} fill="none" stroke={config.color + '25'} strokeWidth={strokeWidth} />
                    <circle cx={sz / 2} cy={sz / 2} r={(sz - strokeWidth * 2) / 2} fill="none" stroke={config.color} strokeWidth={strokeWidth}
                        strokeDasharray={`${Math.PI * (sz - strokeWidth * 2) * 0.7} ${Math.PI * (sz - strokeWidth * 2) * 0.3}`}
                        strokeLinecap="round" />
                </svg>
            );
        }
        if (config.type === 'pulse') {
            return (
                <div style={{ position: 'relative', width: sz, height: sz }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: config.color + '30', animation: `ping ${speeds[config.speed]} ease-out infinite` }} />
                    <div style={{ width: sz * 0.5, height: sz * 0.5, borderRadius: '50%', background: config.color, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </div>
            );
        }
        // default spinner
        return (
            <div style={{
                width: sz, height: sz, borderRadius: '50%',
                border: `${strokeWidth}px solid ${config.color}25`,
                borderTopColor: config.color,
                animation: `spin ${speeds[config.speed]} linear infinite`,
            }} />
        );
    };

    const circumference = Math.PI * 2 * (sz / 2 - config.thickness - 2);
    const progressOffset = circumference * (1 - config.progressValue / 100);

    const stepLabels = ['Setup', 'Configure', 'Review', 'Done'].slice(0, config.steps);

    return (
        <div className="h-full flex overflow-hidden">
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
                @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.4); opacity: 1; } }
                @keyframes barPulse { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }
            `}</style>

            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Spinner & Progress</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Component Workbench</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Spinner</Label>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs">Type</Label>
                                    <Select value={config.type} onValueChange={v => setConfig({ ...config, type: v as typeof config.type })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['spinner', 'ring', 'dots', 'bars', 'pulse'].map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Size</Label>
                                    <Select value={config.size} onValueChange={v => setConfig({ ...config, size: v as typeof config.size })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => <SelectItem key={s} value={s}>{s.toUpperCase()} — {sizes[s]}px</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Speed</Label>
                                    <Select value={config.speed} onValueChange={v => setConfig({ ...config, speed: v as typeof config.speed })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="slow">Slow</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="fast">Fast</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Stroke Width</Label>
                                    <Input type="number" min={1} max={8} value={config.thickness} onChange={e => setConfig({ ...config, thickness: parseInt(e.target.value) || 3 })} className="h-9" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" value={config.color} onChange={e => setConfig({ ...config, color: e.target.value })} className="w-12 h-9 p-1" />
                                        <Input value={config.color} onChange={e => setConfig({ ...config, color: e.target.value })} className="flex-1 h-9 font-mono text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Progress</Label>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Show Progress</Label>
                                <Switch checked={config.showProgress} onCheckedChange={c => setConfig({ ...config, showProgress: c })} />
                            </div>
                            {config.showProgress && (
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Style</Label>
                                        <Select value={config.progressStyle} onValueChange={v => setConfig({ ...config, progressStyle: v as typeof config.progressStyle })}>
                                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bar">Bar</SelectItem>
                                                <SelectItem value="circular">Circular</SelectItem>
                                                <SelectItem value="steps">Steps</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {config.progressStyle !== 'steps' && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><Label className="text-xs">Value</Label><span className="text-xs font-mono">{config.progressValue}%</span></div>
                                            <input type="range" min={0} max={100} value={config.progressValue} onChange={e => setConfig({ ...config, progressValue: parseInt(e.target.value) })} className="w-full accent-primary" />
                                        </div>
                                    )}
                                    {config.progressStyle === 'steps' && (
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Number of Steps</Label>
                                                <Input type="number" min={2} max={6} value={config.steps} onChange={e => setConfig({ ...config, steps: parseInt(e.target.value) || 4 })} className="h-9" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">Current Step</Label>
                                                <Input type="number" min={0} max={config.steps} value={config.currentStep} onChange={e => setConfig({ ...config, currentStep: parseInt(e.target.value) || 0 })} className="h-9" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Show Label</Label>
                                        <Switch checked={config.progressLabel} onCheckedChange={c => setConfig({ ...config, progressLabel: c })} />
                                    </div>
                                </div>
                            )}
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
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Spinner</h4>
                            <div className="flex items-center justify-center p-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
                                {renderSpinner(sz)}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Spinner Types</h4>
                            <div className="flex flex-wrap items-center gap-10">
                                {(['spinner', 'ring', 'dots', 'bars', 'pulse'] as const).map(type => {
                                    const prevConfig = { ...config, type };
                                    const thisSz = sizes[config.size];
                                    const strokeWidth = config.thickness;
                                    return (
                                        <div key={type} className="flex flex-col items-center gap-3">
                                            {type === 'dots' ? (
                                                <div style={{ display: 'flex', gap: thisSz * 0.2, alignItems: 'center' }}>
                                                    {[0, 1, 2].map(i => (<div key={i} style={{ width: thisSz * 0.25, height: thisSz * 0.25, borderRadius: '50%', background: config.color, animation: `pulse ${speeds[config.speed]} ease-in-out ${i * 0.15}s infinite` }} />))}
                                                </div>
                                            ) : type === 'bars' ? (
                                                <div style={{ display: 'flex', gap: thisSz * 0.12, alignItems: 'center', height: thisSz }}>
                                                    {[0, 1, 2, 3].map(i => (<div key={i} style={{ width: thisSz * 0.18, height: thisSz * (0.4 + Math.sin(i * 1.2) * 0.3), background: config.color, borderRadius: 99, animation: `barPulse ${speeds[config.speed]} ease-in-out ${i * 0.12}s infinite` }} />))}
                                                </div>
                                            ) : type === 'pulse' ? (
                                                <div style={{ position: 'relative', width: thisSz, height: thisSz }}>
                                                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: config.color + '30', animation: `ping ${speeds[config.speed]} ease-out infinite` }} />
                                                    <div style={{ width: thisSz * 0.5, height: thisSz * 0.5, borderRadius: '50%', background: config.color, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                                                </div>
                                            ) : type === 'ring' ? (
                                                <svg width={thisSz} height={thisSz} viewBox={`0 0 ${thisSz} ${thisSz}`} style={{ animation: `spin ${speeds[config.speed]} linear infinite` }}>
                                                    <circle cx={thisSz / 2} cy={thisSz / 2} r={(thisSz - strokeWidth * 2) / 2} fill="none" stroke={config.color + '25'} strokeWidth={strokeWidth} />
                                                    <circle cx={thisSz / 2} cy={thisSz / 2} r={(thisSz - strokeWidth * 2) / 2} fill="none" stroke={config.color} strokeWidth={strokeWidth} strokeDasharray={`${Math.PI * (thisSz - strokeWidth * 2) * 0.7} ${Math.PI * (thisSz - strokeWidth * 2) * 0.3}`} strokeLinecap="round" />
                                                </svg>
                                            ) : (
                                                <div style={{ width: thisSz, height: thisSz, borderRadius: '50%', border: `${strokeWidth}px solid ${config.color}25`, borderTopColor: config.color, animation: `spin ${speeds[config.speed]} linear infinite` }} />
                                            )}
                                            <span className="text-[10px] font-bold text-muted-foreground capitalize">{type}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {config.showProgress && (
                            <>
                                <Separator />
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Progress</h4>
                                    {config.progressStyle === 'bar' && (
                                        <div className="space-y-2 max-w-md">
                                            {config.progressLabel && (
                                                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                                    <span>Progress</span><span>{config.progressValue}%</span>
                                                </div>
                                            )}
                                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                                <div style={{ width: `${config.progressValue}%`, height: '100%', background: config.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                                            </div>
                                        </div>
                                    )}
                                    {config.progressStyle === 'circular' && (
                                        <div className="flex items-center gap-6">
                                            <div style={{ position: 'relative', width: sz * 2, height: sz * 2 }}>
                                                <svg width={sz * 2} height={sz * 2} viewBox={`0 0 ${sz * 2} ${sz * 2}`} style={{ transform: 'rotate(-90deg)' }}>
                                                    <circle cx={sz} cy={sz} r={sz - config.thickness - 2} fill="none" stroke={config.color + '20'} strokeWidth={config.thickness + 2} />
                                                    <circle cx={sz} cy={sz} r={sz - config.thickness - 2} fill="none" stroke={config.color} strokeWidth={config.thickness + 2}
                                                        strokeDasharray={circumference} strokeDashoffset={progressOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                                                </svg>
                                                {config.progressLabel && (
                                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: sz * 0.35, color: config.color }}>
                                                        {config.progressValue}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {config.progressStyle === 'steps' && (
                                        <div className="flex items-center gap-0 max-w-lg">
                                            {stepLabels.map((step, i) => (
                                                <React.Fragment key={step}>
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, border: `2px solid ${i < config.currentStep ? config.color : i === config.currentStep ? config.color : 'var(--border)'}`, background: i < config.currentStep ? config.color : 'transparent', color: i < config.currentStep ? '#fff' : i === config.currentStep ? config.color : 'var(--muted-foreground)' }}>
                                                            {i < config.currentStep ? '✓' : i + 1}
                                                        </div>
                                                        <span style={{ fontSize: 11, fontWeight: 600, color: i <= config.currentStep ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{step}</span>
                                                    </div>
                                                    {i < stepLabels.length - 1 && (
                                                        <div style={{ flex: 1, height: 2, background: i < config.currentStep ? config.color : 'var(--muted)', marginBottom: 20, minWidth: 24 }} />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

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

export default SpinnerBuilder;
