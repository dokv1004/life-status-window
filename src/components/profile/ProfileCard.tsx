'use client';

import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';
import { Copy, Check, Pencil, X } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export default function ProfileCard({ user, onUserUpdate }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user.nickname);

  const handleCopyCode = async () => {
    if (user.friendCode) {
      await navigator.clipboard.writeText(user.friendCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpdateNickname = async () => {
    if (!nicknameInput.trim()) return;

    const newNickname = nicknameInput.trim();

    try {
      // 1. Firestore 유저 문서 업데이트
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { nickname: newNickname });

      // 2. Firebase Auth displayName 업데이트
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newNickname });
      }

      // 3. 친구들의 friends 배열에서 내 닉네임 업데이트
      const friends = user.friends || [];
      const updatePromises = friends.map(async (friend) => {
        const friendRef = doc(db, 'users', friend.uid);
        const friendSnap = await getDoc(friendRef);
        if (friendSnap.exists()) {
          const friendData = friendSnap.data();
          const friendFriends = friendData.friends || [];
          const updatedFriends = friendFriends.map((f: { uid: string; nickname: string }) =>
            f.uid === user.uid ? { ...f, nickname: newNickname } : f
          );
          await updateDoc(friendRef, { friends: updatedFriends });
        }
      });
      await Promise.all(updatePromises);

      onUserUpdate({ ...user, nickname: newNickname });
      setIsEditingNickname(false);
    } catch (error) {
      console.error('Update nickname error:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingNickname(false);
    setNicknameInput(user.nickname);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
      <div className="flex items-center gap-4">
        {/* 프로필 사진 */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt="프로필 사진" className="w-full h-full object-cover" />
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
                onClick={handleCancelEdit}
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
  );
}
