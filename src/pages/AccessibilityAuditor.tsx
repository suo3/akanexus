import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Search, ShieldCheck, AlertCircle, FileText, Layout, Activity, Code2, Play, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplianceGauge } from "./AccessibilityAuditor/components/ComplianceGauge";
import { AuditFindings } from "./AccessibilityAuditor/components/AuditFindings";
import { RemediationGuide } from "./AccessibilityAuditor/components/RemediationGuide";
import { ManualChecklist } from "./AccessibilityAuditor/components/ManualChecklist";
import { PreviewSimulator } from "./AccessibilityAuditor/components/PreviewSimulator";
import { runAccessibilityAudit, DetailedAuditResponse, detectSemanticViolations } from "@/utils/accessibilityAudit";
import { generateExecutiveReport } from "@/utils/pdfReportGenerator";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

const AccessibilityAuditor = () => {
    const [url, setUrl] = useState("");
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResults, setAuditResults] = useState<DetailedAuditResponse | null>(null);
    const [pastedCode, setPastedCode] = useState("");
    const previewRef = useRef<HTMLDivElement>(null);

    const handleUrlAudit = async () => {
        if (!url) {
            toast.error("Please enter a valid URL");
            return;
        }

        // Auto-prepend https:// if missing
        let targetUrl = url;
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = `https://${url}`;
            setUrl(targetUrl);
        }

        setIsAuditing(true);
        toast.info("Initiating deep headless scan...", { duration: 4000 });

        try {
            const { data, error } = await supabase.functions.invoke("audit-engine", {
                body: { targetUrl },
            });

            if (error) {
                throw new Error(error.message);
            }

            setAuditResults(data.auditResult);
            toast.success("Deep Scan complete!");
        } catch (error: any) {
            toast.error(`Audit failed: ${error.message || "Could not complete the audit."}`);
        } finally {
            setIsAuditing(false);
        }
    };

    const handleCodeAudit = async () => {
        if (!pastedCode) {
            toast.error("Please paste some React/HTML code");
            return;
        }

        setIsAuditing(true);
        try {
            // Create a temporary container for auditing
            const container = document.createElement('div');
            container.innerHTML = pastedCode;
            document.body.appendChild(container); // Must be in DOM for axe to run correctly

            const results = await runAccessibilityAudit(container);
            setAuditResults(results);

            document.body.removeChild(container);
            toast.success("Audit complete!");
        } catch (error) {
            toast.error("Failed to run audit");
        } finally {
            setIsAuditing(false);
        }
    };

    const resetAudit = () => {
        setAuditResults(null);
        setPastedCode("");
        setUrl("");
    };

    const handleDownloadReport = async () => {
        if (!auditResults) return;
        toast.info("Generating PDF report...");
        try {
            await generateExecutiveReport(auditResults, url);
            toast.success("Executive Report downloaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF document.");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Accessibility Compliance Auditor"
                description="Verify your website's WCAG 2.1 Level AA compliance for the April 2026 ADA Title II deadline."
                keywords="accessibility audit, WCAG 2.1, ADA compliance, web accessibility, React accessibility"
            />
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-up">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-border bg-muted/50 mb-8 mono-label mx-auto">
                            <div className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse" />
                            <span className="text-muted-foreground uppercase tracking-widest">ADA TITLE II COMPLIANCE ENGINE v1.0.0</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tightest leading-[0.9] mb-8">
                            Accessibility <span className="text-gradient">Compliance Auditor</span>
                        </h1>
                    </div>

                    {!auditResults ? (
                        <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
                            <Tabs defaultValue="url" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-14 bg-secondary/30 rounded-none mb-8">
                                    <TabsTrigger value="url" className="mono-label uppercase text-xs gap-2">
                                        <Search size={14} /> URL Scanner
                                    </TabsTrigger>
                                    <TabsTrigger value="code" className="mono-label uppercase text-xs gap-2">
                                        <Code2 size={14} /> Code Auditor (React)
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="url">
                                    <Card className="glass rounded-none border-border/50">
                                        <CardContent className="p-8">
                                            <div className="flex flex-col gap-6">
                                                <div>
                                                    <h3 className="text-lg font-bold uppercase mb-2">Universal Site Scanner</h3>
                                                    <p className="text-sm text-muted-foreground mb-6">
                                                        Enter any URL (React SPAs, WordPress, Next.js, etc.). Our cloud engine will execute a headless browser pass to capture dynamically rendered accessibility nodes.
                                                    </p>
                                                    <div className="flex gap-4">
                                                        <Input
                                                            value={url}
                                                            onChange={(e) => setUrl(e.target.value)}
                                                            placeholder="https://example.com"
                                                            className="bg-background border-border h-12 rounded-none"
                                                        />
                                                        <Button
                                                            onClick={handleUrlAudit}
                                                            disabled={isAuditing}
                                                            className="h-12 px-8 rounded-none mono-label bg-foreground text-background"
                                                        >
                                                            {isAuditing ? "SCANNING..." : "INITIATE"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="code">
                                    <Card className="glass rounded-none border-border/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-lg font-bold uppercase mb-2">Local Component Audit</h3>
                                            <p className="text-sm text-muted-foreground mb-6">
                                                Paste your React component's rendered HTML output or raw JSX to identify structural violations and "Div Soup".
                                            </p>
                                            <textarea
                                                value={pastedCode}
                                                onChange={(e) => setPastedCode(e.target.value)}
                                                className="w-full h-48 bg-background border border-border p-4 font-mono text-xs focus:outline-none focus:border-primary mb-4"
                                                placeholder="<div onClick={() => {}}>...</div>"
                                            />
                                            <Button
                                                onClick={handleCodeAudit}
                                                disabled={isAuditing}
                                                className="w-full h-12 rounded-none mono-label bg-foreground text-background"
                                            >
                                                {isAuditing ? "ANALYZING..." : "RUN COMPLIANCE CHECK"}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="animate-fade-up">
                            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" onClick={resetAudit} className="mono-label text-[10px] uppercase gap-2">
                                        <RotateCcw size={12} /> New Audit
                                    </Button>
                                    <div className="h-4 w-px bg-border" />
                                    <span className="text-[10px] mono-label text-muted-foreground uppercase">Target: {url || "Pasted Code"}</span>
                                </div>
                                <Button
                                    onClick={handleDownloadReport}
                                    className="mono-label text-[10px] uppercase bg-foreground text-background rounded-none"
                                >
                                    Download Executive Report
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: Score & Overview */}
                                <div className="lg:col-span-1 space-y-6">
                                    <ComplianceGauge score={auditResults.score} />

                                    <Card className="glass border-border/50 rounded-none">
                                        <CardHeader>
                                            <CardTitle className="text-xs mono-label uppercase">WCAG Metrics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Violations Detect</span>
                                                <span className="font-bold text-destructive">{auditResults.violations.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Passing Criteria</span>
                                                <span className="font-bold text-emerald-500">{auditResults.passes}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Inapplicable</span>
                                                <span className="font-bold">{auditResults.inapplicable}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right: Detailed Findings & Remediation */}
                                <div className="lg:col-span-2 space-y-8">
                                    <Tabs defaultValue="findings" className="w-full">
                                        <TabsList className="bg-secondary/30 rounded-none w-full justify-start p-1 h-12">
                                            <TabsTrigger value="findings" className="px-6 mono-label text-[10px] uppercase">Automated Findings</TabsTrigger>
                                            <TabsTrigger value="manual" className="px-6 mono-label text-[10px] uppercase">Manual Checklist</TabsTrigger>
                                            <TabsTrigger value="simulator" className="px-6 mono-label text-[10px] uppercase">Visual Simulator</TabsTrigger>
                                            <TabsTrigger value="remediation" className="px-6 mono-label text-[10px] uppercase">Remediation Guide</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="findings" className="mt-6">
                                            <AuditFindings violations={auditResults.violations} />
                                        </TabsContent>

                                        <TabsContent value="manual" className="mt-6">
                                            <ManualChecklist />
                                        </TabsContent>

                                        <TabsContent value="simulator" className="mt-6">
                                            <PreviewSimulator html={pastedCode || "<!-- Run an audit to see preview -->"} />
                                        </TabsContent>

                                        <TabsContent value="remediation" className="mt-6">
                                            <RemediationGuide
                                                steps={auditResults.violations.slice(0, 5).map(v => ({
                                                    title: v.help,
                                                    description: v.description,
                                                    before: v.nodes[0]?.html || "// Code not available",
                                                    after: `// Remediation Example:
<div 
  aria-label="${v.help}"
  tabIndex={0}
  role="region"
>
  ${v.nodes[0]?.html || "..."}
</div>`
                                                }))}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AccessibilityAuditor;
