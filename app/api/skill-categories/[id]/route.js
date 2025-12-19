import { NextResponse } from 'next/server';
import { getSkillCategoryById, updateSkillCategory, deleteSkillCategory } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { logResourceUpdate, logResourceDeletion } from '@/lib/audit-logger';

// GET single skill category
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const category = await getSkillCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching skill category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill category' },
      { status: 500 }
    );
  }
}

// PUT update skill category (Admin only)
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await updateSkillCategory(id, { name, description, display_order });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Log the update
    await logResourceUpdate({
      user: authResult.user,
      resourceType: 'skill_category',
      resourceId: String(id),
      details: { name: category.name, changes: body }
    }, request);

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating skill category:', error);
    
    // Handle unique constraint violation
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update skill category' },
      { status: 500 }
    );
  }
}

// DELETE skill category (Admin only)
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Check if category exists
    const category = await getSkillCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    await deleteSkillCategory(id);

    // Log the deletion
    await logResourceDeletion({
      user: authResult.user,
      resourceType: 'skill_category',
      resourceId: String(id),
      details: { name: category.name }
    }, request);

    return NextResponse.json({ 
      message: 'Category deleted successfully',
      category
    });
  } catch (error) {
    console.error('Error deleting skill category:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill category' },
      { status: 500 }
    );
  }
}
