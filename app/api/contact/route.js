import { NextResponse } from 'next/server';
import { createMessage } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limiter';

// POST - Submit contact form
export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, 'CONTACT');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create message in database
    const newMessage = await createMessage({
      name,
      email,
      subject,
      message
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.',
        data: {
          id: newMessage.id,
          created_at: newMessage.created_at
        }
      },
      { 
        status: 201,
        headers: rateLimitResult.headers,
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while sending your message' },
      { status: 500 }
    );
  }
}
