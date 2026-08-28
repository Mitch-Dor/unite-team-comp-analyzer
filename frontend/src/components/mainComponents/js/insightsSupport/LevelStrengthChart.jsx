import { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CustomDot(props) {
    const { cx, cy, payload, compact } = props;
    const hasExplanation = payload.explanation !== null;
    const r = compact ? 2 : 3;

    if (!hasExplanation) {
        return <circle cx={cx} cy={cy} r={r} fill="#7c9cff" stroke="none" />;
    }

    return (
        <g style={{ cursor: 'pointer' }}>
            <circle cx={cx} cy={cy} r={compact ? 6 : 9} fill="#7c9cff" fillOpacity={0.18} />
            <circle cx={cx} cy={cy} r={compact ? 3.5 : 5} fill="#ffd400" stroke="#1a1a1a" strokeWidth={compact ? 1 : 1.5} />
        </g>
    );
}

function CustomTooltip({ active, payload, compact }) {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0].payload;
    if (point.explanation === null) return null;

    return (
        <div
            style={{
                maxWidth: compact ? 160 : 260,
                background: '#1a1a1a',
                border: '1px solid #ffd400',
                borderRadius: 8,
                padding: compact ? '6px 8px' : '10px 12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
        >
            <div style={{ color: '#ffd400', fontWeight: 700, fontSize: compact ? 10 : 12, marginBottom: 4 }}>
                Lvl {point.level} · Pwr {point.relative_power}
            </div>
            <div style={{ color: '#e8e8e8', fontSize: compact ? 10 : 12, lineHeight: 1.35 }}>
                {point.explanation}
            </div>
        </div>
    );
}

export default function LevelStrengthChart({ data }) {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(600);

    useEffect(() => {
        if (!containerRef.current) return;
        const el = containerRef.current;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });
        observer.observe(el);
        setWidth(el.getBoundingClientRect().width);
        return () => observer.disconnect();
    }, []);

    if (!data || !data[0].level) {
        return <></>;
    }

    // Breakpoints tuned for very narrow embeds (e.g. 132px) up through tablet widths
    const compact = width < 340;
    const tiny = width < 180;

    const fontSizeTitle = tiny ? 11 : compact ? 13 : 16;
    const fontSizeSubtitle = tiny ? 8 : compact ? 9 : 12;
    const fontSizeTick = tiny ? 7 : compact ? 8.5 : 11;
    const padding = tiny ? 6 : compact ? 10 : 20;
    const xTickInterval = tiny ? 4 : compact ? 2 : 0; // skip labels when tiny
    const yTicks = tiny ? [0, 5, 10] : compact ? [0, 5, 10] : [0, 2, 4, 6, 8, 10];

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: compact ? 300 : 420,
                background: '#111',
                padding,
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    color: '#fff',
                    fontSize: fontSizeTitle,
                    fontWeight: 700,
                    marginBottom: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {tiny ? 'Power by Level' : 'Relative Power by Level'}
            </div>
            {!tiny && (
                <div style={{ color: '#888', fontSize: fontSizeSubtitle, marginBottom: compact ? 6 : 12 }}>
                    Hover a highlighted point for details
                </div>
            )}
            <ResponsiveContainer width="100%" height={tiny ? '90%' : '85%'}>
                <LineChart
                    data={data}
                    margin={{
                        top: 6,
                        right: tiny ? 4 : compact ? 10 : 20,
                        bottom: tiny ? 0 : 10,
                        left: tiny ? -20 : compact ? -10 : 0,
                    }}
                >
                    <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="level"
                        type="number"
                        domain={[1, 15]}
                        ticks={Array.from({ length: 15 }, (_, i) => i + 1).filter(
                            (v) => xTickInterval === 0 || v % xTickInterval === 0 || v === 1
                        )}
                        stroke="#888"
                        tick={{ fill: '#888', fontSize: fontSizeTick }}
                        tickLine={!tiny}
                        axisLine={{ stroke: '#444' }}
                        label={
                            tiny
                                ? undefined
                                : { value: 'Level', position: 'insideBottom', offset: -3, fill: '#888', fontSize: fontSizeSubtitle }
                        }
                        height={tiny ? 16 : 30}
                    />
                    <YAxis
                        dataKey="relative_power"
                        type="number"
                        domain={[0, 10]}
                        ticks={yTicks}
                        stroke="#888"
                        tick={{ fill: '#888', fontSize: fontSizeTick }}
                        tickLine={!tiny}
                        axisLine={{ stroke: '#444' }}
                        width={tiny ? 20 : compact ? 26 : 40}
                        label={
                            tiny
                                ? undefined
                                : compact
                                ? undefined
                                : { value: 'Relative Power', angle: -90, position: 'insideLeft', fill: '#888', fontSize: fontSizeSubtitle }
                        }
                    />
                    <Tooltip content={<CustomTooltip compact={compact} />} cursor={{ stroke: '#444', strokeWidth: 1 }} />
                    <Line
                        type="monotone"
                        dataKey="relative_power"
                        stroke="#7c9cff"
                        strokeWidth={compact ? 1.5 : 2}
                        dot={<CustomDot compact={compact} />}
                        activeDot={{ r: compact ? 4 : 6, fill: '#ffd400', stroke: '#1a1a1a', strokeWidth: 1.5 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}