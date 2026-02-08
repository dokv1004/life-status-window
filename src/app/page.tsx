'use client';

import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowUp } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-linear-to-b from-white to-blue-50">
        <div className="text-blue-600 text-xl animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-linear-to-b from-white to-blue-50 cursor-default select-none">
      {/* 타이틀 및 소개 영역 */}
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* 메인 타이틀 */}
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 tracking-tighter flex items-center justify-center gap-4 drop-shadow-sm">
          <span className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            ISEKAI
            <span className="hidden md:inline"> </span>
            STATUS!
          </span>
          <Sparkles
            className="text-yellow-400 animate-pulse hidden md:block"
            size={64}
          />
        </h1>

        {/* 서브 타이틀 */}
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
          평범한 일상을 <span className="text-blue-600 font-bold">RPG</span>처럼!
          <br />
          당신의{' '}
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md mx-1">
            스테이터스
          </span>
          를 깨워보세요.
        </p>

        {/* 로그인 유저 환영 메시지 */}
        {user && (
          <p className="text-gray-400 text-sm mt-4">
            환영합니다, <span className="text-blue-600 font-semibold">{user.displayName || user.email}</span>님!
          </p>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-16 flex flex-col items-center gap-2 text-gray-400 animate-bounce">
        <ArrowUp size={24} />
        <p className="text-sm font-medium">상단 메뉴를 눌러 시작하세요</p>
      </div>
    </main>
  );
}
