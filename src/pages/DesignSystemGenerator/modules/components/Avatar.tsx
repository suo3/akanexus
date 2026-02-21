import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserCircle2, Copy, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AvatarBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('config');

    const [config, setConfig] = useState({
        size: 'md' as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
        shape: 'circle' as 'circle' | 'rounded' | 'square',
        showStatus: true,
        status: 'online' as 'online' | 'away' | 'busy' | 'offline',
        showInitialsFallback: true,
        initials: 'AK',
        showBorder: false,
        groupCount: 4,
        showGroup: true,
    });

    const sizes = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 96 };
    const px = sizes[config.size];
    const borderRadius = config.shape === 'circle' ? '50%' : config.shape === 'rounded' ? `${tokens.radius * 0.75}rem` : '0.25rem';
    const statusColors = { online: '#22c55e', away: '#f59e0b', busy: '#ef4444', offline: '#94a3b8' };
    const statusSize = px <= 32 ? 7 : px <= 48 ? 9 : 12;
    const statusOffset = px <= 32 ? 1 : 2;

    const sampleUsers = [
        { initials: 'AK', color: tokens.colors.primary },
        { initials: 'JD', color: '#8b5cf6' },
        { initials: 'SM', color: '#ec4899' },
        { initials: 'LN', color: '#f59e0b' },
        { initials: 'RB', color: '#10b981' },
    ];

    const generateReactCode = () => `import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded' | 'square';
  status?: 'online' | 'away' | 'busy' | 'offline';
  showBorder?: boolean;
}

const sizeMap = { xs: 'w-6 h-6 text-[9px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl', '2xl': 'w-24 h-24 text-3xl' };
const shapeMap = { circle: 'rounded-full', rounded: 'rounded-xl', square: 'rounded-sm' };
const statusMap = { online: 'bg-green-500', away: 'bg-amber-500', busy: 'bg-red-500', offline: 'bg-slate-400' };

export const Avatar = ({ src, alt, initials, size = 'md', shape = 'circle', status, showBorder }: AvatarProps) => (
  <div className="relative inline-flex shrink-0">
    <div className={cn('flex items-center justify-center font-bold overflow-hidden bg-primary/20 text-primary', sizeMap[size], shapeMap[shape], showBorder && 'ring-2 ring-background ring-offset-1')}>
      {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : <span>{initials}</span>}
    </div>
    {status && (
      <span className={cn('absolute bottom-0 right-0 rounded-full border-2 border-background', statusMap[status],
        size === 'xs' || size === 'sm' ? 'w-2 h-2' : size === 'md' || size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'
      )} />
    )}
  </div>
);

export const AvatarGroup = ({ users, max = 4 }: { users: AvatarProps[], max?: number }) => (
  <div className="flex -space-x-3">
    {users.slice(0, max).map((u, i) => <Avatar key={i} {...u} showBorder />)}
    {users.length > max && (
      <div className={cn('flex items-center justify-center font-bold bg-muted border-2 border-background text-muted-foreground rounded-full', sizeMap['md'])}>
        +{users.length - max}
      </div>
    )}
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
        const a = document.createElement('a'); a.href = url; a.download = 'Avatar.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const renderAvatar = (user: { initials: string; color: string }, overrideSize?: number) => {
        const sz = overrideSize ?? px;
        const fontSize = sz <= 24 ? 9 : sz <= 32 ? 11 : sz <= 40 ? 13 : sz <= 48 ? 15 : sz <= 64 ? 20 : 30;
        const br = overrideSize ? (config.shape === 'circle' ? '50%' : config.shape === 'rounded' ? `${tokens.radius * 0.75}rem` : '0.25rem') : borderRadius;
        return (
            <div style={{ width: sz, height: sz, borderRadius: br, background: user.color + '25', color: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize, flexShrink: 0, boxSizing: 'border-box', ...(config.showBorder ? { outline: '2px solid var(--background)', outlineOffset: 1 } : {}) }}>
                {config.showInitialsFallback ? user.initials : <UserCircle2 style={{ width: sz * 0.55, height: sz * 0.55, opacity: 0.5 }} />}
            </div>
        );
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <UserCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Avatar Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Component Workbench</p>
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
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Size & Shape</Label>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Size</Label>
                                            <Select value={config.size} onValueChange={(v: typeof config.size) => setConfig({ ...config, size: v })}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(s => (
                                                        <SelectItem key={s} value={s}>{s.toUpperCase()} — {sizes[s]}px</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Shape</Label>
                                            <Select value={config.shape} onValueChange={(v: typeof config.shape) => setConfig({ ...config, shape: v })}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="circle">Circle</SelectItem>
                                                    <SelectItem value="rounded">Rounded</SelectItem>
                                                    <SelectItem value="square">Square</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Options</Label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Show Status Indicator</Label>
                                            <Switch checked={config.showStatus} onCheckedChange={c => setConfig({ ...config, showStatus: c })} />
                                        </div>
                                        {config.showStatus && (
                                            <div className="space-y-2 pl-1">
                                                <Label className="text-xs">Status</Label>
                                                <Select value={config.status} onValueChange={(v: typeof config.status) => setConfig({ ...config, status: v })}>
                                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="online">🟢 Online</SelectItem>
                                                        <SelectItem value="away">🟡 Away</SelectItem>
                                                        <SelectItem value="busy">🔴 Busy</SelectItem>
                                                        <SelectItem value="offline">⚫ Offline</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Show Initials Fallback</Label>
                                            <Switch checked={config.showInitialsFallback} onCheckedChange={c => setConfig({ ...config, showInitialsFallback: c })} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Border Ring</Label>
                                            <Switch checked={config.showBorder} onCheckedChange={c => setConfig({ ...config, showBorder: c })} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Show Avatar Group</Label>
                                            <Switch checked={config.showGroup} onCheckedChange={c => setConfig({ ...config, showGroup: c })} />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Content</Label>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Fallback Initials</Label>
                                        <Input value={config.initials} maxLength={2} onChange={e => setConfig({ ...config, initials: e.target.value.toUpperCase() })} className="h-9 font-mono text-sm" placeholder="AK" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Group Max Shown</Label>
                                        <Input type="number" min={2} max={8} value={config.groupCount} onChange={e => setConfig({ ...config, groupCount: parseInt(e.target.value) || 3 })} className="h-9" />
                                    </div>
                                </div>
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
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Single Avatar</h4>
                            <div className="flex items-center justify-center p-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
                                <div className="relative inline-flex">
                                    {renderAvatar(sampleUsers[0])}
                                    {config.showStatus && (
                                        <span style={{ position: 'absolute', bottom: statusOffset, right: statusOffset, width: statusSize, height: statusSize, borderRadius: '50%', background: statusColors[config.status], border: '2px solid var(--background)' }} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Sizes</h4>
                            <div className="flex items-end gap-4 flex-wrap">
                                {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(s => {
                                    const sz = sizes[s];
                                    const ss = sz <= 32 ? 7 : sz <= 48 ? 9 : 12;
                                    const so = sz <= 32 ? 1 : 2;
                                    return (
                                        <div key={s} className="flex flex-col items-center gap-2">
                                            <div className="relative inline-flex">
                                                {renderAvatar(sampleUsers[0], sz)}
                                                {config.showStatus && (<span style={{ position: 'absolute', bottom: so, right: so, width: ss, height: ss, borderRadius: '50%', background: statusColors[config.status], border: '2px solid var(--background)' }} />)}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{s}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <Separator />
                        {config.showGroup && (
                            <>
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Avatar Group</h4>
                                    <div className="flex items-center gap-6">
                                        <div style={{ display: 'flex' }}>
                                            {sampleUsers.slice(0, config.groupCount).map((u, i) => (
                                                <div key={i} style={{ marginLeft: i === 0 ? 0 : -(px * 0.3), position: 'relative', zIndex: config.groupCount - i, outline: '2px solid var(--background)', borderRadius }}>
                                                    {renderAvatar(u)}
                                                </div>
                                            ))}
                                            {sampleUsers.length > config.groupCount && (
                                                <div style={{ marginLeft: -(px * 0.3), width: px, height: px, borderRadius, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: px * 0.28, fontWeight: 700, color: 'var(--muted-foreground)', outline: '2px solid var(--background)' }}>
                                                    +{sampleUsers.length - config.groupCount}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{config.groupCount} members</p>
                                            <p className="text-xs text-muted-foreground">+{Math.max(0, sampleUsers.length - config.groupCount)} others</p>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Shapes</h4>
                            <div className="flex items-center gap-8">
                                {(['circle', 'rounded', 'square'] as const).map(shape => {
                                    const br = shape === 'circle' ? '50%' : shape === 'rounded' ? `${tokens.radius * 0.75}rem` : '0.25rem';
                                    return (
                                        <div key={shape} className="flex flex-col items-center gap-3">
                                            <div style={{ width: px, height: px, borderRadius: br, background: sampleUsers[0].color + '25', color: sampleUsers[0].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: px * 0.33 }}>
                                                {config.showInitialsFallback ? config.initials : <UserCircle2 style={{ width: px * 0.55, height: px * 0.55, opacity: 0.5 }} />}
                                            </div>
                                            <span className="text-xs font-bold text-muted-foreground capitalize">{shape}</span>
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

export default AvatarBuilder;
