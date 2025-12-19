import { NextResponse } from 'next/server';
import { clearAuthCookie, getAuthUser } from '@/lib/auth';
import { logLogout } from '@/lib/audit-logger';

export async function POST(request) {
  try {
    // Get user before clearing cookie
    const user = await getAuthUser();
    
    // Clear the authentication cookie
    await clearAuthCookie();

    // Log logout if user was authenticated
    if (user) {
      await logLogout(user, request);
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
