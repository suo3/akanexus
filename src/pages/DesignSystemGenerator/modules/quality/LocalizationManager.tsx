import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
    Languages,
    Globe,
    AlignRight,
    AlignLeft,
    Plus,
    Trash2,
    Check,
    Search
} from 'lucide-react';
import { Label } from "@/components/ui/label";

const MOCK_LANGUAGES = [
    { code: 'en-US', name: 'English (US)', direction: 'ltr', isDefault: true, completion: 100 },
    { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', direction: 'rtl', isDefault: false, completion: 85 },
    { code: 'es-ES', name: 'Spanish (Spain)', direction: 'ltr', isDefault: false, completion: 40 },
    { code: 'zh-CN', name: 'Chinese (Simplified)', direction: 'ltr', isDefault: false, completion: 92 },
];

const MOCK_KEYS = [
    { key: 'action.submit', en: 'Submit', ar: 'إرسال', es: 'Enviar', zh: '提交' },
    { key: 'action.cancel', en: 'Cancel', ar: 'إلغاء', es: 'Cancelar', zh: '取消' },
    { key: 'status.loading', en: 'Loading...', ar: 'جار التحميل...', es: 'Cargando...', zh: '加载中...' },
    { key: 'error.generic', en: 'An error occurred', ar: 'حدث خطأ', es: 'Ocurrió un error', zh: '发生错误' },
];

export default function LocalizationManager() {
    const [languages, setLanguages] = useState(MOCK_LANGUAGES);
    const [previewRTL, setPreviewRTL] = useState(false);
    const [activeTab, setActiveTab] = useState<'languages' | 'translations'>('languages');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredKeys = MOCK_KEYS.filter(k =>
        k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.en.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`h-full flex flex-col ${previewRTL ? 'direction-rtl' : ''}`}>
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Localization & RTL</h1>
                        <p className="text-sm text-muted-foreground">Manage languages and regional adaptivity</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border">
                        <Label htmlFor="rtl-mode" className="text-xs font-bold cursor-pointer">Preview RTL</Label>
                        <Switch id="rtl-mode" checked={previewRTL} onCheckedChange={setPreviewRTL} />
                    </div>
                    <div className="bg-muted p-1 rounded-lg flex gap-1">
                        <Button
                            variant={activeTab === 'languages' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('languages')}
                        >
                            Languages
                        </Button>
                        <Button
                            variant={activeTab === 'translations' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('translations')}
                        >
                            Translations
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto">

                    {/* LANGUAGES TAB */}
                    {activeTab === 'languages' && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {languages.map(lang => (
                                    <div key={lang.code} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold uppercase">
                                                    {lang.code.split('-')[1] || lang.code.slice(0, 2)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{lang.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{lang.code}</p>
                                                </div>
                                            </div>
                                            {lang.isDefault && <Badge>Default</Badge>}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    Direction
                                                </span>
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    {lang.direction === 'rtl' ? <AlignRight className="w-3 h-3" /> : <AlignLeft className="w-3 h-3" />}
                                                    {lang.direction.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span>Translation Progress</span>
                                                    <span>{lang.completion}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${lang.completion === 100 ? 'bg-green-500' : 'bg-primary'}`}
                                                        style={{ width: `${lang.completion}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {!lang.isDefault && (
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add New Language */}
                                <div className="p-6 rounded-xl border border-dashed hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[240px]">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold">Add Language</h3>
                                        <p className="text-sm text-muted-foreground">Support a new locale</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TRANSLATIONS TAB */}
                    {activeTab === 'translations' && (
                        <div className="bg-card rounded-xl border shadow-sm flex flex-col h-[600px]">
                            <div className="p-4 border-b flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search translation keys..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" /> Import JSON</Button>
                                    <Button size="sm"><Download className="w-4 h-4 mr-2" /> Export All</Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
                                        <tr>
                                            <th className="p-4 font-bold border-b w-1/4">Key</th>
                                            <th className="p-4 font-bold border-b">English (Default)</th>
                                            <th className="p-4 font-bold border-b text-right" dir="rtl">Arabic</th>
                                            <th className="p-4 font-bold border-b">Spanish</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredKeys.map((item) => (
                                            <tr key={item.key} className="hover:bg-muted/30">
                                                <td className="p-4 font-mono text-xs text-muted-foreground">{item.key}</td>
                                                <td className="p-4">{item.en}</td>
                                                <td className="p-4 text-right font-arabic" dir="rtl">{item.ar}</td>
                                                <td className="p-4">{item.es}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

// Helper icons needed for buttons that were not imported
function Upload({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
}
function Download({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>;
}
