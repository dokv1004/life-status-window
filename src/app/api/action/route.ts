import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { evaluateAction } from '@/lib/gemini';
import { User } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const { content, uid } = await request.json();

    if (!content || !uid) {
      return NextResponse.json(
        { error: 'Content and UID are required' },
        { status: 400 }
      );
    }

    // Evaluate action with Gemini AI
    const result = await evaluateAction(content);

    // Update user stats in Firestore
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate total exp gain
    const totalExpGain = Math.abs(result.stats.STR) +
                         Math.abs(result.stats.INT) +
                         Math.abs(result.stats.VIT) +
                         Math.abs(result.stats.DEX) +
                         Math.abs(result.stats.LUK);

    const currentUser = userSnap.data() as User;

    // Update stats using increment
    await updateDoc(userRef, {
      'stats.STR': increment(result.stats.STR),
      'stats.INT': increment(result.stats.INT),
      'stats.VIT': increment(result.stats.VIT),
      'stats.DEX': increment(result.stats.DEX),
      'stats.LUK': increment(result.stats.LUK),
      exp: increment(totalExpGain),
    });

    // Get updated user data
    const updatedUserSnap = await getDoc(userRef);
    const updatedUser = updatedUserSnap.data() as User;

    // Level up system: Required EXP = Current Level * 100
    let leveledUp = false;
    let currentExp = updatedUser.exp;
    let currentLevel = updatedUser.level;

    while (currentExp >= currentLevel * 100) {
      currentExp -= currentLevel * 100;
      currentLevel += 1;
      leveledUp = true;
    }

    if (leveledUp) {
      await updateDoc(userRef, {
        level: currentLevel,
        exp: currentExp
      });
      updatedUser.level = currentLevel;
      updatedUser.exp = currentExp;
    }

    // Log activity
    await addDoc(collection(db, 'activities'), {
      uid,
      content,
      result: result.stats,
      comment: result.comment,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      result,
      stats: updatedUser.stats,
      level: updatedUser.level,
      exp: updatedUser.exp,
      leveledUp,
    });
  } catch (error) {
    console.error('Action evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate action' },
      { status: 500 }
    );
  }
}
