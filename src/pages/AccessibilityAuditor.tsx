import { useState, useRef, useEffect } from "react";
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
import SupportDialog from "@/components/SupportDialog";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

const AccessibilityAuditor = () => {
    // Initialize state from localStorage if available
    const [url, setUrl] = useState(() => {
        return localStorage.getItem("akanexus_auditor_url") || "";
    });
    const [pastedCode, setPastedCode] = useState(() => {
        return localStorage.getItem("akanexus_auditor_code") || "";
    });
    const [auditResults, setAuditResults] = useState<DetailedAuditResponse | null>(() => {
        const savedResults = localStorage.getItem("akanexus_auditor_results");
        return savedResults ? JSON.parse(savedResults) : null;
    });

    const [isAuditing, setIsAuditing] = useState(false);
    const [showSupportDialog, setShowSupportDialog] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("akanexus_auditor_url", url);
    }, [url]);

    useEffect(() => {
        localStorage.setItem("akanexus_auditor_code", pastedCode);
    }, [pastedCode]);

    useEffect(() => {
        if (auditResults) {
            localStorage.setItem("akanexus_auditor_results", JSON.stringify(auditResults));
        } else {
            localStorage.removeItem("akanexus_auditor_results");
        }
    }, [auditResults]);

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
                throw new Error("Unable to connect to the scanning engine.");
            }

            if (data && data.success === false) {
                throw new Error(data.error);
            }

            if (!data || !data.auditResult) {
                throw new Error("Invalid response received from the scanning engine.");
            }

            setAuditResults(data.auditResult);
            toast.success("Deep Scan complete!");
        } catch (error: any) {
            toast.error(error.message || "Could not complete the audit.", {
                description: "Try using the Local Component Audit tab instead.",
                duration: 6000
            });
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
        // Clear persistence
        localStorage.removeItem("akanexus_auditor_results");
        localStorage.removeItem("akanexus_auditor_url");
        localStorage.removeItem("akanexus_auditor_code");
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
                title="Free Accessibility Compliance Auditor"
                description="Verify your website's WCAG 2.1 Level AA compliance for the April 2026 ADA Title II deadline with our 100% free auditing tool."
                keywords="free accessibility audit, free WCAG 2.1 scanner, ADA compliance, web accessibility tool, free React accessibility auditor"
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

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tightest leading-[0.9] mb-4">
                            Accessibility <span className="text-gradient">Compliance Auditor</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            A completely free, industrial-grade auditing engine built to help agencies meet WCAG 2.1 Level AA standards before the 2026 deadline.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                className="mono-label rounded-none border-primary/50 hover:bg-primary/10 transition-colors"
                                onClick={() => setShowSupportDialog(true)}
                            >
                                <ShieldCheck size={16} className="mr-2 text-primary" />
                                Support Our Free Tools
                            </Button>
                        </div>
                    </div>

                    {!auditResults ? (
                        <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
                            <Tabs defaultValue="url" className="w-full">
                                <TabsList className="flex flex-col sm:grid w-full sm:grid-cols-2 h-auto sm:h-14 bg-secondary/30 rounded-none mb-4 sm:mb-8 p-1 sm:p-0 gap-1 sm:gap-0">
                                    <TabsTrigger value="url" className="mono-label uppercase text-xs gap-2 py-3 sm:py-0 w-full">
                                        <Search size={14} /> URL Scanner
                                    </TabsTrigger>
                                    <TabsTrigger value="code" className="mono-label uppercase text-xs gap-2 py-3 sm:py-0 w-full">
                                        <Code2 size={14} /> Code Auditor (React)
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="url">
                                    <Card className="glass rounded-none border-border/50">
                                        <CardContent className="p-4 sm:p-8">
                                            <div className="flex flex-col gap-6">
                                                <div>
                                                    <h3 className="text-lg font-bold uppercase mb-2">Universal Site Scanner</h3>
                                                    <p className="text-sm text-muted-foreground mb-6">
                                                        Enter any URL (React SPAs, WordPress, Next.js, etc.). Our cloud engine will execute a headless browser pass to capture dynamically rendered accessibility nodes.
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <Input
                                                            value={url}
                                                            onChange={(e) => setUrl(e.target.value)}
                                                            placeholder="https://example.com"
                                                            className="bg-background border-border h-12 rounded-none flex-1 w-full"
                                                        />
                                                        <Button
                                                            onClick={handleUrlAudit}
                                                            disabled={isAuditing}
                                                            className="h-12 w-full sm:w-auto px-8 rounded-none mono-label bg-foreground text-background shrink-0"
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
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-border pb-4">
                                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto overflow-hidden">
                                    <Button variant="ghost" onClick={resetAudit} className="mono-label text-[10px] uppercase gap-1 sm:gap-2 px-2 sm:px-4 shrink-0">
                                        <RotateCcw size={12} /> <span className="hidden sm:inline">New Audit</span><span className="sm:hidden">Reset</span>
                                    </Button>
                                    <div className="h-4 w-px bg-border shrink-0" />
                                    <span className="text-[10px] mono-label text-muted-foreground uppercase truncate">Target: {url || "Code"}</span>
                                </div>
                                <Button
                                    onClick={handleDownloadReport}
                                    className="mono-label text-[10px] uppercase bg-foreground text-background rounded-none w-full sm:w-auto"
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
                                        <TabsList className="bg-secondary/30 rounded-none w-full justify-start p-1 h-auto flex-wrap gap-1 sm:gap-0">
                                            <TabsTrigger value="findings" className="px-4 justify-start sm:justify-center sm:px-6 mono-label text-[10px] uppercase w-full sm:w-auto">Automated Findings</TabsTrigger>
                                            <TabsTrigger value="manual" className="px-4 justify-start sm:justify-center sm:px-6 mono-label text-[10px] uppercase w-full sm:w-auto">Manual Checklist</TabsTrigger>
                                            {!url && (
                                                <TabsTrigger value="simulator" className="px-4 justify-start sm:justify-center sm:px-6 mono-label text-[10px] uppercase w-full sm:w-auto">Visual Simulator</TabsTrigger>
                                            )}
                                            <TabsTrigger value="remediation" className="px-4 justify-start sm:justify-center sm:px-6 mono-label text-[10px] uppercase w-full sm:w-auto">Remediation Guide</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="findings" className="mt-6">
                                            <AuditFindings violations={auditResults.violations} />
                                        </TabsContent>

                                        <TabsContent value="manual" className="mt-6">
                                            <ManualChecklist />
                                        </TabsContent>

                                        {!url && (
                                            <TabsContent value="simulator" className="mt-6">
                                                <PreviewSimulator html={pastedCode} />
                                            </TabsContent>
                                        )}

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

            <SupportDialog
                open={showSupportDialog}
                onOpenChange={setShowSupportDialog}
                toolName="Accessibility Auditor"
            />
        </div>
    );
};

export default AccessibilityAuditor;
