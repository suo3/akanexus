import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    FileText,
    Save,
    Eye,
    Edit3,
    Plus,
    Trash2,
    Bold,
    Italic,
    List,
    Code,
    Image as ImageIcon,
    MoreVertical
} from 'lucide-react';

const MOCK_PAGES = [
    { id: '1', title: 'Introduction', content: '# Introduction\n\nWelcome to the design system. This guide covers the core principles.\n\n## Core Values\n- Accessibility\n- Performance\n- Consistency' },
    { id: '2', title: 'Tone of Voice', content: '# Tone of Voice\n\nWe speak to our users with respect and clarity.\n\n> "Be clear, not clever."' },
    { id: '3', title: 'Accessibility', content: '# Accessibility\n\nAll components must meet WCAG 2.1 AA standards.' },
];

export default function GuidelinesEditor() {
    const [pages, setPages] = useState(MOCK_PAGES);
    const [activePageId, setActivePageId] = useState<string>(MOCK_PAGES[0].id);
    const [isEditing, setIsEditing] = useState(true);
    const [newTitle, setNewTitle] = useState('');

    const activePage = pages.find(p => p.id === activePageId) || pages[0];

    const handleUpdateContent = (content: string) => {
        setPages(pages.map(p => p.id === activePageId ? { ...p, content } : p));
    };

    const handleAddPage = () => {
        const newPage = {
            id: Date.now().toString(),
            title: 'New Page',
            content: '# New Page\n\nStart writing...'
        };
        setPages([...pages, newPage]);
        setActivePageId(newPage.id);
        setIsEditing(true);
    };

    const handleDeletePage = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (pages.length > 1) {
            setPages(pages.filter(p => p.id !== id));
            if (activePageId === id) {
                setActivePageId(pages[0].id);
            }
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-4 bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Guidelines</h1>
                        <p className="text-xs text-muted-foreground">Manage system documentation</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className={isEditing ? 'bg-primary/10 text-primary border-primary/20' : ''}
                    >
                        {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                        {isEditing ? 'Preview Mode' : 'Edit Mode'}
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r bg-card/10 flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Pages</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleAddPage}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {pages.map(page => (
                                <div
                                    key={page.id}
                                    onClick={() => setActivePageId(page.id)}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${activePageId === page.id
                                            ? 'bg-background shadow-sm text-foreground'
                                            : 'hover:bg-muted/50 text-muted-foreground'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText className="w-4 h-4 shrink-0 opacity-50" />
                                        <span className="truncate">{page.title}</span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                        onClick={(e) => handleDeletePage(page.id, e)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Editor/Preview Area */}
                <div className="flex-1 flex flex-col bg-background">
                    {/* Toolbar */}
                    {isEditing && (
                        <div className="h-10 border-b flex items-center px-4 gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                            <Separator orientation="vertical" className="h-4 mx-2" />
                            <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Code className="h-4 w-4" /></Button>
                            <Separator orientation="vertical" className="h-4 mx-2" />
                            <Button variant="ghost" size="icon" className="h-8 w-8"><ImageIcon className="h-4 w-4" /></Button>
                        </div>
                    )}

                    <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
                        {isEditing ? (
                            <div className="h-full flex flex-col gap-4">
                                <Input
                                    value={activePage.title}
                                    onChange={(e) => setPages(pages.map(p => p.id === activePageId ? { ...p, title: e.target.value } : p))}
                                    className="text-3xl font-bold border-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                                    placeholder="Page Title"
                                />
                                <textarea
                                    className="flex-1 w-full resize-none bg-transparent outline-none font-mono text-sm leading-relaxed"
                                    value={activePage.content}
                                    onChange={(e) => handleUpdateContent(e.target.value)}
                                    placeholder="Start typing your markdown content here..."
                                />
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                {/* Simple Markdown Render Simulation */}
                                <div className="space-y-4">
                                    {activePage.content.split('\n').map((line, i) => {
                                        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold border-b pb-4 mb-6">{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                                        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 pl-4 italic text-muted-foreground my-4">{line.replace('> ', '')}</blockquote>;
                                        if (line === '') return <div key={i} className="h-2" />;
                                        return <p key={i} className="text-muted-foreground leading-7">{line}</p>;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
