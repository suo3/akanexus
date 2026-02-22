import { useRef, useEffect, MutableRefObject } from 'react';

interface SpectrumAnalyzerProps {
    analyserNode: MutableRefObject<AnalyserNode | null>;
    isPlaying: boolean;
}

const FREQ_LABELS = [
    { freq: 30, label: '30' },
    { freq: 60, label: '60' },
    { freq: 120, label: '120' },
    { freq: 250, label: '250' },
    { freq: 500, label: '500' },
    { freq: 1000, label: '1k' },
    { freq: 2000, label: '2k' },
    { freq: 4000, label: '4k' },
    { freq: 8000, label: '8k' },
    { freq: 16000, label: '16k' },
];

const DB_GRID = [0, -10, -20, -30, -40, -50, -60];

const freqToX = (freq: number, width: number): number => {
    const logMin = Math.log10(20);
    const logMax = Math.log10(20000);
    return ((Math.log10(Math.max(freq, 20)) - logMin) / (logMax - logMin)) * width;
};

function drawIdle(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const LABEL_H = 18;
    const plotH = H - LABEL_H;

    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, W, H);

    // dB grid
    DB_GRID.forEach((db) => {
        const y = plotH * (1 - (db + 60) / 60);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    });

    // Flat baseline
    ctx.strokeStyle = 'rgba(14,165,233,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, plotH);
    ctx.lineTo(W, plotH);
    ctx.stroke();

    // Freq labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    FREQ_LABELS.forEach(({ freq, label }) => {
        const x = freqToX(freq, W);
        ctx.fillText(label, x, H - 3);
    });
}

export function SpectrumAnalyzer({ analyserNode, isPlaying }: SpectrumAnalyzerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const peakValRef = useRef<Float32Array | null>(null);
    const peakDecayRef = useRef<Float32Array | null>(null);
    const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const LABEL_H = 18;
        const plotH = H - LABEL_H;

        if (!isPlaying) {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            drawIdle(ctx, W, H);
            return;
        }

        const loop = () => {
            const analyser = analyserNode.current;
            if (!analyser) {
                rafRef.current = requestAnimationFrame(loop);
                return;
            }

            const binCount = analyser.frequencyBinCount;
            const sampleRate = analyser.context.sampleRate;

            // Allocate typed arrays once
            if (!freqDataRef.current || freqDataRef.current.length !== binCount) {
                const ab = new ArrayBuffer(binCount);
                freqDataRef.current = new Uint8Array(ab);
                peakValRef.current = new Float32Array(binCount).fill(0);
                peakDecayRef.current = new Float32Array(binCount).fill(0);
            }

            const freqData = freqDataRef.current;
            const peaks = peakValRef.current!;
            const decays = peakDecayRef.current!;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            analyser.getByteFrequencyData(freqData as any);


            // Background
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, W, H);

            // dB grid lines
            DB_GRID.forEach((db) => {
                const y = plotH * (1 - (db + 60) / 60);
                ctx.strokeStyle = db === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            });

            // dB labels
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.font = '8px monospace';
            ctx.textAlign = 'left';
            DB_GRID.forEach((db) => {
                if (db === 0) return;
                const y = plotH * (1 - (db + 60) / 60);
                ctx.fillText(`${db}`, 3, y - 1);
            });

            // Freq grid lines
            FREQ_LABELS.forEach(({ freq }) => {
                const x = freqToX(freq, W);
                ctx.strokeStyle = 'rgba(255,255,255,0.04)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, plotH);
                ctx.stroke();
            });

            // Draw spectrum bars (log-mapped)
            const nyquist = sampleRate / 2;

            for (let i = 1; i < binCount; i++) {
                const freq = (i / binCount) * nyquist;
                if (freq < 20 || freq > 20000) continue;

                const x = freqToX(freq, W);
                const nextFreq = ((i + 1) / binCount) * nyquist;
                const nextX = freqToX(Math.min(nextFreq, 20000), W);
                const barW = Math.max(nextX - x - 0.5, 1);

                const normalized = freqData[i] / 255;
                const barH = normalized * plotH;

                if (barH < 1) continue;

                // Gradient: blue low → cyan → green → yellow → red high
                const r = Math.round(normalized < 0.5 ? 0 : (normalized - 0.5) * 2 * 239);
                const g = Math.round(normalized < 0.5 ? normalized * 2 * 200 : 200 - (normalized - 0.5) * 2 * 100);
                const b = Math.round(normalized < 0.5 ? 233 - normalized * 2 * 100 : 0);
                ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
                ctx.fillRect(x, plotH - barH, barW, barH);

                // Peak hold
                if (freqData[i] > peaks[i]) {
                    peaks[i] = freqData[i];
                    decays[i] = 0;
                } else {
                    decays[i] += 0.4;
                    peaks[i] = Math.max(0, peaks[i] - decays[i] * 0.5);
                }
            }

            // Peak hold lines
            ctx.strokeStyle = 'rgba(255,255,255,0.55)';
            ctx.lineWidth = 1;
            for (let i = 1; i < binCount; i++) {
                const freq = (i / binCount) * nyquist;
                if (freq < 20 || freq > 20000 || peaks[i] < 2) continue;
                const x = freqToX(freq, W);
                const nextFreq = ((i + 1) / binCount) * nyquist;
                const nextX = freqToX(Math.min(nextFreq, 20000), W);
                const barW = Math.max(nextX - x - 0.5, 1);
                const peakY = plotH - (peaks[i] / 255) * plotH;
                ctx.beginPath();
                ctx.moveTo(x, peakY);
                ctx.lineTo(x + barW, peakY);
                ctx.stroke();
            }

            // Freq axis labels
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            FREQ_LABELS.forEach(({ freq, label }) => {
                const x = freqToX(freq, W);
                ctx.fillText(label, x, H - 3);
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [isPlaying, analyserNode]);

    return (
        <div className="relative w-full h-full">
            <canvas
                ref={canvasRef}
                width={1200}
                height={160}
                className="w-full h-full"
                style={{ display: 'block' }}
            />
        </div>
    );
}
