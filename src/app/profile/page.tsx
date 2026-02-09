'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { LogOut } from 'lucide-react';
import ProfileSkeleton from '@/components/ProfileSkeleton';
import ProfileCard from '@/components/profile/ProfileCard';
import AddFriendForm from '@/components/profile/AddFriendForm';
import FriendTabs from '@/components/profile/FriendTabs';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUser, setUser } = useUserProfile();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) return null;

  const pendingRequests = user.friendRequestsReceived || [];
  const sentRequests = user.friendRequestsSent || [];
  const friends = user.friends || [];

  return (
    <main className="min-h-screen md:min-h-[calc(100vh-4rem)] bg-linear-to-b from-white to-blue-50 py-6 md:py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-blue-700">
            프로필
          </h1>
        </div>

        {/* 프로필 카드 */}
        <ProfileCard user={user} onUserUpdate={setUser} />

        {/* 친구 추가 */}
        <AddFriendForm uid={user.uid} onSuccess={refreshUser} />

        {/* 친구 목록 / 요청 탭 */}
        <FriendTabs
          friends={friends}
          pendingRequests={pendingRequests}
          sentRequests={sentRequests}
          uid={user.uid}
          onRequestHandled={refreshUser}
        />

        {/* 모바일 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="md:hidden w-full py-3 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          로그아웃
        </button>
      </div>
    </main>
  );
}
