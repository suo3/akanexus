import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    FileText,
    Save,
    Download,
    Eye,
    Code,
    ListTodo,
    AlertCircle,
    Copy,
    Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { saveAs } from 'file-saver';

const DEFAULT_TEMPLATE = `# Contributing to [System Name]

We love your input! We want to make contributing to this design system as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## We Develop with Github
We use github to host code, to track issues and feature requests, and to accept pull requests.

## Report bugs using Github's [issue tracker]
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code
**Great Bug Reports** tend to have:
- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happened
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License.
`;

const PROCESS_CHECKLIST = [
    { id: 1, text: 'Review existing components before proposing new ones', required: true },
    { id: 2, text: 'Check the roadmap for upcoming features', required: true },
    { id: 3, text: 'Follow the commit message convention (Conventional Commits)', required: true },
    { id: 4, text: 'Ensure accessibility audit passes (WCAG AA)', required: true },
];

export default function ContributionWorkspace() {
    const [content, setContent] = useState(DEFAULT_TEMPLATE);
    const [checklist, setChecklist] = useState(PROCESS_CHECKLIST);
    const [isPreview, setIsPreview] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, 'CONTRIBUTING.md');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Contribution Guidelines</h1>
                        <p className="text-sm text-muted-foreground">Define how teams contribute to the system</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download .md
                    </Button>
                    <Button onClick={handleCopy} className="gap-2">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Markdown'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 flex flex-col border-r">
                    <div className="px-4 py-2 border-b bg-muted/20 flex justify-between items-center">
                        <Tabs value={isPreview ? 'preview' : 'edit'} onValueChange={(v) => setIsPreview(v === 'preview')} className="w-[200px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="edit" className="gap-2"><Code className="w-3 h-3" /> Edit</TabsTrigger>
                                <TabsTrigger value="preview" className="gap-2"><Eye className="w-3 h-3" /> Preview</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Badge variant="outline" className="text-xs">
                            Markdown Supported
                        </Badge>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {isPreview ? (
                            <ScrollArea className="h-full p-8">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </div>
                            </ScrollArea>
                        ) : (
                            <Textarea
                                className="w-full h-full resize-none p-8 font-mono text-sm bg-transparent border-0 focus-visible:ring-0 leading-relaxed"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                spellCheck={false}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar: Process Rules */}
                <div className="w-80 bg-card/10 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="font-bold flex items-center gap-2">
                            <ListTodo className="w-4 h-4 text-primary" />
                            Process Rules
                        </h3>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>These rules define the mandatory steps for PR approval.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {checklist.map(item => (
                                    <div key={item.id} className="flex gap-3 items-start p-3 bg-card rounded-lg border shadow-sm">
                                        <div className="mt-1">
                                            {item.required && <div className="h-2 w-2 rounded-full bg-red-500" title="Required" />}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-snug">{item.text}</p>
                                    </div>
                                ))}
                            </div>

                            <Button variant="ghost" className="w-full border border-dashed text-muted-foreground">
                                + Add Rule
                            </Button>
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t bg-muted/10">
                        <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Templates</div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => setContent(DEFAULT_TEMPLATE)}>Standard</Button>
                            <Button variant="outline" size="sm" onClick={() => setContent('# Open Source Policy\n\n...')}>Open Source</Button>
                            <Button variant="outline" size="sm" onClick={() => setContent('# Internal Only\n\n...')}>Internal</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
