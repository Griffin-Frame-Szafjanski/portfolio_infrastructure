import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getProjects, createProject } from '@/lib/db';

export async function GET() {
  try {
    // Get projects from database
    const projects = await getProjects();
    
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Projects API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Create a new project
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

    const body = await request.json();
    const {
      title,
      description,
      long_description,
      technologies,
      project_url,
      github_url,
      image_url,
      video_url,
      pdf_url,
      pdf_file_key,
      display_order,
      featured
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create project in database
    const newProject = await createProject({
      title,
      description,
      long_description: long_description || null,
      technologies: technologies || '',
      tech_stack: technologies || '',
      project_url: project_url || null,
      github_url: github_url || null,
      image_url: image_url || null,
      video_url: video_url || null,
      pdf_url: pdf_url || null,
      pdf_file_key: pdf_file_key || null,
      display_order: display_order || 0,
      featured: featured || false
    });

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
