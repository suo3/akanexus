import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    LayoutTemplate,
    Lock,
    LayoutDashboard,
    CreditCard,
    Copy,
    CheckCircle2,
    ExternalLink
} from 'lucide-react';

const PATTERNS = [
    {
        id: 'auth-login',
        category: 'Authentication',
        title: 'Login Form',
        description: 'Standard email/password login with "remember me" and social options.',
        files: ['Login.tsx'],
        preview: (
            <div className="max-w-sm w-full mx-auto p-6 rounded-xl border bg-card shadow-sm">
                <div className="space-y-4">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-8 rounded-md bg-muted animate-pulse" />
                        <div className="h-8 rounded-md bg-muted animate-pulse" />
                        <div className="h-8 rounded-md bg-primary/20 animate-pulse w-full" />
                    </div>
                </div>
            </div>
        ),
        code: `export function LoginForm() {
  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your email to sign in</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="m@example.com" required />
        </div>
        <Button className="w-full">Sign in</Button>
      </div>
    </div>
  )
}`
    },
    {
        id: 'dashboard-shell',
        category: 'Layouts',
        title: 'Dashboard Shell',
        description: 'Responsive sidebar layout with top navigation and main content area.',
        files: ['DashboardLayout.tsx', 'Sidebar.tsx'],
        preview: (
            <div className="h-48 w-full rounded-xl border bg-background flex overflow-hidden">
                <div className="w-16 bg-muted border-r hidden sm:flex flex-col items-center py-4 gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                    <div className="w-8 h-8 rounded-md bg-card border" />
                    <div className="w-8 h-8 rounded-md bg-card border" />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="h-12 border-b bg-card flex items-center px-4 justify-between">
                        <div className="w-24 h-4 bg-muted rounded" />
                        <div className="w-8 h-8 rounded-full bg-muted" />
                    </div>
                    <div className="flex-1 p-4 bg-muted/10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-24 rounded-lg border bg-card" />
                            <div className="h-24 rounded-lg border bg-card" />
                        </div>
                    </div>
                </div>
            </div>
        ),
        code: `export function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}`
    },
    {
        id: 'pricing-table',
        category: 'Marketing',
        title: 'Pricing Cards',
        description: 'Three-column pricing table with highlighted preferred option.',
        files: ['Pricing.tsx'],
        preview: (
            <div className="flex gap-2 items-end justify-center h-full pt-4">
                <div className="w-1/4 h-24 rounded-t-lg border border-b-0 bg-card transform translate-y-2 opacity-50" />
                <div className="w-1/3 h-32 rounded-t-lg border border-b-0 bg-card ring-2 ring-primary z-10 shadow-lg relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-[8px] text-primary-foreground rounded-full">POPULAR</div>
                </div>
                <div className="w-1/4 h-24 rounded-t-lg border border-b-0 bg-card transform translate-y-2 opacity-50" />
            </div>
        ),
        code: `export function Pricing() {
  return ( // ... implementation )
}`
    }
];

export default function PatternLibrary() {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const categories = ['All', ...Array.from(new Set(PATTERNS.map(p => p.category)))];

    const filteredPatterns = activeCategory === 'All'
        ? PATTERNS
        : PATTERNS.filter(p => p.category === activeCategory);

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Pattern Library</h1>
                        <p className="text-sm text-muted-foreground">Pre-built composite UI patterns to accelerate development</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Filter Bar */}
                <div className="px-8 py-4 border-b bg-card/10 flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'bg-background hover:bg-muted text-muted-foreground'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <ScrollArea className="flex-1 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {filteredPatterns.map(pattern => (
                            <div key={pattern.id} className="group rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                                {/* Preview */}
                                <div className="h-48 bg-muted/20 border-b flex items-center justify-center p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {pattern.preview}
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                        <Button size="sm" variant="secondary" onClick={() => handleCopy(pattern.code, pattern.id)}>
                                            {copiedId === pattern.id ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                            {copiedId === pattern.id ? 'Copied' : 'Copy Code'}
                                        </Button>
                                        <Button size="sm" variant="outline" className="bg-transparent text-white hover:bg-white/20 border-white/20">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Preview
                                        </Button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                                            {pattern.category}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                            {pattern.files.length} file{pattern.files.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{pattern.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                        {pattern.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
