import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Navigation, Copy, Download, Bell, Search, Menu, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

const NavbarBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [config, setConfig] = useState({
        variant: 'default' as 'default' | 'bordered' | 'glass' | 'floating' | 'solid',
        position: 'top' as 'top' | 'bottom',
        size: 'md' as 'sm' | 'md' | 'lg',
        showLogo: true,
        logoText: 'Akanexus',
        showSearch: true,
        showBell: true,
        showAvatar: true,
        showMobileMenu: true,
        showBorder: true,
        blur: true,
        brandColor: tokens.colors.primary,
    });

    const [navLinks] = useState(['Home', 'Products', 'Pricing', 'About', 'Blog']);
    const [activeLink, setActiveLink] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const heights = { sm: 52, md: 64, lg: 76 };
    const fontSizes = { sm: 13, md: 14, lg: 15 };
    const h = heights[config.size];
    const fs = fontSizes[config.size];

    const getNavbarStyle = (): React.CSSProperties => {
        const base: React.CSSProperties = { height: h, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, width: '100%', transition: 'all 0.2s' };
        if (config.variant === 'glass') return { ...base, background: config.brandColor + '15', backdropFilter: 'blur(10px)', borderBottom: config.showBorder ? '1px solid ' + config.brandColor + '25' : 'none' };
        if (config.variant === 'floating') return { ...base, background: 'var(--background)', borderRadius: 99, border: '1.5px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', margin: '12px', width: 'calc(100% - 24px)', padding: '0 20px' };
        if (config.variant === 'solid') return { ...base, background: config.brandColor, color: '#fff', borderBottom: 'none' };
        if (config.variant === 'bordered') return { ...base, background: 'transparent', borderBottom: `2px solid ${config.brandColor}` };
        return { ...base, background: 'var(--background)', borderBottom: config.showBorder ? '1px solid var(--border)' : 'none' };
    };

    const isSolid = config.variant === 'solid';
    const textColor = isSolid ? '#fff' : 'var(--foreground)';
    const mutedColor = isSolid ? 'rgba(255,255,255,0.65)' : 'var(--muted-foreground)';
    const hoverBg = isSolid ? 'rgba(255,255,255,0.12)' : 'var(--muted)';

    const generateReactCode = () => `import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Bell, Search, Menu, X } from 'lucide-react';

interface NavLink { label: string; href: string; }
interface NavbarProps {
  logo?: string;
  links?: NavLink[];
  variant?: 'default' | 'bordered' | 'glass' | 'floating' | 'solid';
  showSearch?: boolean;
  showNotifications?: boolean;
}

export const Navbar = ({ logo = '${config.logoText}', links = [], variant = '${config.variant}', showSearch, showNotifications }: NavbarProps) => {
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className={cn('flex items-center gap-4 px-6 h-16 transition-all', variant === 'glass' && 'bg-primary/10 backdrop-blur-lg border-b border-primary/20', variant === 'bordered' && 'border-b-2 border-primary bg-background', variant === 'floating' && 'bg-background border border-border rounded-full shadow-lg mx-3', variant === 'solid' && 'bg-primary text-white', variant === 'default' && 'bg-background border-b border-border')}>
      <div className="flex items-center gap-2 font-black text-lg">{logo}</div>
      <div className="hidden md:flex items-center gap-1 flex-1 ml-4">
        {links.map((link, i) => (
          <a key={link.label} href={link.href} onClick={() => setActive(i)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', i === active ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>{link.label}</a>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {showSearch && <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Search className="w-4 h-4" /></button>}
        {showNotifications && <button className="p-2 rounded-lg hover:bg-muted transition-colors relative"><Bell className="w-4 h-4" /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" /></button>}
        <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(o => !o)}>{mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</button>
      </div>
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
        const a = document.createElement('a'); a.href = url; a.download = 'Navbar.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Navbar Builder</h2>
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
                                    { label: 'Variant', key: 'variant', opts: ['default', 'bordered', 'glass', 'floating', 'solid'] },
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
                                    <Label className="text-xs">Brand Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" value={config.brandColor} onChange={e => setConfig({ ...config, brandColor: e.target.value })} className="w-12 h-9 p-1" />
                                        <Input value={config.brandColor} onChange={e => setConfig({ ...config, brandColor: e.target.value })} className="flex-1 h-9 font-mono text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Content</Label>
                            <div className="space-y-2">
                                <Label className="text-xs">Logo / Brand Name</Label>
                                <Input value={config.logoText} onChange={e => setConfig({ ...config, logoText: e.target.value })} className="h-9" />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Elements</Label>
                            {[
                                { label: 'Show Logo', key: 'showLogo' },
                                { label: 'Show Search', key: 'showSearch' },
                                { label: 'Show Notifications', key: 'showBell' },
                                { label: 'Show Avatar', key: 'showAvatar' },
                                { label: 'Show Mobile Menu', key: 'showMobileMenu' },
                                { label: 'Show Border', key: 'showBorder' },
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
                    <div className="p-8 space-y-10">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Interactive Preview</h4>
                            <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid var(--border)' }}>
                                <div style={getNavbarStyle()}>
                                    {config.showLogo && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: 8, background: isSolid ? 'rgba(255,255,255,0.2)' : config.brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: isSolid ? '#fff' : '#fff' }}>A</div>
                                            <span style={{ fontSize: fs, fontWeight: 900, color: textColor }}>{config.logoText}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, marginLeft: 16 }}>
                                        {navLinks.map((link, i) => (
                                            <button key={link} onClick={() => setActiveLink(i)} style={{ fontSize: fs, fontWeight: i === activeLink ? 700 : 500, padding: '6px 12px', borderRadius: 8, border: 'none', background: i === activeLink ? (isSolid ? 'rgba(255,255,255,0.2)' : config.brandColor + '18') : 'transparent', color: i === activeLink ? (isSolid ? '#fff' : config.brandColor) : mutedColor, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                {link}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                                        {config.showSearch && <button style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: hoverBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Search style={{ width: 15, height: 15, color: mutedColor }} /></button>}
                                        {config.showBell && (
                                            <div style={{ position: 'relative' }}>
                                                <button style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: hoverBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell style={{ width: 15, height: 15, color: mutedColor }} /></button>
                                                <div style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '1.5px solid var(--background)' }} />
                                            </div>
                                        )}
                                        {config.showAvatar && <div style={{ width: 34, height: 34, borderRadius: '50%', background: config.brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', border: isSolid ? '2px solid rgba(255,255,255,0.3)' : 'none' }}>AJ</div>}
                                        {config.showMobileMenu && <button style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: hoverBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setMobileOpen(o => !o)}>{mobileOpen ? <X style={{ width: 15, height: 15, color: mutedColor }} /> : <Menu style={{ width: 15, height: 15, color: mutedColor }} />}</button>}
                                    </div>
                                </div>
                                {mobileOpen && (
                                    <div style={{ background: isSolid ? config.brandColor : 'var(--background)', borderTop: '1px solid ' + (isSolid ? 'rgba(255,255,255,0.15)' : 'var(--border)'), padding: 12 }}>
                                        {navLinks.map((link, i) => (
                                            <button key={link} onClick={() => { setActiveLink(i); setMobileOpen(false); }} style={{ display: 'block', width: '100%', padding: '10px 14px', border: 'none', borderRadius: 8, background: i === activeLink ? (isSolid ? 'rgba(255,255,255,0.15)' : config.brandColor + '12') : 'transparent', color: i === activeLink ? (isSolid ? '#fff' : config.brandColor) : mutedColor, fontWeight: i === activeLink ? 700 : 500, fontSize: fs, cursor: 'pointer', textAlign: 'left', marginBottom: 2 }}>{link}</button>
                                        ))}
                                    </div>
                                )}
                                <div style={{ height: 100, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--muted-foreground)' }}>Page content area</div>
                            </div>
                        </div>

                        <Separator />
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">All Variants</h4>
                            <div className="space-y-4">
                                {(['default', 'bordered', 'glass', 'floating', 'solid'] as const).map(variant => {
                                    const isSol = variant === 'solid';
                                    const vs: React.CSSProperties = variant === 'glass' ? { height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, background: config.brandColor + '15', backdropFilter: 'blur(8px)', borderBottom: '1px solid ' + config.brandColor + '25' } : variant === 'floating' ? { height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, background: 'var(--background)', borderRadius: 99, border: '1.5px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', margin: '8px', width: 'calc(100% - 16px)' } : variant === 'solid' ? { height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, background: config.brandColor } : variant === 'bordered' ? { height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, background: 'transparent', borderBottom: '2px solid ' + config.brandColor } : { height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, background: 'var(--background)', borderBottom: '1px solid var(--border)' };
                                    return (
                                        <div key={variant} style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid var(--border)' }}>
                                            <div style={vs}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                                    <div style={{ width: 24, height: 24, borderRadius: 6, background: isSol ? 'rgba(255,255,255,0.2)' : config.brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>A</div>
                                                    <span style={{ fontSize: 14, fontWeight: 900, color: isSol ? '#fff' : 'var(--foreground)' }}>Brand</span>
                                                </div>
                                                <div style={{ flex: 1, display: 'flex', gap: 4, marginLeft: 12 }}>
                                                    {['Home', 'Products', 'Docs'].map((l, j) => <span key={l} style={{ fontSize: 13, fontWeight: j === 0 ? 700 : 500, padding: '4px 10px', borderRadius: 6, background: j === 0 ? (isSol ? 'rgba(255,255,255,0.15)' : config.brandColor + '15') : 'transparent', color: j === 0 ? (isSol ? '#fff' : config.brandColor) : (isSol ? 'rgba(255,255,255,0.65)' : 'var(--muted-foreground)') }}>{l}</span>)}
                                                </div>
                                                <span style={{ fontSize: 11, fontWeight: 700, background: '#fff', color: '#111', padding: '3px 10px', borderRadius: 99, flexShrink: 0 }}>Sign up</span>
                                            </div>
                                            <div style={{ padding: '6px 20px', background: 'var(--muted)', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)' }}>{variant}</div>
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

export default NavbarBuilder;
