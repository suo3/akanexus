import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    MessageSquarePlus,
    ThumbsUp,
    MessageCircle,
    CheckCircle2,
    Clock,
    XCircle,
    Filter,
    Plus
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MOCK_REQUESTS = [
    {
        id: 'req-1',
        title: 'Date Range Picker',
        description: 'We need a consistent date range picker for the analytics dashboard.',
        author: 'Sarah Chen',
        date: '2 days ago',
        status: 'under-review',
        votes: 12,
        comments: 4,
        priority: 'high'
    },
    {
        id: 'req-2',
        title: 'File Upload Drag & Drop',
        description: 'Current file input is too basic. Need a drag and drop zone with preview.',
        author: 'Mike Ross',
        date: '1 week ago',
        status: 'planned',
        votes: 28,
        comments: 8,
        priority: 'medium'
    },
    {
        id: 'req-3',
        title: 'Rich Text Editor',
        description: 'A WYSIWYG editor for the CMS portion of the app.',
        author: 'Jessica Pearson',
        date: '3 weeks ago',
        status: 'rejected',
        votes: 5,
        comments: 12,
        priority: 'low'
    },
];

export default function ComponentRequests() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ title: '', description: '', priority: 'medium' });

    const handleVote = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setRequests(requests.map(req =>
            req.id === id ? { ...req, votes: req.votes + 1 } : req
        ));
    };

    const handleSubmit = () => {
        const freshRequest = {
            id: `req-${Date.now()}`,
            title: newRequest.title,
            description: newRequest.description,
            priority: newRequest.priority,
            author: 'Current User',
            date: 'Just now',
            status: 'new',
            votes: 0,
            comments: 0
        };
        setRequests([freshRequest, ...requests]);
        setIsDialogOpen(false);
        setNewRequest({ title: '', description: '', priority: 'medium' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planned': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'under-review': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'new': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <MessageSquarePlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Component Requests</h1>
                        <p className="text-sm text-muted-foreground">Submit and vote on new component ideas</p>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request a Component</DialogTitle>
                            <DialogDescription>
                                Describe the component you need. Check existing requests first to avoid duplicates.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Component Name</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Date Range Picker"
                                    value={newRequest.title}
                                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Use Case & Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Why do we need this? Where will it be used?"
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newRequest.priority}
                                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                                >
                                    <option value="low">Low - Nice to have</option>
                                    <option value="medium">Medium - Needed soon</option>
                                    <option value="high">High - Blocking project</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={!newRequest.title}>Submit Request</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Filters Sidebar (simplified) */}
                <div className="w-64 border-r bg-card/10 p-4 space-y-6 hidden md:block">
                    <div className="space-y-2">
                        <h3 className="font-bold text-xs uppercase text-muted-foreground">Status</h3>
                        <div className="space-y-1">
                            {['All Requests', 'New', 'Under Review', 'Planned', 'Completed', 'Rejected'].map(status => (
                                <Button key={status} variant="ghost" size="sm" className="w-full justify-start font-normal">
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-xs uppercase text-muted-foreground">Sort By</h3>
                        <div className="space-y-1">
                            {['Newest', 'Most Voted', 'Most Commented'].map(sort => (
                                <Button key={sort} variant="ghost" size="sm" className="w-full justify-start font-normal">
                                    {sort}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* List */}
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {requests.map(req => (
                            <div key={req.id} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow group flex gap-6">
                                {/* Vote Column */}
                                <div className="flex flex-col items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 text-muted-foreground hover:text-primary hover:border-primary/50"
                                        onClick={(e) => handleVote(req.id, e)}
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                    </Button>
                                    <span className="font-bold text-lg">{req.votes}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg">{req.title}</h3>
                                        <Badge variant="outline" className={getStatusColor(req.status)}>
                                            {req.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground mb-4">{req.description}</p>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {req.date}
                                        </span>
                                        <span>by <span className="text-foreground font-medium">{req.author}</span></span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" /> {req.comments} comments
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
