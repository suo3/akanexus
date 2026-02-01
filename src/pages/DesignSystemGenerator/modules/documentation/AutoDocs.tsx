import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    BookOpen,
    Code,
    Table,
    Search,
    Component,
    Copy,
    CheckCircle2,
    FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Component Data (in a real app, this would be parsed from AST/TSDocs)
const COMPONENT_DOCS = [
    {
        name: 'Button',
        description: 'Triggers an event or action. They are standard UI elements for interactions.',
        import: "import { Button } from '@/components/ui/button'",
        props: [
            { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'", description: 'The visual style of the button.' },
            { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", default: "'default'", description: 'The size of the button.' },
            { name: 'asChild', type: 'boolean', default: 'false', description: 'Whether to render as a child component (delegation).' },
        ],
        examples: [
            {
                title: 'Primary Button',
                code: '<Button>Click me</Button>'
            },
            {
                title: 'Destructive',
                code: '<Button variant="destructive">Delete Account</Button>'
            }
        ]
    },
    {
        name: 'Input',
        description: 'Displays a form input field or a component that looks like an input field.',
        import: "import { Input } from '@/components/ui/input'",
        props: [
            { name: 'type', type: 'string', default: "'text'", description: 'HTML input type attribute.' },
            { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input.' },
        ],
        examples: [
            {
                title: 'Default Input',
                code: '<Input type="email" placeholder="Email" />'
            }
        ]
    },
    {
        name: 'Card',
        description: 'Displays a card with header, content, and footer.',
        import: "import { Card, CardHeader, CardContent } from '@/components/ui/card'",
        props: [
            { name: 'className', type: 'string', default: '-', description: 'Additional CSS classes.' },
        ],
        examples: [
            {
                title: 'Simple Card',
                code:
                    `<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content goes here</CardContent>
</Card>`
            }
        ]
    }
];

export default function AutoDocs() {
    const [search, setSearch] = useState('');
    const [selectedComponent, setSelectedComponent] = useState(COMPONENT_DOCS[0]);
    const [copied, setCopied] = useState(false);

    const filteredDocs = COMPONENT_DOCS.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Component API Reference</h1>
                        <p className="text-sm text-muted-foreground">Auto-generated documentation from component source code</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter components..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-background/50"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {filteredDocs.map(doc => (
                                <button
                                    key={doc.name}
                                    onClick={() => setSelectedComponent(doc)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedComponent.name === doc.name
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <Component className="w-4 h-4" />
                                    {doc.name}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {selectedComponent ? (
                        <div className="max-w-4xl mx-auto p-8 space-y-8">
                            {/* Title & Description */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-black tracking-tight">{selectedComponent.name}</h2>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        v1.0.0
                                    </Badge>
                                </div>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {selectedComponent.description}
                                </p>

                                <div className="p-4 rounded-xl bg-muted/50 border flex items-center justify-between font-mono text-sm">
                                    <code className="text-primary">{selectedComponent.import}</code>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(selectedComponent.import)}>
                                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <Tabs defaultValue="props" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="props" className="gap-2">
                                        <Table className="w-4 h-4" />
                                        Props API
                                    </TabsTrigger>
                                    <TabsTrigger value="examples" className="gap-2">
                                        <Code className="w-4 h-4" />
                                        Examples
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="props" className="space-y-4">
                                    <div className="rounded-xl border bg-card overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 border-b">
                                                <tr>
                                                    <th className="px-6 py-3 font-bold">Prop</th>
                                                    <th className="px-6 py-3 font-bold">Type</th>
                                                    <th className="px-6 py-3 font-bold">Default</th>
                                                    <th className="px-6 py-3 font-bold">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {selectedComponent.props.map((prop) => (
                                                    <tr key={prop.name} className="hover:bg-muted/10">
                                                        <td className="px-6 py-4 font-mono text-primary font-bold">{prop.name}</td>
                                                        <td className="px-6 py-4 font-mono text-xs text-purple-500">{prop.type}</td>
                                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{prop.default}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{prop.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="examples" className="space-y-6">
                                    {selectedComponent.examples.map((example, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <h3 className="font-bold text-lg">{example.title}</h3>
                                            <div className="relative group rounded-xl overflow-hidden border bg-[#0d1117]">
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleCopy(example.code)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
                                                    <pre>{example.code}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select a component to view documentation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
