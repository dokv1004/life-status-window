'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Flame, Brain, Heart, Zap, Sparkles, Loader2, TrendingUp, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionResult {
  stats: {
    STR: number;
    INT: number;
    VIT: number;
    DEX: number;
    LUK: number;
  };
  comment: string;
}

interface ApiResponse {
  success: boolean;
  result: ActionResult;
  stats: {
    STR: number;
    INT: number;
    VIT: number;
    DEX: number;
    LUK: number;
  };
  level: number;
  exp: number;
  leveledUp: boolean;
}

export default function ActionPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (showResult && result?.leveledUp) {
      // Confetti celebration for level up
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00f3ff', '#ff00ff', '#ffd700']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f3ff', '#ff00ff', '#ffd700']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [showResult, result?.leveledUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !uid) return;

    setLoading(true);
    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, uid }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
        setShowResult(true);
        setContent('');
      }
    } catch (error) {
      console.error('Failed to submit action:', error);
      alert('행동 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowResult(false);
    setResult(null);
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'STR': return <Flame className="w-5 h-5 text-red-400" />;
      case 'INT': return <Brain className="w-5 h-5 text-blue-400" />;
      case 'VIT': return <Heart className="w-5 h-5 text-green-400" />;
      case 'DEX': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'LUK': return <Sparkles className="w-5 h-5 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 glow-cyan mb-2 tracking-wide">
            수련장
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            오늘 당신이 한 행동을 기록하세요. AI가 분석하여 스탯으로 변환합니다.
          </p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 md:p-6 shadow-2xl shadow-cyan-500/20">
            <label htmlFor="action" className="block text-cyan-400 font-medium mb-3 text-sm md:text-base">
              오늘의 행동
            </label>
            <textarea
              id="action"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 헬스장에서 1시간 운동했다&#10;예: 알고리즘 문제 3개를 풀었다&#10;예: 8시간 푹 잤다"
              className="w-full h-40 md:h-48 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none text-sm md:text-base"
              disabled={loading}
            />
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto px-4 py-2 min-h-[44px] text-slate-300 hover:text-white transition-colors text-sm md:text-base"
              >
                대시보드로 돌아가기
              </button>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    수련 보고하기
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
            <p className="text-purple-300 animate-pulse text-sm md:text-base">
              시스템이 행동을 분석 중입니다...
            </p>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 rounded-xl max-w-md w-full shadow-2xl shadow-cyan-500/30 overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className={`p-6 border-b border-cyan-500/30 relative ${
              result.leveledUp
                ? 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50'
                : 'bg-gradient-to-r from-cyan-900/50 to-purple-900/50'
            }`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 hover:bg-slate-700/50 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
              {result.leveledUp ? (
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-yellow-400 glow-gold mx-auto mb-3 animate-bounce" />
                  <h2 className="text-3xl font-bold text-yellow-400 glow-gold mb-2 animate-pulse">
                    LEVEL UP!
                  </h2>
                  <p className="text-green-400 font-semibold text-lg">
                    Level {result.level - 1} → {result.level}
                  </p>
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                  ✨ 수련 완료!
                </h2>
              )}
            </div>

            {/* Stats Changes */}
            <div className="p-6 space-y-3">
              <h3 className="text-cyan-400 font-semibold mb-3">스탯 변화</h3>
              {Object.entries(result.result.stats).map(([stat, value]) => (
                value !== 0 && (
                  <div
                    key={stat}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 animate-slideIn"
                  >
                    <div className="flex items-center gap-3">
                      {getStatIcon(stat)}
                      <span className="text-slate-200 font-medium">{stat}</span>
                    </div>
                    <span className={`font-bold text-xl ${value > 0 ? 'text-green-400 glow-green animate-pulse' : 'text-red-400'}`}>
                      {value > 0 ? '+' : ''}{value}
                    </span>
                  </div>
                )
              ))}
            </div>

            {/* AI Comment */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4">
                <p className="text-slate-200 text-sm italic">
                  "{result.result.comment}"
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
              <button
                onClick={closeModal}
                className="w-full py-3 min-h-[44px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/50 transition-all"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        .glow-green {
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.8), 0 0 20px rgba(57, 255, 20, 0.5);
        }
      `}</style>
    </div>
  );
}
