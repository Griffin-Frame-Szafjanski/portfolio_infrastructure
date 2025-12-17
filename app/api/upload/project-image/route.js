import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

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

    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      return NextResponse.json(
        { success: false, error: 'Storage not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.' },
        { status: 500 }
      );
    }

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
        { success: false, error: 'Invalid file type. Please upload a valid image (JPEG, PNG, WebP, or GIF)' },
        { status: 400 }
      );
    }

    // Validate file size (3MB max for images - Vercel limit is 4.5MB)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 3MB. Please compress your image or use a smaller file.' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(`project-images/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileKey: blob.url, // For potential future deletion
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to upload image: ${error.message}` },
      { status: 500 }
    );
  }
}
