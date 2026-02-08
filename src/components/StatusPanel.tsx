'use client';

import { User } from '@/types/user';
import StatusChart from './StatusChart';
import { Flame, Brain, Heart, Zap, Sparkles } from 'lucide-react';

interface StatusPanelProps {
  user: User;
}

export default function StatusPanel({ user }: StatusPanelProps) {
  const requiredExp = user.level * 100;
  const expPercentage = (user.exp / requiredExp) * 100;

  const statItems = [
    { key: 'STR', label: '근력', icon: Flame, iconColor: 'text-red-500', value: user.stats.STR },
    { key: 'INT', label: '지능', icon: Brain, iconColor: 'text-blue-500', value: user.stats.INT },
    { key: 'VIT', label: '체력', icon: Heart, iconColor: 'text-green-500', value: user.stats.VIT },
    { key: 'DEX', label: '민첩', icon: Zap, iconColor: 'text-yellow-500', value: user.stats.DEX },
    { key: 'LUK', label: '행운', icon: Sparkles, iconColor: 'text-purple-500', value: user.stats.LUK },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 헤더: 닉네임 & 레벨 */}
      <div className="bg-linear-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.nickname}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 text-sm">Level</span>
              <span className="text-blue-600 font-bold text-xl">{user.level}</span>
            </div>
          </div>
          <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
            모험가
          </div>
        </div>

        {/* EXP 바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>EXP</span>
            <span>{user.exp} / {requiredExp}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-linear-to-r from-blue-500 to-blue-700 h-full transition-all duration-500"
              style={{ width: `${Math.min(expPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 레이더 차트 */}
      <div className="p-6 bg-gray-50/50 isolate">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 text-center">STATUS CHART</h3>
        <StatusChart stats={user.stats} />
      </div>

      {/* 스탯 리스트 */}
      <div className="p-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">STATS</h3>
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                <div>
                  <span className="text-gray-800 font-medium font-mono">{stat.key}</span>
                  <span className="text-gray-400 text-xs ml-2">{stat.label}</span>
                </div>
              </div>
              <span className="text-gray-800 font-bold text-lg">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
