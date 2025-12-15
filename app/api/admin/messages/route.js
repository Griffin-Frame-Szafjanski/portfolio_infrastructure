import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getMessages, getUnreadMessageCount } from '@/lib/db';

// GET - Get all messages (admin only)
export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const messages = await getMessages();
    const unreadCount = await getUnreadMessageCount();

    return NextResponse.json({
      success: true,
      data: messages,
      unreadCount
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
