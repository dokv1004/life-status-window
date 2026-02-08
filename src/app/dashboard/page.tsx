'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';
import StatusPanel from '@/components/StatusPanel';
import ActionForm from '@/components/ActionForm';
import ResultModal from '@/components/ResultModal';

interface ApiResponse {
  success: boolean;
  result: {
    stats: { STR: number; INT: number; VIT: number; DEX: number; LUK: number };
    comment: string;
  };
  stats: { STR: number; INT: number; VIT: number; DEX: number; LUK: number };
  level: number;
  exp: number;
  leveledUp: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        return;
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      } else {
        const defaultUser: User = {
          uid: firebaseUser.uid,
          nickname: firebaseUser.displayName || 'Adventurer',
          level: 1,
          exp: 0,
          stats: {
            STR: 10,
            INT: 10,
            VIT: 10,
            DEX: 10,
            LUK: 10,
          },
        };
        await setDoc(userRef, defaultUser);
        setUser(defaultUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleActionResult = (data: ApiResponse) => {
    setResult(data);
    setShowResult(true);
    // 유저 데이터 업데이트
    if (user) {
      setUser({
        ...user,
        stats: data.stats,
        level: data.level,
        exp: data.exp,
      });
    }
  };

  const handleCloseModal = () => {
    setShowResult(false);
    setResult(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen md:min-h-[calc(100vh-4rem)] bg-linear-to-b from-white to-blue-50 flex items-center justify-center p-4 pb-20 md:pb-4">
        <div className="text-blue-600 text-xl animate-pulse">상태창을 불러오는 중...</div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen md:min-h-[calc(100vh-4rem)] bg-linear-to-b from-white to-blue-50 py-6 md:py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
            상태창
          </h1>
          <p className="text-gray-500 mt-2">당신의 성장을 확인하세요</p>
        </div>

        {/* 2열 그리드: 상태창 + 수련 폼 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 왼쪽: 상태 패널 */}
          <StatusPanel user={user} />

          {/* 오른쪽: 수련 폼 */}
          <ActionForm uid={user.uid} onResult={handleActionResult} />
        </div>
      </div>

      {/* 결과 모달 */}
      {showResult && result && (
        <ResultModal result={result} onClose={handleCloseModal} />
      )}
    </main>
  );
}
