'use client';

import { useEffect } from 'react';
import { Flame, Brain, Heart, Zap, Sparkles, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionApiResponse } from '@/types/api';

interface ResultModalProps {
  result: ActionApiResponse;
  onClose: () => void;
}

export default function ResultModal({ result, onClose }: ResultModalProps) {
  useEffect(() => {
    if (result.leveledUp) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#8b5cf6', '#fbbf24'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#8b5cf6', '#fbbf24'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [result.leveledUp]);

  const getStatIcon = (stat: string) => {
    const iconClass = 'w-5 h-5';
    switch (stat) {
      case 'STR':
        return <Flame className={`${iconClass} text-red-500`} />;
      case 'INT':
        return <Brain className={`${iconClass} text-blue-500`} />;
      case 'VIT':
        return <Heart className={`${iconClass} text-green-500`} />;
      case 'DEX':
        return <Zap className={`${iconClass} text-yellow-500`} />;
      case 'LUK':
        return <Sparkles className={`${iconClass} text-purple-500`} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 헤더 */}
        <div
          className={`p-6 relative ${
            result.leveledUp
              ? 'bg-linear-to-r from-yellow-50 to-orange-50'
              : 'bg-linear-to-r from-blue-50 to-blue-100'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-200/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {result.leveledUp ? (
            <div className="text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3 animate-bounce" />
              <h2 className="text-3xl font-black text-yellow-600 mb-2">LEVEL UP!</h2>
              <p className="text-orange-600 font-semibold text-lg">
                Level {result.level - 1} → {result.level}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">수련 완료!</h2>
              <p className="text-gray-500 text-sm mt-1">스탯이 업데이트되었어요</p>
            </div>
          )}
        </div>

        {/* 스탯 변화 */}
        <div className="p-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">스탯 변화</h3>
          {Object.entries(result.result.stats).map(
            ([stat, value]) =>
              value !== 0 && (
                <div
                  key={stat}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-in slide-in-from-left duration-300"
                >
                  <div className="flex items-center gap-3">
                    {getStatIcon(stat)}
                    <span className="text-gray-700 font-medium">{stat}</span>
                  </div>
                  <span
                    className={`font-bold text-xl ${
                      value > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {value > 0 ? '+' : ''}
                    {value}
                  </span>
                </div>
              )
          )}
        </div>

        {/* AI 코멘트 */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-gray-700 text-sm italic">"{result.result.comment}"</p>
          </div>
        </div>

        {/* 확인 버튼 */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
