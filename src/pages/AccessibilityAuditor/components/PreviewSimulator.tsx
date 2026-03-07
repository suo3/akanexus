import React from 'react';
import { EyeOff, Layout } from 'lucide-react';

interface PreviewSimulatorProps {
    html: string;
}

export const PreviewSimulator: React.FC<PreviewSimulatorProps> = ({ html }) => {
    const [isReaderMode, setIsReaderMode] = React.useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-secondary/20 p-2 border border-border">
                <div className="flex items-center gap-2 px-2">
                    <Layout size={14} className="text-muted-foreground" />
                    <span className="text-[10px] mono-label uppercase">Visual Simulator</span>
                </div>
                <div className="flex bg-background border border-border p-1">
                    <button
                        onClick={() => setIsReaderMode(false)}
                        className={`px-3 py-1 text-[9px] mono-label uppercase transition-colors ${!isReaderMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Normal View
                    </button>
                    <button
                        onClick={() => setIsReaderMode(true)}
                        className={`px-3 py-1 text-[9px] mono-label uppercase transition-colors ${isReaderMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Reader Mode
                    </button>
                </div>
            </div>

            <div className={`border border-border p-8 min-h-[300px] transition-all bg-white text-black overflow-auto ${isReaderMode ? 'reader-simulation' : ''}`}>
                {isReaderMode ? (
                    <div className="space-y-4 font-serif">
                        <style dangerouslySetInnerHTML={{
                            __html: `
              .reader-simulation * { 
                all: unset !important; 
                display: block !important; 
                margin-bottom: 1em !important;
                font-family: serif !important;
                background: none !important;
                color: black !important;
              }
              .reader-simulation h1 { font-size: 2em !important; font-weight: bold !important; border-bottom: 2px solid black !important; }
              .reader-simulation h2 { font-size: 1.5em !important; font-weight: bold !important; }
              .reader-simulation a { color: blue !important; text-decoration: underline !important; }
              .reader-simulation img::after { content: " [Image Alt: " attr(alt) "]"; color: #666; font-style: italic; }
              .reader-simulation button::before { content: "[Button: "; }
              .reader-simulation button::after { content: "]"; }
            `}} />
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                )}
            </div>

            {isReaderMode && (
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                    <EyeOff size={14} className="text-blue-500 shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        <span className="font-bold text-blue-500 uppercase tracking-widest">Reader Simulation Active:</span> Styles removed to reveal underlying content hierarchy. Check if headings (H1, H2, H3) follow a logical flow and if non-text content provides text alternatives.
                    </p>
                </div>
            )}
        </div>
    );
};
