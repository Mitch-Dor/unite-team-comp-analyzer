import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';

const mockData = {
    levelStrength: [
        {level: 1, relative_power: 3, explanation: "Bulbasaur has relatively few tools at low levels. His damage is low and inconsistent. He has little secure."}, 
        {level: 2, relative_power: 3, explanation: null}, 
        {level: 3, relative_power: 3, explanation: null}, 
        {level: 4, relative_power: 2, explanation: null}, 
        {level: 5, relative_power: 4, explanation: "Sludge bomb / Giga drain are strong but not game changing on their own."}, 
        {level: 6, relative_power: 4, explanation: null}, 
        {level: 7, relative_power: 7, explanation: "Solarbeam / Petal Blizzard are genuinely game changing and give Venu insane poke or brawling capabilities."}, 
        {level: 8, relative_power: 6, explanation: null}, 
        {level: 9, relative_power: 8, explanation: "Venu's ult does a lot of damage but also gives him every stat he wants for either moveset. His ult is a massive spike, especially if running amp."}, 
        {level: 10, relative_power: 7, explanation: null}, 
        {level: 11, relative_power: 7, explanation: "Giga Drain+ / Sludge Bomb+ are not overly impactful."}, 
        {level: 12, relative_power: 6, explanation: null}, 
        {level: 13, relative_power: 8, explanation: "Petal Blizzard+ / Solarbeam+ are Venu's greatest spike. If your Venu is 13 at 2:00 you are in a good spot."}, 
        {level: 14, relative_power: 8, explanation: null}, 
        {level: 15, relative_power: 8, explanation: null}
    ],
};

// Custom dot: bigger + highlighted ring for points that have an explanation, small plain dot otherwise
function CustomDot(props) {
    const { cx, cy, payload } = props;
    const hasExplanation = payload.explanation !== null;

    if (!hasExplanation) {
        return <circle cx={cx} cy={cy} r={3} fill="#7c9cff" stroke="none" />;
    }

    return (
        <g style={{ cursor: 'pointer' }}>
            <circle cx={cx} cy={cy} r={9} fill="#7c9cff" fillOpacity={0.18} />
            <circle cx={cx} cy={cy} r={5} fill="#ffd400" stroke="#1a1a1a" strokeWidth={1.5} />
        </g>
    );
}

// Custom tooltip: only renders content when the hovered point has a non-null explanation
function CustomTooltip({ active, payload }) {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0].payload;
    if (point.explanation === null) return null;

    return (
        <div
            style={{
                maxWidth: 260,
                background: '#1a1a1a',
                border: '1px solid #ffd400',
                borderRadius: 8,
                padding: '10px 12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
        >
            <div style={{ color: '#ffd400', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
                Level {point.level} · Power {point.relative_power}
            </div>
            <div style={{ color: '#e8e8e8', fontSize: 12, lineHeight: 1.4 }}>
                {point.explanation}
            </div>
        </div>
    );
}

export default function LevelStrengthChart() {
    return (
        <div style={{ width: '100%', height: 420, background: '#111', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                Relative Power by Level
            </div>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>
                Hover a highlighted point for details
            </div>
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={mockData.levelStrength} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="level"
                        type="number"
                        domain={[1, 15]}
                        ticks={Array.from({ length: 15 }, (_, i) => i + 1)}
                        stroke="#888"
                        tick={{ fill: '#888', fontSize: 11 }}
                        label={{ value: 'Level', position: 'insideBottom', offset: -5, fill: '#888', fontSize: 12 }}
                    />
                    <YAxis
                        dataKey="relative_power"
                        type="number"
                        domain={[0, 10]}
                        ticks={[0, 2, 4, 6, 8, 10]}
                        stroke="#888"
                        tick={{ fill: '#888', fontSize: 11 }}
                        label={{ value: 'Relative Power', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#444', strokeWidth: 1 }} />
                    <Line
                        type="monotone"
                        dataKey="relative_power"
                        stroke="#7c9cff"
                        strokeWidth={2}
                        dot={<CustomDot />}
                        activeDot={{ r: 6, fill: '#ffd400', stroke: '#1a1a1a', strokeWidth: 1.5 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}