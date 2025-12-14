import { NextResponse } from 'next/server';
import {
  verifyPassword,
  generateToken,
  setAuthCookie,
  isAccountLocked,
  calculateLockoutTime,
  maxAttemptsReached,
  sanitizeUser,
} from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // For local development, use mock data
    // In production with Cloudflare D1, this would query the database
    const mockUser = {
      id: 1,
      username: 'admin',
      password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYWv.oTtIpm', // 'admin123'
      email: 'admin@example.com',
      failed_login_attempts: 0,
      locked_until: null,
    };

    // In production, query the database:
    // const user = await db.prepare('SELECT * FROM admin_users WHERE username = ?').bind(username).first();

    const user = username === 'admin' ? mockUser : null;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (isAccountLocked(user)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account is temporarily locked due to too many failed attempts. Please try again later.',
        },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      // Increment failed attempts
      const newAttempts = user.failed_login_attempts + 1;
      
      // In production, update database:
      // await db.prepare('UPDATE admin_users SET failed_login_attempts = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      //   .bind(newAttempts, user.id).run();

      // Lock account if max attempts reached
      if (maxAttemptsReached(newAttempts)) {
        const lockoutTime = calculateLockoutTime();
        // In production:
        // await db.prepare('UPDATE admin_users SET locked_until = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        //   .bind(lockoutTime.toISOString(), user.id).run();

        return NextResponse.json(
          {
            success: false,
            error: 'Too many failed login attempts. Account has been locked for 15 minutes.',
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          attemptsRemaining: 5 - newAttempts,
        },
        { status: 401 }
      );
    }

    // Successful login - reset failed attempts and update last login
    // In production:
    // await db.prepare('UPDATE admin_users SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    //   .bind(user.id).run();

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    // Set secure HttpOnly cookie
    await setAuthCookie(token);

    // Return sanitized user data
    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
