import { NextResponse } from 'next/server';
import { getSkills, createSkill } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { logResourceCreation } from '@/lib/audit-logger';

// GET all skills with optional category filter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    const skills = await getSkills(categoryId);
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST create new skill (Admin only)
export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category_id, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }

    const skill = await createSkill({ name, category_id, display_order });
    
    // Log the creation
    await logResourceCreation({
      user: authResult.user,
      resourceType: 'skill',
      resourceId: String(skill.id),
      details: { name: skill.name, category_id }
    }, request);
    
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    
    // Handle unique constraint violation
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json(
        { error: 'A skill with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
