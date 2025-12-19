import { NextResponse } from 'next/server';
import { createMessage } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limiter';
import { validateContactForm } from '@/lib/validation';
import { isPrototypePollutionSafe } from '@/lib/sanitize';

// POST - Submit contact form
export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, 'CONTACT');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const body = await request.json();
    
    // Check for prototype pollution
    if (!isPrototypePollutionSafe(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Validate and sanitize input
    const validation = validateContactForm(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] || 'Invalid input' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

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
