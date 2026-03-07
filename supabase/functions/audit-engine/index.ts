import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { targetUrl } = await req.json();

        if (!targetUrl) {
            throw new Error("Missing targetUrl parameter");
        }

        console.log(`Starting audit for: ${targetUrl}`);

        // Call Google PageSpeed Insights API (Lighthouse) for Accessibility
        // This allows us to scan any URL, handling JavaScript rendering and cross-origin boundaries!
        const apiKey = Deno.env.get("GOOGLE_PAGESPEED_API_KEY") || ""; // Optional, but good for higher limits
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&category=accessibility${apiKey ? `&key=${apiKey}` : ''}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`PageSpeed API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.lighthouseResult) {
            throw new Error("Invalid response from PageSpeed API");
        }

        const { audits, categories } = data.lighthouseResult;

        // Map Lighthouse audits to our AuditResult interface
        const violations: any[] = [];
        let passes = 0;
        let incomplete = 0;
        let inapplicable = 0;

        for (const [id, audit] of Object.entries(audits) as [string, any][]) {
            if (audit.scoreDisplayMode === "notApplicable") {
                inapplicable++;
                continue;
            }

            if (audit.score === 1) {
                passes++;
                continue;
            }

            // It's a violation if score is 0 or low
            if (audit.score !== null && audit.score < 1 && audit.details && audit.details.type === "table") {
                const nodes = audit.details.items?.map((item: any) => ({
                    html: item.node?.snippet || "HTML snippet unavailable",
                    target: item.node?.selector ? [item.node.selector] : [],
                    failureSummary: item.node?.explanation || "Failure explanation unavailable"
                })) || [];

                // Only add if there are actual node violations reported in the table
                if (nodes.length > 0) {
                    violations.push({
                        id: audit.id,
                        impact: "serious", // Simplify: Lighthouse drops exact axe-core impact, default to serious
                        description: (audit.description || "").split("[Learn")[0].trim(),
                        help: audit.title,
                        helpUrl: audit.details?.helpUrl || `https://dequeuniversity.com/rules/axe/4.4/${audit.id}`,
                        nodes: nodes
                    });
                }
            }
        }

        // Our internal structure expectation
        const auditResult = {
            score: Math.round((categories.accessibility?.score || 0) * 100),
            violations,
            passes,
            incomplete,
            inapplicable
        };

        return new Response(JSON.stringify({ auditResult }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Audit Engine Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
