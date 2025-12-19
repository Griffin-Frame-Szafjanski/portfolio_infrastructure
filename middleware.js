/**
 * Next.js Middleware
 * Applies security headers to all responses
 */

import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the response
  const response = NextResponse.next();
  
  // Security Headers
  const headers = response.headers;
  
  // Content Security Policy - Strict policy to prevent XSS
  // Adjust based on your needs (e.g., if you use external scripts/styles)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // 'unsafe-eval' needed for Next.js dev
    "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for Next.js
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://vercel.live https://*.vercel.app",
    "media-src 'self' https: blob:",
    "frame-src 'self' https://*.public.blob.vercel-storage.com", // Allow PDFs from Vercel Blob Storage
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  headers.set('Content-Security-Policy', cspDirectives);
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection (legacy, but still good to have)
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy - Control information sent in Referer header
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy - Restrict browser features
  const permissionsPolicy = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()', // Disable FLoC
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', ');
  
  headers.set('Permissions-Policy', permissionsPolicy);
  
  // HTTP Strict Transport Security (HSTS) - Only in production
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Remove potentially revealing headers
  headers.delete('X-Powered-By');
  
  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
