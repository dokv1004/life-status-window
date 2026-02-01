'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Swords, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 glow-cyan text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12 space-y-6">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Sparkles className="w-20 h-20 text-cyan-400 glow-cyan animate-pulse" />
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            이세계 상태창에<br />오신 것을 환영합니다
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            현실의 모든 행동을 <span className="text-cyan-400 font-semibold">RPG 스탯</span>으로 변환하세요.<br />
            AI가 당신의 노력을 분석하고, 레벨업의 즐거움을 선사합니다.
          </p>

          {user && (
            <p className="text-slate-400 text-sm mt-4">
              환영합니다, <span className="text-yellow-400 glow-gold font-semibold">{user.displayName || user.email}</span>님!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {user ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Dashboard Button */}
            <button
              onClick={() => router.push('/dashboard')}
              className="group relative bg-gradient-to-br from-cyan-900/50 to-blue-900/50 hover:from-cyan-800/50 hover:to-blue-800/50 border-2 border-cyan-500/30 hover:border-cyan-400/50 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30"
            >
              <div className="flex flex-col items-center gap-4">
                <LayoutDashboard className="w-12 h-12 text-cyan-400 group-hover:glow-cyan transition-all" />
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">내 상태 확인하기</h3>
                  <p className="text-slate-300 text-sm">
                    현재 레벨, 스탯, 경험치를 확인하세요
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            {/* Action Button */}
            <button
              onClick={() => router.push('/action')}
              className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 hover:from-purple-800/50 hover:to-pink-800/50 border-2 border-purple-500/30 hover:border-purple-400/50 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
            >
              <div className="flex flex-col items-center gap-4">
                <Swords className="w-12 h-12 text-purple-400 group-hover:glow-magenta transition-all" />
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-2">수련하러 가기</h3>
                  <p className="text-slate-300 text-sm">
                    오늘의 행동을 기록하고 스탯을 상승시키세요
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-purple-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-cyan-500/50 transition-all hover:scale-105 text-lg"
            >
              로그인하고 시작하기
            </button>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="text-cyan-400 font-bold mb-2">🤖 AI 분석</div>
            <p className="text-slate-300 text-sm">
              Gemini AI가 당신의 행동을 분석하여 적절한 스탯으로 변환합니다
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="text-purple-400 font-bold mb-2">📊 실시간 통계</div>
            <p className="text-slate-300 text-sm">
              레이더 차트로 5가지 스탯(STR, INT, VIT, DEX, LUK)을 시각화
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="text-yellow-400 font-bold mb-2">⚡ 레벨업 시스템</div>
            <p className="text-slate-300 text-sm">
              경험치를 쌓아 레벨업하고, 성장의 즐거움을 경험하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
