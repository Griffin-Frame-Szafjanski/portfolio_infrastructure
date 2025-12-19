import { NextResponse } from 'next/server';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limiter';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, 'LOGIN');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get admin credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token using auth utility
    const token = generateToken({
      id: 1,
      username: ADMIN_USERNAME,
      email: 'admin@example.com',
    });

    // Set secure HttpOnly cookie
    await setAuthCookie(token);

    // Return success with rate limit headers
    return NextResponse.json(
      {
        success: true,
        user: {
          id: 1,
          username: ADMIN_USERNAME,
          email: 'admin@example.com',
        },
        message: 'Login successful',
      },
      {
        headers: rateLimitResult.headers,
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
