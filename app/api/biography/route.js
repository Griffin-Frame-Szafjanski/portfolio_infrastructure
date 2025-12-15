import { NextResponse } from 'next/server';
import { getBiography } from '@/lib/mockDb';

export async function GET() {
  try {
    // Get biography from mock database (persists during dev server session)
    const biography = getBiography();
    
    return NextResponse.json({
      success: true,
      data: biography
    });
  } catch (error) {
    console.error('Biography API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
