import axe from 'axe-core';

export interface AuditResult {
    id: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    description: string;
    help: string;
    helpUrl: string;
    nodes: {
        html: string;
        target: any[];
        failureSummary: string;
    }[];
}

export interface DetailedAuditResponse {
    score: number;
    violations: AuditResult[];
    passes: number;
    incomplete: number;
    inapplicable: number;
}

/**
 * Run an accessibility audit on a given HTML element.
 */
export const runAccessibilityAudit = async (element: HTMLElement): Promise<DetailedAuditResponse> => {
    try {
        const results = await axe.run(element, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
            }
        });

        const score = calculateReadinessScore(results);

        return {
            score,
            violations: results.violations.map(v => ({
                id: v.id,
                impact: v.impact as AuditResult['impact'],
                description: v.description,
                help: v.help,
                helpUrl: v.helpUrl,
                nodes: v.nodes.map(n => ({
                    html: n.html,
                    target: n.target,
                    failureSummary: n.failureSummary || 'No failure summary available'
                }))
            })),
            passes: results.passes.length,
            incomplete: results.incomplete.length,
            inapplicable: results.inapplicable.length
        };
    } catch (error) {
        console.error('Axe audit failed:', error);
        throw error;
    }
};

/**
 * Calculate a "Readiness Score" based on violation impact weights.
 */
const calculateReadinessScore = (results: axe.AxeResults): number => {
    if (results.passes.length + results.violations.length === 0) return 0;

    const totalChecks = results.passes.length + results.violations.length;
    const weights = {
        critical: 1.0,
        serious: 0.7,
        moderate: 0.4,
        minor: 0.1
    };

    let totalDeduction = 0;
    results.violations.forEach(v => {
        const weight = weights[v.impact as keyof typeof weights] || 0.5;
        // Each violation deducts based on its impact, capped at a reasonable level
        totalDeduction += weight;
    });

    // Score = 100 - (weighted violations / density)
    // This is a simplified model for the "Industrial" look
    const score = Math.max(0, 100 - (totalDeduction * (100 / (totalChecks || 1))));
    return Math.round(score);
};

/**
 * Detects "Div Soup" and missing semantic HTML specifically for React components.
 */
export const detectSemanticViolations = (html: string): string[] => {
    const violations: string[] = [];

    // Very basic regex-based check for common React pitfalls in pasted HTML
    if (html.includes('onClick=') && html.includes('<div')) {
        violations.push('Interactive element detected on a <div>. Consider using <button> for keyboard operability.');
    }

    if (html.includes('role="button"') && !html.includes('onKeyDown=')) {
        violations.push('Role "button" found without keyboard event handlers (onKeyDown/onKeyPress).');
    }

    return violations;
};
