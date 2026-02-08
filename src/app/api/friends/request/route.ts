import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, FriendRequest } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const { uid, friendCode } = await request.json();

    if (!uid || !friendCode) {
      return NextResponse.json(
        { error: 'UID와 친구 코드가 필요합니다.' },
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

    const myData = mySnap.data() as User;

    // 자기 자신에게 친구 요청 불가
    if (myData.friendCode === friendCode) {
      return NextResponse.json(
        { error: '자기 자신에게는 친구 요청을 보낼 수 없습니다.' },
        { status: 400 }
      );
    }

    // 친구 코드로 상대방 찾기
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('friendCode', '==', friendCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: '해당 코드의 유저를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const friendDoc = querySnapshot.docs[0];
    const friendData = friendDoc.data() as User;
    const friendRef = doc(db, 'users', friendDoc.id);

    // 이미 친구인지 확인
    const myFriends = myData.friends || [];
    if (myFriends.some(f => f.uid === friendDoc.id)) {
      return NextResponse.json(
        { error: '이미 친구입니다.' },
        { status: 400 }
      );
    }

    // 이미 요청을 보냈는지 확인
    const mySentRequests = myData.friendRequestsSent || [];
    if (mySentRequests.some(r => r.uid === friendDoc.id)) {
      return NextResponse.json(
        { error: '이미 친구 요청을 보냈습니다.' },
        { status: 400 }
      );
    }

    // 상대방이 나에게 이미 요청을 보냈는지 확인 (이 경우 바로 친구 추가)
    const myReceivedRequests = myData.friendRequestsReceived || [];
    if (myReceivedRequests.some(r => r.uid === friendDoc.id)) {
      return NextResponse.json(
        { error: '상대방이 이미 친구 요청을 보냈습니다. 요청 탭에서 수락해주세요.' },
        { status: 400 }
      );
    }

    // 친구 요청 생성
    const myRequest: FriendRequest = {
      uid: friendDoc.id,
      nickname: friendData.nickname,
      level: friendData.level,
      photoURL: friendData.photoURL,
      sentAt: Date.now(),
    };

    const theirRequest: FriendRequest = {
      uid: uid,
      nickname: myData.nickname,
      level: myData.level,
      photoURL: myData.photoURL,
      sentAt: Date.now(),
    };

    // 내 보낸 요청에 추가
    await updateDoc(myRef, {
      friendRequestsSent: arrayUnion(myRequest),
    });

    // 상대방 받은 요청에 추가
    await updateDoc(friendRef, {
      friendRequestsReceived: arrayUnion(theirRequest),
    });

    return NextResponse.json({
      success: true,
      message: '친구 요청을 보냈습니다.',
    });
  } catch (error) {
    console.error('Friend request error:', error);
    return NextResponse.json(
      { error: '친구 요청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
