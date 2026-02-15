import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
    MoreVertical,
    Loader2
} from 'lucide-react';

export default function GuidelinesEditor() {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('Guidelines');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        fetchGuidelines();
    }, []);

    const fetchGuidelines = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('documentation_sections')
            .select('title, content')
            .eq('slug', 'guidelines')
            .maybeSingle();

        if (error) {
            toast.error('Failed to load guidelines');
            console.error(error);
        } else if (data) {
            setTitle(data.title);
            setContent(data.content || '');
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('documentation_sections')
            .update({
                title: title,
                content: content,
                updated_at: new Date().toISOString()
            })
            .eq('slug', 'guidelines');

        if (error) {
            toast.error('Failed to save changes');
        } else {
            toast.success('Guidelines updated successfully');
        }
        setIsSaving(false);
    };

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleFormat = (type: 'bold' | 'italic' | 'list' | 'code' | 'image') => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = content;
        const selection = text.substring(start, end);

        let newText = text;
        let newCursorPos = end;

        switch (type) {
            case 'bold':
                newText = text.substring(0, start) + `**${selection || 'bold text'}**` + text.substring(end);
                newCursorPos = start + (selection ? selection.length + 4 : 11);
                break;
            case 'italic':
                newText = text.substring(0, start) + `*${selection || 'italic text'}*` + text.substring(end);
                newCursorPos = start + (selection ? selection.length + 2 : 13);
                break;
            case 'list':
                const listPrefix = '- ';
                newText = text.substring(0, start) + (selection ? `\n${listPrefix}${selection}` : `\n${listPrefix}List item`) + text.substring(end);
                newCursorPos = start + (selection ? selection.length + 3 : 12);
                break;
            case 'code':
                const isBlock = selection.includes('\n');
                if (isBlock) {
                    newText = text.substring(0, start) + `\`\`\`\n${selection}\n\`\`\`` + text.substring(end);
                    newCursorPos = start + selection.length + 8;
                } else {
                    newText = text.substring(0, start) + `\`${selection || 'code'}\`` + text.substring(end);
                    newCursorPos = start + (selection ? selection.length + 2 : 6);
                }
                break;
            case 'image':
                newText = text.substring(0, start) + `![${selection || 'Alt text'}](https://example.com/image.png)` + text.substring(end);
                newCursorPos = start + (selection ? selection.length + 35 : 39);
                break;
        }

        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    if (isLoading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-4 bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">{title}</h1>
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
                    <Button size="sm" className="gap-2" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor/Preview Area */}
                <div className="flex-1 flex flex-col bg-background">
                    {/* Toolbar */}
                    {isEditing && (
                        <div className="h-10 border-b flex items-center px-4 gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleFormat('bold')} title="Bold">
                                <Bold className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleFormat('italic')} title="Italic">
                                <Italic className="h-4 w-4" />
                            </Button>
                            <Separator orientation="vertical" className="h-4 mx-2" />
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleFormat('list')} title="List">
                                <List className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleFormat('code')} title="Code">
                                <Code className="h-4 w-4" />
                            </Button>
                            <Separator orientation="vertical" className="h-4 mx-2" />
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleFormat('image')} title="Image">
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
                        {isEditing ? (
                            <div className="h-full flex flex-col gap-4">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-3xl font-bold border-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                                    placeholder="Page Title"
                                />
                                <textarea
                                    ref={textareaRef}
                                    className="flex-1 w-full resize-none bg-transparent outline-none font-mono text-sm leading-relaxed"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Start typing your markdown content here..."
                                />
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                {/* Simple Markdown Render Simulation */}
                                <div className="space-y-4">
                                    {content.split('\n').map((line, i) => {
                                        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold border-b pb-4 mb-6">{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>;
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
