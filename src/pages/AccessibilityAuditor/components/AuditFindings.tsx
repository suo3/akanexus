import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronDown, ChevronUp, ExternalLink, Info, Sparkles, Loader2 } from 'lucide-react';
import { AuditResult } from '@/utils/accessibilityAudit';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuditFindingsProps {
    violations: AuditResult[];
}

export const AuditFindings: React.FC<AuditFindingsProps> = ({ violations }) => {
    const [expandedId, setExpandedId] = React.useState<string | null>(null);
    const [generatingFor, setGeneratingFor] = React.useState<string | null>(null);
    const [generatedTexts, setGeneratedTexts] = React.useState<Record<string, string>>({});

    const handleGenerateAltText = async (htmlSnippet: string, nodeId: string) => {
        // Step 1: Extract the src URL from the raw HTML string using a regex
        const srcMatch = htmlSnippet.match(/src=["']([^"']+)["']/i);
        if (!srcMatch || !srcMatch[1]) {
            toast.error("Could not extract a valid image source from this element.");
            return;
        }

        const imageUrl = srcMatch[1];
        setGeneratingFor(nodeId);

        try {
            const { data, error } = await supabase.functions.invoke("generate-alt-text", {
                body: { imageUrl }
            });

            if (error) throw error;
            if (data && data.success === false) throw new Error(data.error);
            if (!data || !data.altText) throw new Error("No text generated.");

            // Store the suggestion mapped to the node's unique index
            setGeneratedTexts(prev => ({ ...prev, [nodeId]: data.altText }));
            toast.success("AI Alt-Text generated successfully!");

        } catch (error: any) {
            console.error(error);
            toast.error(`AI Generation Failed: ${error.message}`);
        } finally {
            setGeneratingFor(null);
        }
    };

    const getImpactColor = (impact: AuditResult['impact']) => {
        switch (impact) {
            case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'serious': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'moderate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'minor': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="space-y-4">
            {violations.length === 0 ? (
                <div className="p-8 border border-dashed border-border flex flex-col items-center justify-center text-center">
                    <Info className="text-muted-foreground mb-2" size={24} />
                    <p className="text-sm text-muted-foreground mono-label uppercase">No violations detected</p>
                </div>
            ) : (
                violations.map((violation) => (
                    <div key={violation.id} className="border border-border bg-card/50 overflow-hidden">
                        <button
                            onClick={() => setExpandedId(expandedId === violation.id ? null : violation.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors text-left"
                        >
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={`rounded-none px-2 py-0.5 mono-label text-[10px] uppercase ${getImpactColor(violation.impact)}`}>
                                    {violation.impact}
                                </Badge>
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-tight">{violation.help}</h4>
                                    <p className="text-xs text-muted-foreground">{violation.id}</p>
                                </div>
                            </div>
                            {expandedId === violation.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence>
                            {expandedId === violation.id && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 border-t border-border bg-secondary/10">
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <span className="text-[10px] mono-label text-muted-foreground uppercase block mb-1">Description</span>
                                                <p className="text-xs">{violation.description}</p>
                                            </div>

                                            <div>
                                                <span className="text-[10px] mono-label text-muted-foreground uppercase block mb-1">Failing Instances ({violation.nodes.length})</span>
                                                <div className="space-y-2">
                                                    {violation.nodes.map((node, i) => (
                                                        <div key={i} className="p-2 bg-background border border-border font-mono text-[10px] overflow-x-auto whitespace-pre relative group">
                                                            {node.html}
                                                            <div className="mt-2 text-destructive border-t border-destructive/20 pt-1 flex justify-between items-start whitespace-normal gap-4">
                                                                <span>{node.failureSummary}</span>

                                                                {/* AI Alt Text Generation Button visible only for image-alt rules */}
                                                                {violation.id === 'image-alt' && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleGenerateAltText(node.html, `${violation.id}-${i}`)}
                                                                        disabled={generatingFor === `${violation.id}-${i}`}
                                                                        className="h-6 px-2 text-[10px] uppercase mono-label border-primary/30 text-primary hover:bg-primary/10 hover:text-primary shrink-0 transition-all rounded-none"
                                                                    >
                                                                        {generatingFor === `${violation.id}-${i}` ? (
                                                                            <><Loader2 size={10} className="mr-1 animate-spin" /> Analyzing...</>
                                                                        ) : (
                                                                            <><Sparkles size={10} className="mr-1" /> Suggest Alt-Text</>
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            {/* Generated Result Container */}
                                                            {generatedTexts[`${violation.id}-${i}`] && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                                                    className="mt-3 bg-primary/10 border border-primary/30 p-2 relative whitespace-normal"
                                                                >
                                                                    <div className="text-[9px] uppercase tracking-wider text-primary mb-1 mono-label flex items-center gap-1">
                                                                        <Sparkles size={8} /> AI Suggested Alt-Text
                                                                    </div>
                                                                    <p className="font-sans text-xs text-foreground font-medium leading-relaxed">
                                                                        {generatedTexts[`${violation.id}-${i}`]}
                                                                    </p>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <a
                                                    href={violation.helpUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[10px] mono-label text-primary hover:underline uppercase"
                                                >
                                                    Documentation <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            )}
        </div>
    );
};
