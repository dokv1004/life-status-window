'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Stats } from '@/types/user';

interface StatusChartProps {
  stats: Stats;
}

export default function StatusChart({ stats }: StatusChartProps) {
  const data = [
    { stat: 'STR', value: stats.STR, fullMark: 100 },
    { stat: 'INT', value: stats.INT, fullMark: 100 },
    { stat: 'VIT', value: stats.VIT, fullMark: 100 },
    { stat: 'DEX', value: stats.DEX, fullMark: 100 },
    { stat: 'LUK', value: stats.LUK, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="stat"
          tick={{ fill: '#3b82f6', fontSize: 14, fontWeight: 'bold' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
        />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#8b5cf6"
          fill="url(#statGradient)"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <defs>
          <linearGradient id="statGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </RadarChart>
    </ResponsiveContainer>
  );
}
