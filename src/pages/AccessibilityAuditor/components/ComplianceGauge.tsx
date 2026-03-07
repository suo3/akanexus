import React from 'react';
import { motion } from 'framer-motion';

interface ComplianceGaugeProps {
    score: number;
}

export const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({ score }) => {
    const getColor = (s: number) => {
        if (s >= 90) return 'text-emerald-500';
        if (s >= 70) return 'text-amber-500';
        if (s >= 50) return 'text-orange-500';
        return 'text-destructive';
    };

    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center p-6 bg-secondary/20 border border-border">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="45"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border"
                    />
                    <motion.circle
                        cx="80"
                        cy="80"
                        r="45"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={getColor(score)}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold tracking-tighter">{score}%</span>
                    <span className="text-[10px] mono-label uppercase text-muted-foreground">WCAG 2.1 AA</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <h4 className="text-xs font-bold mono-label uppercase tracking-widest">April 2026 Readiness</h4>
                <p className="text-[10px] text-muted-foreground uppercase mt-1 transition-colors">
                    {score >= 90 ? 'Compliance Target Achieved' :
                        score >= 70 ? 'Approaching Compliance' :
                            'Critical Remediation Required'}
                </p>
            </div>
        </div>
    );
};
