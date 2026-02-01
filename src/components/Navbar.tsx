'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutDashboard, Swords, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/dashboard', label: '상태창', icon: LayoutDashboard },
    { path: '/action', label: '수련', icon: Swords },
  ];

  if (loading) return null;

  // Don't show navbar on login page
  if (pathname === '/login') return null;

  return (
    <>
      {/* Desktop Navbar - Top Fixed */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-xl font-bold text-cyan-400 glow-cyan hover:text-cyan-300 transition-colors"
              >
                이세계 상태창
              </button>
            </div>

            {/* Center Menu */}
            <div className="flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      active
                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Profile / Logout */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-slate-300 text-sm">{user.displayName || user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Bottom Fixed */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-cyan-500/20">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all nav-transition ${
                  active
                    ? 'text-cyan-400 scale-110'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'glow-cyan' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Spacer for desktop */}
      <div className="hidden md:block h-16" />

      {/* Spacer for mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
