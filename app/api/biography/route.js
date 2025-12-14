import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For local development, return mock data
    // When deployed to Cloudflare Pages, the functions/api/biography.js will take precedence
    return NextResponse.json({
      success: true,
      data: {
        full_name: "Your Name",
        title: "Full-Stack Developer",
        bio: "Passionate developer with experience in building scalable web applications.",
        email: "your.email@example.com",
        phone: "+1234567890",
        linkedin_url: "https://linkedin.com/in/yourprofile",
        github_url: "https://github.com/yourusername",
        location: "City, Country"
      }
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
