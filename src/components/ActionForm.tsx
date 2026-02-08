'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';

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

interface ActionFormProps {
  uid: string;
  onResult: (result: ApiResponse) => void;
}

export default function ActionForm({ uid, onResult }: ActionFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

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
        onResult(data);
        setContent('');
      }
    } catch (error) {
      console.error('Failed to submit action:', error);
      alert('행동 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-purple-50 to-blue-50">
        <h3 className="text-lg font-bold text-gray-800">수련 기록</h3>
        <p className="text-gray-500 text-sm mt-1">
          오늘 한 행동을 기록하면 AI가 스탯으로 변환해드려요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="예: 헬스장에서 1시간 운동했다&#10;예: 알고리즘 문제 3개를 풀었다&#10;예: 8시간 푹 잤다"
          className="w-full h-32 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full mt-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              수련 보고하기
            </>
          )}
        </button>
      </form>

      {/* 로딩 상태 */}
      {loading && (
        <div className="px-6 pb-6">
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
            <p className="text-purple-600 text-sm animate-pulse">
              AI가 행동을 분석하고 있어요...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
