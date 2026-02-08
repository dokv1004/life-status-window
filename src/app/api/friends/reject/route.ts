import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const { uid, friendUid } = await request.json();

    if (!uid || !friendUid) {
      return NextResponse.json(
        { error: 'UID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 내 정보 가져오기
    const myRef = doc(db, 'users', uid);
    const mySnap = await getDoc(myRef);

    if (!mySnap.exists()) {
      return NextResponse.json(
        { error: '유저를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상대방 정보 가져오기
    const friendRef = doc(db, 'users', friendUid);
    const friendSnap = await getDoc(friendRef);

    if (!friendSnap.exists()) {
      return NextResponse.json(
        { error: '상대방을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const myData = mySnap.data() as User;
    const friendData = friendSnap.data() as User;

    // 받은 요청 목록에서 해당 요청 제거
    const myReceivedRequests = myData.friendRequestsReceived || [];
    const updatedReceivedRequests = myReceivedRequests.filter(r => r.uid !== friendUid);

    // 상대방의 보낸 요청 목록에서 제거
    const friendSentRequests = friendData.friendRequestsSent || [];
    const updatedFriendSentRequests = friendSentRequests.filter(r => r.uid !== uid);

    // 내 정보 업데이트
    await updateDoc(myRef, {
      friendRequestsReceived: updatedReceivedRequests,
    });

    // 상대방 정보 업데이트
    await updateDoc(friendRef, {
      friendRequestsSent: updatedFriendSentRequests,
    });

    return NextResponse.json({
      success: true,
      message: '친구 요청을 거절했습니다.',
    });
  } catch (error) {
    console.error('Reject friend error:', error);
    return NextResponse.json(
      { error: '친구 요청 거절 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
