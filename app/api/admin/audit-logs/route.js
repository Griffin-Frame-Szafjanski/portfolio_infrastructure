import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limiter';
import { getAuditLogs, getAuditLogCount } from '@/lib/db';
import { handleError, createAuthError } from '@/lib/error-handler';

// GET - Fetch audit logs (admin only)
export async function GET(request) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, 'API');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // Check authentication
    const user = await requireAuth();
    if (!user) {
      throw createAuthError('Authentication required');
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000); // Max 1000
    const offset = parseInt(searchParams.get('offset') || '0');
    const eventType = searchParams.get('eventType') || null;
    const severity = searchParams.get('severity') || null;
    const username = searchParams.get('username') || null;

    // Fetch logs and count
    const [logs, total] = await Promise.all([
      getAuditLogs({ limit, offset, eventType, severity, username }),
      getAuditLogCount({ eventType, severity, username })
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          logs,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          },
          filters: {
            eventType,
            severity,
            username
          }
        }
      },
      {
        headers: rateLimitResult.headers,
      }
    );

  } catch (error) {
    return handleError(error, {
      method: request.method,
      url: request.url,
      user: 'admin'
    });
  }
}
