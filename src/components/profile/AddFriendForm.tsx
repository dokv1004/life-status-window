'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface AddFriendFormProps {
  uid: string;
  onSuccess: () => void;
}

export default function AddFriendForm({ uid, onSuccess }: AddFriendFormProps) {
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddFriend = async () => {
    if (!friendCodeInput.trim()) return;

    setAddingFriend(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          friendCode: friendCodeInput.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '친구 요청에 실패했습니다.');
      } else {
        setSuccess('친구 요청을 보냈습니다!');
        setFriendCodeInput('');
        onSuccess();
      }
    } catch {
      setError('오류가 발생했습니다.');
    } finally {
      setAddingFriend(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <UserPlus size={20} className="text-blue-500" />
        친구 추가
      </h3>
      <div className="flex gap-2 overflow-hidden">
        <input
          type="text"
          value={friendCodeInput}
          onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
          placeholder="친구 코드 입력"
          className="flex-1 min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-base uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-500">{success}</p>}
    </div>
  );
}
