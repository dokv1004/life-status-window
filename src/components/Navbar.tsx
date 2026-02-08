'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChartNoAxesCombined, UserCircle, LogIn, LogOut, LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type NavItemData = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItemData[] = [
  { name: '상태창', href: '/dashboard', icon: ChartNoAxesCombined },
  { name: '프로필', href: '/profile', icon: UserCircle },
];

// 데스크톱 네비 아이템
function NavItem({ item, isActive }: { item: NavItemData; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
        ${
          isActive
            ? 'bg-blue-100 text-blue-600'
            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
        }
      `}
    >
      <item.icon size={18} />
      {item.name}
    </Link>
  );
}

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

  if (loading) return null;

  return (
    <>
      {/* Desktop Navbar - Top Fixed */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md h-16">
        <div className="flex items-center justify-between px-6 h-full max-w-7xl mx-auto relative">
          {/* 로고 */}
          <Link
            href="/"
            className="text-xl font-black italic tracking-tighter text-blue-600 hover:opacity-80 transition-opacity"
          >
            ISEKAI STATUS!
          </Link>

          {/* 중앙 메뉴 */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          {/* 우측: 유저 정보 / 로그인 */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-gray-500 text-sm hidden lg:block">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="로그아웃"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 h-16 md:hidden pb-safe">
        <div className="flex justify-around items-center h-full px-2 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex-1 flex flex-col items-center justify-center py-2 mx-1 rounded-xl transition-colors duration-200
                  ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
              </Link>
            );
          })}

          {/* 모바일 로그인/로그아웃 버튼 */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex-1 flex flex-col items-center justify-center py-2 mx-1 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut size={24} strokeWidth={2} />
              <span className="text-[10px] font-medium mt-0.5">로그아웃</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex-1 flex flex-col items-center justify-center py-2 mx-1 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <LogIn size={24} strokeWidth={2} />
              <span className="text-[10px] font-medium mt-0.5">로그인</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Spacer for desktop */}
      <div className="hidden md:block h-16" />

      {/* Spacer for mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
