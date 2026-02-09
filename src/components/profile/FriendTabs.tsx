'use client';

import { useState } from 'react';
import { Users, Bell } from 'lucide-react';
import { Friend, FriendRequest } from '@/types/user';

interface FriendTabsProps {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  uid: string;
  onRequestHandled: () => void;
}

export default function FriendTabs({
  friends,
  pendingRequests,
  sentRequests,
  uid,
  onRequestHandled,
}: FriendTabsProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  const handleAcceptRequest = async (request: FriendRequest) => {
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, friendUid: request.uid }),
      });

      if (res.ok) {
        onRequestHandled();
      }
    } catch (error) {
      console.error('Accept friend error:', error);
    }
  };

  const handleRejectRequest = async (request: FriendRequest) => {
    try {
      const res = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, friendUid: request.uid }),
      });

      if (res.ok) {
        onRequestHandled();
      }
    } catch (error) {
      console.error('Reject friend error:', error);
    }
  };

  return (
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
          <FriendList friends={friends} />
        ) : (
          <RequestList
            pendingRequests={pendingRequests}
            sentRequests={sentRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        )}
      </div>
    </div>
  );
}

function FriendList({ friends }: { friends: Friend[] }) {
  if (friends.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <Users size={48} className="mx-auto mb-3 opacity-50" />
        <p>아직 친구가 없어요</p>
        <p className="text-sm">친구 코드를 공유해보세요!</p>
      </div>
    );
  }

  return (
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
  );
}

function RequestList({
  pendingRequests,
  sentRequests,
  onAccept,
  onReject,
}: {
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  onAccept: (request: FriendRequest) => void;
  onReject: (request: FriendRequest) => void;
}) {
  if (pendingRequests.length === 0 && sentRequests.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <Bell size={48} className="mx-auto mb-3 opacity-50" />
        <p>친구 요청이 없어요</p>
      </div>
    );
  }

  return (
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
                    onClick={() => onAccept(request)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => onReject(request)}
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
    </div>
  );
}
