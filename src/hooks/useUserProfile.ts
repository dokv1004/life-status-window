'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';
import { generateFriendCode } from '@/lib/utils';

export function useUserProfile() {
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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const refreshUser = useCallback(async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUser(userSnap.data() as User);
    }
  }, [user]);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  }, [user]);

  return { user, loading, refreshUser, updateUser, setUser };
}
