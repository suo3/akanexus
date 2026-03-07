import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check, X, Code2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface RemediationStep {
    title: string;
    description: string;
    before: string;
    after: string;
}

interface RemediationGuideProps {
    steps: RemediationStep[];
}

export const RemediationGuide: React.FC<RemediationGuideProps> = ({ steps }) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Code copied to clipboard');
    };

    return (
        <div className="space-y-8">
            {steps.map((step, index) => (
                <div key={index} className="border border-border bg-card/30 p-6 rounded-none">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="text-[10px] mono-label font-bold">{index + 1}</span>
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider">{step.title}</h3>
                    </div>

                    <p className="text-xs text-muted-foreground mb-6 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
                        {step.description}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Before */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-[9px] mono-label uppercase border-destructive/20 text-destructive rounded-none bg-destructive/5">
                                    <X size={10} className="mr-1" /> Original (Violating)
                                </Badge>
                            </div>
                            <div className="relative group">
                                <pre className="p-4 bg-destructive/5 border border-destructive/10 text-[10px] font-mono overflow-x-auto text-destructive/70">
                                    {step.before}
                                </pre>
                            </div>
                        </div>

                        {/* After */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-[9px] mono-label uppercase border-emerald-500/20 text-emerald-500 rounded-none bg-emerald-500/5">
                                    <Check size={10} className="mr-1" /> Remediation (Fixed)
                                </Badge>
                                <button
                                    onClick={() => copyToClipboard(step.after)}
                                    className="text-[9px] mono-label uppercase text-muted-foreground hover:text-primary flex items-center gap-1"
                                >
                                    <Copy size={10} /> Copy
                                </button>
                            </div>
                            <div className="relative group">
                                <pre className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-mono overflow-x-auto text-emerald-500">
                                    {step.after}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
