import { NextResponse } from 'next/server';
import { getBiography } from '@/lib/db';

export async function GET() {
  try {
    // Get biography from Neon database
    const biography = await getBiography();
    
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
