import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { updateBiography } from '@/lib/mockDb';

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

    // Update biography in mock database
    const updatedBio = updateBiography({
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
