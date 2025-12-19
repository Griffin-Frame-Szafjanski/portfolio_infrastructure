import { NextResponse } from 'next/server';
import { getSkillWithProjects, updateSkill, deleteSkill, getSkillById } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { logResourceUpdate, logResourceDeletion } from '@/lib/audit-logger';

// GET single skill with related projects
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const skill = await getSkillWithProjects(id);

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

// PUT update skill (Admin only)
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, category_id, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }

    const skill = await updateSkill(id, { name, category_id, display_order });

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Log the update
    await logResourceUpdate({
      user: authResult.user,
      resourceType: 'skill',
      resourceId: String(id),
      details: { name: skill.name, changes: body }
    }, request);

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    
    // Handle unique constraint violation
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json(
        { error: 'A skill with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE skill (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Check if skill exists
    const skill = await getSkillById(id);
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // The project_skills relationships will be deleted automatically (CASCADE)
    await deleteSkill(id);

    // Log the deletion
    await logResourceDeletion({
      user: authResult.user,
      resourceType: 'skill',
      resourceId: String(id),
      details: { name: skill.name }
    }, request);

    return NextResponse.json({ 
      message: 'Skill deleted successfully',
      skill
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
