import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, HelpCircle } from 'lucide-react';

interface ChecklistItem {
    id: string;
    category: string;
    question: string;
    description: string;
}

const MANUAL_CRITERIA: ChecklistItem[] = [
    {
        id: 'video-transcript',
        category: 'Multimedia',
        question: 'Does the video transcript accurately match the audio?',
        description: 'Ensure all spoken words and important sound effects are captured in the text transcript (WCAG 1.2.2).'
    },
    {
        id: 'logical-order',
        category: 'Structure',
        question: 'Is the reading order logical without CSS?',
        description: 'When styles are removed, the content should follow a meaningful sequence (WCAG 1.3.2).'
    },
    {
        id: 'sensory-char',
        category: 'Design',
        question: 'Do instructions avoid relying solely on sensory characteristics?',
        description: 'Avoid instructions like "Click the red button" or "The box on the right" (WCAG 1.3.3).'
    },
    {
        id: 'flashing',
        category: 'Safety',
        question: 'Does content avoid flashing more than 3 times per second?',
        description: 'Ensure no content can cause seizures (WCAG 2.3.1).'
    },
    {
        id: 'focus-visible',
        category: 'Navigation',
        question: 'Is the keyboard focus indicator highly visible?',
        description: 'Ensure users can easily track where they are when tabbing (WCAG 2.4.7).'
    }
];

export const ManualChecklist: React.FC = () => {
    const [completed, setCompleted] = React.useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const newCompleted = new Set(completed);
        if (newCompleted.has(id)) newCompleted.delete(id);
        else newCompleted.add(id);
        setCompleted(newCompleted);
    };

    const progress = (completed.size / MANUAL_CRITERIA.length) * 100;

    return (
        <div className="space-y-6">
            <div className="p-4 bg-secondary/20 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock size={16} className="text-primary" />
                    <span className="text-[10px] mono-label uppercase">Manual Audit Progress</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-1 w-32 bg-secondary rounded-none overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] mono-label font-bold">{completed.size}/{MANUAL_CRITERIA.length}</span>
                </div>
            </div>

            <div className="space-y-1">
                {MANUAL_CRITERIA.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-start gap-4 p-4 border transition-colors ${completed.has(item.id) ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-card border-border hover:border-primary/30'
                            }`}
                    >
                        <Checkbox
                            id={item.id}
                            checked={completed.has(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mt-1 rounded-none"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[8px] mono-label uppercase px-1 py-0 rounded-none border-primary/20 text-primary">
                                    {item.category}
                                </Badge>
                                {completed.has(item.id) && <CheckCircle2 size={12} className="text-emerald-500" />}
                            </div>
                            <label
                                htmlFor={item.id}
                                className="text-sm font-bold uppercase tracking-tight cursor-pointer block mb-1"
                            >
                                {item.question}
                            </label>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 flex items-center gap-3">
                <HelpCircle size={14} className="text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Automation only catches ~40% of issues. This manual checklist ensures you reach 100% WCAG 2.1 Level AA compliance by verifying criteria that require human judgment.
                </p>
            </div>
        </div>
    );
};
