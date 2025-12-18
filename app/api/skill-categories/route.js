import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET all skill categories
export async function GET(request) {
  try {
    const result = await query(
      'SELECT * FROM skill_categories ORDER BY display_order, name',
      []
    );
    
    return NextResponse.json(result.rows);
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

    const result = await query(
      `INSERT INTO skill_categories (name, description, display_order, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name, description || null, display_order || 0]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating skill category:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
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
