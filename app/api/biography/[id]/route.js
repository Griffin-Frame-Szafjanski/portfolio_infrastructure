import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { updateBiography, getBiography } from '@/lib/db';
import { logResourceUpdate } from '@/lib/audit-logger';
import { cleanupReplacedBlobs } from '@/lib/blob-cleanup';

// PUT - Update biography
export async function PUT(request, { params }) {
  try {
    // Await params in Next.js 15
    const { id } = await params;
    
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      full_name,
      title,
      bio,
      email,
      phone,
      location,
      linkedin_url,
      github_url,
      resume_url,
      resume_pdf_url,
      profile_photo_url
    } = body;

    // Get current biography for blob cleanup
    const oldBio = await getBiography();

    // Update biography in database
    const updatedBio = await updateBiography({
      full_name,
      title,
      bio,
      email,
      phone,
      location,
      linkedin_url,
      github_url,
      resume_url,
      resume_pdf_url,
      profile_photo_url
    });

    // Cleanup old blob files if URLs were replaced
    await cleanupReplacedBlobs(oldBio, body, [
      'profile_photo_url',
      'resume_pdf_url'
    ]);

    // Log the update
    await logResourceUpdate({
      user: authResult.user,
      resourceType: 'biography',
      resourceId: String(id),
      details: { full_name: updatedBio.full_name, changes: body }
    }, request);

    return NextResponse.json({
      success: true,
      message: 'Biography updated successfully',
      data: updatedBio
    });

  } catch (error) {
    console.error('Update biography error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
