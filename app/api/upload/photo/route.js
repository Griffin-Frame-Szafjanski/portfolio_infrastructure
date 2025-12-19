import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { logFileUpload } from '@/lib/audit-logger';

export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (4MB max)
    // Note: Vercel free tier has a 4.5MB request body limit
    // We set it to 4MB to account for form data overhead
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 4MB (Vercel free tier limit).' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `profile-photo-${timestamp}-${randomStr}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Log the file upload
    await logFileUpload({
      user: authResult.user,
      filename: filename,
      fileType: file.type,
      fileSize: file.size
    }, request);

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
