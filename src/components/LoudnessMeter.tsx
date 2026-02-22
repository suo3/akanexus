import { useRef, useEffect, useState, MutableRefObject } from 'react';

interface LoudnessMeterProps {
    analyserNode: MutableRefObject<AnalyserNode | null>;
    isPlaying: boolean;
}

// Number of history samples kept for integrated LUFS (~10s at 10fps)
const HISTORY_SIZE = 300;
// Streaming targets in LUFS
const TARGETS = [
    { lufs: -14, label: 'Spotify / YT', color: 'rgba(59,130,246,0.8)' },
    { lufs: -16, label: 'Apple Music', color: 'rgba(168,85,247,0.7)' },
];

function rmsToLufs(rms: number): number {
    if (rms < 1e-8) return -70;
    return 20 * Math.log10(rms) - 0.691; // simplified K-weight offset
}

function dbToBarPercent(db: number, floor = -60, ceil = 0): number {
    return Math.max(0, Math.min(1, (db - floor) / (ceil - floor)));
}

function barColor(lufs: number): string {
    if (lufs > -6) return '#ef4444';   // red – clipping danger
    if (lufs > -14) return '#eab308';  // yellow – louder than target
    return '#22c55e';                  // green – in target range
}

export function LoudnessMeter({ analyserNode, isPlaying }: LoudnessMeterProps) {
    const rafRef = useRef<number | null>(null);
    const timeDomainRef = useRef<Float32Array<ArrayBuffer> | null>(null);
    const historyRef = useRef<Float32Array>(new Float32Array(HISTORY_SIZE).fill(-70));
    const historyIdxRef = useRef(0);
    const historyCountRef = useRef(0);
    const peakHoldRef = useRef(-70);
    const peakHoldDecayRef = useRef(0);
    const frameCountRef = useRef(0);

    const [meters, setMeters] = useState({
        instantDb: -70,
        shortTermLufs: -70,
        integratedLufs: -70,
        truePeak: -70,
    });

    useEffect(() => {
        if (!isPlaying) {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            // Reset history
            historyRef.current.fill(-70);
            historyIdxRef.current = 0;
            historyCountRef.current = 0;
            peakHoldRef.current = -70;
            return;
        }

        const loop = () => {
            const analyser = analyserNode.current;
            if (!analyser) {
                rafRef.current = requestAnimationFrame(loop);
                return;
            }

            const bufLen = analyser.fftSize;

            if (!timeDomainRef.current || timeDomainRef.current.length !== bufLen) {
                const ab = new ArrayBuffer(bufLen * Float32Array.BYTES_PER_ELEMENT);
                timeDomainRef.current = new Float32Array(ab);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            analyser.getFloatTimeDomainData(timeDomainRef.current as any);
            const data = timeDomainRef.current;

            // Instantaneous RMS
            let sumSq = 0;
            let peakSample = 0;
            for (let i = 0; i < bufLen; i++) {
                const s = data[i];
                sumSq += s * s;
                if (Math.abs(s) > peakSample) peakSample = Math.abs(s);
            }
            const rms = Math.sqrt(sumSq / bufLen);
            const instantDb = rmsToLufs(rms);
            const truePeakDb = peakSample < 1e-8 ? -70 : 20 * Math.log10(peakSample);

            // Peak hold with decay
            if (truePeakDb > peakHoldRef.current) {
                peakHoldRef.current = truePeakDb;
                peakHoldDecayRef.current = 0;
            } else {
                peakHoldDecayRef.current += 1;
                if (peakHoldDecayRef.current > 60) {
                    peakHoldRef.current = Math.max(-70, peakHoldRef.current - 0.15);
                }
            }

            // Short-term LUFS: rolling ~3s window (at ~60fps, 180 frames)
            const history = historyRef.current;
            history[historyIdxRef.current] = instantDb;
            historyIdxRef.current = (historyIdxRef.current + 1) % HISTORY_SIZE;
            if (historyCountRef.current < HISTORY_SIZE) historyCountRef.current++;

            const stWindow = Math.min(historyCountRef.current, 180);
            let stSum = 0;
            const startIdx = (historyIdxRef.current - stWindow + HISTORY_SIZE) % HISTORY_SIZE;
            for (let i = 0; i < stWindow; i++) {
                const db = history[(startIdx + i) % HISTORY_SIZE];
                stSum += Math.pow(10, db / 10);
            }
            const shortTermLufs = 10 * Math.log10(stSum / stWindow);

            // Integrated: all history
            let intSum = 0;
            const count = historyCountRef.current;
            for (let i = 0; i < count; i++) {
                intSum += Math.pow(10, history[i] / 10);
            }
            const integratedLufs = 10 * Math.log10(intSum / count);

            // Update React state at ~15fps to avoid flooding renders
            frameCountRef.current++;
            if (frameCountRef.current % 4 === 0) {
                setMeters({
                    instantDb: Math.max(-70, instantDb),
                    shortTermLufs: isFinite(shortTermLufs) ? Math.max(-70, shortTermLufs) : -70,
                    integratedLufs: isFinite(integratedLufs) ? Math.max(-70, integratedLufs) : -70,
                    truePeak: Math.max(-70, peakHoldRef.current),
                });
            }

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

    const { instantDb, shortTermLufs, integratedLufs, truePeak } = meters;
    const barPct = dbToBarPercent(instantDb) * 100;
    const peakPct = dbToBarPercent(truePeak) * 100;
    const color = barColor(shortTermLufs);
    const isClipping = truePeak > -0.5;

    return (
        <div className="flex flex-col h-full gap-3 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Loudness Meter
                </span>
                <span
                    className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 border ${isClipping
                        ? 'border-red-500 text-red-400 bg-red-500/10 animate-pulse'
                        : 'border-border text-muted-foreground'
                        }`}
                >
                    {isClipping ? '⚠ CLIP' : isPlaying ? 'LIVE' : 'IDLE'}
                </span>
            </div>

            {/* LUFS readouts */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: 'Short-Term', value: shortTermLufs, suffix: 'LUFS' },
                    { label: 'Integrated', value: integratedLufs, suffix: 'LUFS' },
                    { label: 'True Peak', value: truePeak, suffix: 'dBFS' },
                ].map(({ label, value, suffix }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center p-2 border border-border bg-secondary/30"
                    >
                        <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                            {label}
                        </span>
                        <span
                            className="text-sm font-bold font-mono tabular-nums"
                            style={{ color: barColor(value) }}
                        >
                            {value <= -70 ? '—' : value.toFixed(1)}
                        </span>
                        <span className="text-[8px] font-mono text-muted-foreground/60 uppercase">
                            {suffix}
                        </span>
                    </div>
                ))}
            </div>

            {/* Vertical bar meter */}
            <div className="flex-1 flex gap-2 min-h-0">
                {/* Bar + targets */}
                <div className="relative flex-1 bg-secondary/30 border border-border overflow-hidden">
                    {/* Streaming target lines */}
                    {TARGETS.map(({ lufs, label, color: lc }) => {
                        const pct = dbToBarPercent(lufs) * 100;
                        return (
                            <div
                                key={lufs}
                                className="absolute left-0 right-0 flex items-center"
                                style={{ bottom: `${pct}%` }}
                            >
                                <div className="flex-1 h-px" style={{ backgroundColor: lc }} />
                                <span
                                    className="text-[7px] font-mono px-1 whitespace-nowrap"
                                    style={{ color: lc }}
                                >
                                    {lufs}
                                </span>
                            </div>
                        );
                    })}

                    {/* Level fill */}
                    <div
                        className="absolute bottom-0 left-0 right-0 transition-none"
                        style={{
                            height: `${barPct}%`,
                            background: `linear-gradient(to top, ${color}cc, ${color}55)`,
                        }}
                    />

                    {/* True peak marker */}
                    {peakPct > 0 && (
                        <div
                            className="absolute left-0 right-0 h-0.5 bg-white/70"
                            style={{ bottom: `${peakPct}%` }}
                        />
                    )}
                </div>

                {/* dB scale */}
                <div className="flex flex-col justify-between py-0 text-right min-w-[28px]">
                    {[0, -10, -20, -30, -40, -50, -60].map((db) => (
                        <span
                            key={db}
                            className="text-[8px] font-mono text-muted-foreground/50 leading-none"
                        >
                            {db}
                        </span>
                    ))}
                </div>
            </div>

            {/* Streaming targets legend */}
            <div className="flex flex-col gap-1">
                {TARGETS.map(({ lufs, label, color: lc }) => (
                    <div key={lufs} className="flex items-center gap-1.5">
                        <div className="w-3 h-px" style={{ backgroundColor: lc }} />
                        <span className="text-[8px] font-mono text-muted-foreground/60 uppercase tracking-wide">
                            {label} {lufs} LUFS
                        </span>
                    </div>
                ))}
                <span className="text-[7px] font-mono text-muted-foreground/30 mt-1">
                    ~LUFS (RMS approx.)
                </span>
            </div>
        </div>
    );
}
