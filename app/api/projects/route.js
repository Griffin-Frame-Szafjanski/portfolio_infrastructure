import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getProjectsWithSkillCount, getProjectsBySkills, createProject, setProjectSkills } from '@/lib/db';
import { logResourceCreation } from '@/lib/audit-logger';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillIdsParam = searchParams.get('skills');
    
    let projects;
    
    if (skillIdsParam) {
      // Parse skill IDs from query string (comma-separated)
      const skillIds = skillIdsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      
      if (skillIds.length > 0) {
        projects = await getProjectsBySkills(skillIds);
      } else {
        projects = await getProjectsWithSkillCount();
      }
    } else {
      // Get all projects with skill count
      projects = await getProjectsWithSkillCount();
    }
    
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
      skill_ids,
      project_url,
      github_url,
      image_url,
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
      project_url: project_url || null,
      github_url: github_url || null,
      image_url: image_url || null,
      display_order: display_order || 0,
      featured: featured || false
    });

    // Set project skills
    if (skill_ids && Array.isArray(skill_ids) && skill_ids.length > 0) {
      await setProjectSkills(newProject.id, skill_ids);
    }

    // Log project creation
    await logResourceCreation({
      user: authResult.user,
      resourceType: 'project',
      resourceId: String(newProject.id),
      details: { title: newProject.title, featured: newProject.featured }
    }, request);

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
