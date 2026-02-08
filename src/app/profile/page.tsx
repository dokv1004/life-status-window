'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, FriendRequest } from '@/types/user';
import { Copy, Check, UserPlus, Users, Bell, Pencil, X, LogOut } from 'lucide-react';
import PageLoading from '@/components/PageLoading';

// 랜덤 친구 코드 생성 함수
function generateFriendCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);
  const [addFriendError, setAddFriendError] = useState('');
  const [addFriendSuccess, setAddFriendSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        return;
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;

        // 친구 코드가 없으면 생성
        if (!userData.friendCode) {
          const newCode = generateFriendCode();
          await updateDoc(userRef, { friendCode: newCode });
          userData.friendCode = newCode;
        }

        // photoURL이 없으면 Firebase Auth에서 가져오기
        if (!userData.photoURL && firebaseUser.photoURL) {
          await updateDoc(userRef, { photoURL: firebaseUser.photoURL });
          userData.photoURL = firebaseUser.photoURL;
        }

        setUser(userData);
        setNicknameInput(userData.nickname);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleCopyCode = async () => {
    if (user?.friendCode) {
      await navigator.clipboard.writeText(user.friendCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddFriend = async () => {
    if (!friendCodeInput.trim() || !user) return;

    setAddingFriend(true);
    setAddFriendError('');
    setAddFriendSuccess('');

    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          friendCode: friendCodeInput.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddFriendError(data.error || '친구 요청에 실패했습니다.');
      } else {
        setAddFriendSuccess('친구 요청을 보냈습니다!');
        setFriendCodeInput('');
        // 유저 데이터 새로고침
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        }
      }
    } catch {
      setAddFriendError('오류가 발생했습니다.');
    } finally {
      setAddingFriend(false);
    }
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    if (!user) return;

    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          friendUid: request.uid,
        }),
      });

      if (res.ok) {
        // 유저 데이터 새로고침
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        }
      }
    } catch (error) {
      console.error('Accept friend error:', error);
    }
  };

  const handleRejectRequest = async (request: FriendRequest) => {
    if (!user) return;

    try {
      const res = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          friendUid: request.uid,
        }),
      });

      if (res.ok) {
        // 유저 데이터 새로고침
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        }
      }
    } catch (error) {
      console.error('Reject friend error:', error);
    }
  };

  const handleUpdateNickname = async () => {
    if (!user || !nicknameInput.trim()) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { nickname: nicknameInput.trim() });
      setUser({ ...user, nickname: nicknameInput.trim() });
      setIsEditingNickname(false);
    } catch (error) {
      console.error('Update nickname error:', error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <PageLoading message="프로필을 불러오는 중..." />;
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
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
            프로필
          </h1>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center gap-4">
            {/* 프로필 사진 */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {user.nickname.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* 닉네임 & 레벨 */}
            <div className="flex-1">
              {isEditingNickname ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={20}
                  />
                  <button
                    onClick={handleUpdateNickname}
                    className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingNickname(false);
                      setNicknameInput(user.nickname);
                    }}
                    className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-800">{user.nickname}</h2>
                  <button
                    onClick={() => setIsEditingNickname(true)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
              <p className="text-blue-600 font-semibold">Lv. {user.level}</p>
            </div>
          </div>

          {/* 친구 코드 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-2">내 친구 코드</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold tracking-widest text-blue-600">
                {user.friendCode}
              </span>
              <button
                onClick={handleCopyCode}
                className={`p-2 rounded-lg transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* 친구 추가 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-blue-500" />
            친구 추가
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={friendCodeInput}
              onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
              placeholder="친구 코드 입력"
              className="flex-1 min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
            <button
              onClick={handleAddFriend}
              disabled={addingFriend || friendCodeInput.length !== 6}
              className="shrink-0 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {addingFriend ? '...' : '추가'}
            </button>
          </div>
          {addFriendError && (
            <p className="mt-2 text-sm text-red-500">{addFriendError}</p>
          )}
          {addFriendSuccess && (
            <p className="mt-2 text-sm text-green-500">{addFriendSuccess}</p>
          )}
        </div>

        {/* 친구 목록 / 요청 탭 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'friends'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} />
              친구 ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
                activeTab === 'requests'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bell size={18} />
              요청
              {pendingRequests.length > 0 && (
                <span className="absolute top-2 right-1/4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-4 min-h-70">
            {activeTab === 'friends' ? (
              friends.length > 0 ? (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <div
                      key={friend.uid}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                        {friend.photoURL ? (
                          <img src={friend.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-white">
                            {friend.nickname.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{friend.nickname}</p>
                        <p className="text-sm text-blue-500">Lv. {friend.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <Users size={48} className="mx-auto mb-3 opacity-50" />
                  <p>아직 친구가 없어요</p>
                  <p className="text-sm">친구 코드를 공유해보세요!</p>
                </div>
              )
            ) : (
              <div className="space-y-4">
                {/* 받은 요청 */}
                {pendingRequests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">받은 요청</p>
                    <div className="space-y-2">
                      {pendingRequests.map((request) => (
                        <div
                          key={request.uid}
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl"
                        >
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {request.nickname.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{request.nickname}</p>
                            <p className="text-xs text-blue-500">Lv. {request.level}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptRequest(request)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                              수락
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request)}
                              className="px-3 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300"
                            >
                              거절
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 보낸 요청 */}
                {sentRequests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">보낸 요청</p>
                    <div className="space-y-2">
                      {sentRequests.map((request) => (
                        <div
                          key={request.uid}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {request.nickname.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{request.nickname}</p>
                            <p className="text-xs text-gray-500">대기 중...</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingRequests.length === 0 && sentRequests.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <Bell size={48} className="mx-auto mb-3 opacity-50" />
                    <p>친구 요청이 없어요</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
