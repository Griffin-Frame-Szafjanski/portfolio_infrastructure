import { NextResponse } from 'next/server';
import { requireAuth, hashPassword } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limiter';
import { logPasswordChange } from '@/lib/audit-logger';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, 'PASSWORD_CHANGE');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // Check authentication
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get current admin password from environment
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, ADMIN_PASSWORD);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Generate new password hash
    const newPasswordHash = await hashPassword(newPassword);

    // Log password change
    await logPasswordChange(user, request);

    // Return the new hash that needs to be set in environment variables
    return NextResponse.json({
      success: true,
      message: 'Password hash generated successfully',
      newPasswordHash: newPasswordHash,
      instructions: [
        '1. Copy the newPasswordHash value below',
        '2. Update your environment variable ADMIN_PASSWORD with this hash',
        '3. In Vercel: Settings → Environment Variables → Edit ADMIN_PASSWORD',
        '4. In local .env.local: Update ADMIN_PASSWORD=<new hash>',
        '5. Redeploy your application for changes to take effect',
      ],
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while changing password' },
      { status: 500 }
    );
  }
}
