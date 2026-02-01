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
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#334155" strokeOpacity={0.3} />
        <PolarAngleAxis
          dataKey="stat"
          tick={{ fill: '#06b6d4', fontSize: 14, fontWeight: 'bold' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#06b6d4"
          fill="#06b6d4"
          fillOpacity={0.5}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
