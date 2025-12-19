import { NextResponse } from 'next/server';
import { getSkillCategories, createSkillCategory } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { logResourceCreation } from '@/lib/audit-logger';

// GET all skill categories
export async function GET(request) {
  try {
    const categories = await getSkillCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill categories' },
      { status: 500 }
    );
  }
}

// POST create new skill category (Admin only)
export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await createSkillCategory({ name, description, display_order });
    
    // Log the creation
    await logResourceCreation({
      user: authResult.user,
      resourceType: 'skill_category',
      resourceId: String(category.id),
      details: { name: category.name }
    }, request);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating skill category:', error);
    
    // Handle unique constraint violation
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create skill category' },
      { status: 500 }
    );
  }
}
