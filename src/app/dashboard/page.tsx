'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';
import StatusChart from '@/components/StatusChart';
import { Flame, Brain, Heart, Zap, Sparkles, LogOut, Swords } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 glow-cyan text-xl animate-pulse">Loading your status...</div>
      </div>
    );
  }

  if (!user) return null;

  // Calculate EXP percentage based on current level requirement
  const requiredExp = user.level * 100;
  const expPercentage = (user.exp / requiredExp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-cyan-900/50 to-purple-900/50 p-4 md:p-6 border-b border-cyan-500/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 glow-gold mb-1">
                  {user.nickname}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 text-sm">Level</span>
                  <span className="text-yellow-400 glow-gold font-bold text-xl">{user.level}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 min-h-11 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/30"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
            </div>

            {/* EXP Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>EXP</span>
                <span>{user.exp} / {requiredExp}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden border border-cyan-500/30">
                <div
                  className="bg-linear-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
                  style={{ width: `${Math.min(expPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Status Chart */}
          <div className="p-4 md:p-6 bg-slate-900/30">
            <h2 className="text-lg font-bold text-cyan-400 glow-cyan mb-4 text-center">
              STATUS CHART
            </h2>
            <div className="w-full">
              <StatusChart stats={user.stats} />
            </div>
          </div>

          {/* Stats List */}
          <div className="p-4 md:p-6 space-y-3 bg-slate-800/30">
            <h2 className="text-lg font-bold text-cyan-400 glow-cyan mb-4">
              STATS
            </h2>

            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-red-500/20 min-h-11">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-red-400" />
                <span className="text-slate-200 font-medium">STR</span>
              </div>
              <span className="text-white font-bold text-lg">{user.stats.STR}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-blue-500/20 min-h-11">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-slate-200 font-medium">INT</span>
              </div>
              <span className="text-white font-bold text-lg">{user.stats.INT}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-green-500/20 min-h-11">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-green-400" />
                <span className="text-slate-200 font-medium">VIT</span>
              </div>
              <span className="text-white font-bold text-lg">{user.stats.VIT}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-yellow-500/20 min-h-11">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-200 font-medium">DEX</span>
              </div>
              <span className="text-white font-bold text-lg">{user.stats.DEX}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-purple-500/20 min-h-11">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-slate-200 font-medium">LUK</span>
              </div>
              <span className="text-white font-bold text-lg">{user.stats.LUK}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 md:p-6 pt-0 bg-slate-800/30">
            <button
              onClick={() => router.push('/action')}
              className="w-full py-3 min-h-11 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg shadow-lg shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Swords className="w-5 h-5" />
              수련하러 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
