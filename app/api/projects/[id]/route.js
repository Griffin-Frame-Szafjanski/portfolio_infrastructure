import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { updateProject, deleteProject, setProjectSkills, getProjectById } from '@/lib/db';
import { logResourceUpdate, logResourceDeletion } from '@/lib/audit-logger';
import { cleanupReplacedBlobs } from '@/lib/blob-cleanup';

// PUT - Update a project
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

    // Get current project for blob cleanup
    const oldProject = await getProjectById(id);
    if (!oldProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update project in database
    const updatedProject = await updateProject(id, {
      title,
      description,
      long_description: long_description || null,
      project_url: project_url || null,
      github_url: github_url || null,
      image_url: image_url || null,
      display_order: display_order || 0,
      featured: featured || false
    });

    // Update project skills
    if (skill_ids !== undefined && Array.isArray(skill_ids)) {
      await setProjectSkills(id, skill_ids);
    }

    // Cleanup old blob files if image URL was replaced
    await cleanupReplacedBlobs(oldProject, body, ['image_url']);

    // Log the update
    await logResourceUpdate({
      user: authResult.user,
      resourceType: 'project',
      resourceId: String(id),
      details: { title: updatedProject.title, changes: body }
    }, request);

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
export async function DELETE(request, { params }) {
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

    // Delete project from database
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Log the deletion
    await logResourceDeletion({
      user: authResult.user,
      resourceType: 'project',
      resourceId: String(id),
      details: { title: deleted.title }
    }, request);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
      data: {
        id,
        deleted_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
