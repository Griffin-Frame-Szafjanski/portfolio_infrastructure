import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET single skill category
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await query(
      'SELECT * FROM skill_categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
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

    const result = await query(
      `UPDATE skill_categories 
       SET name = $1, description = $2, display_order = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, description || null, display_order || 0, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating skill category:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
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

    const result = await query(
      'DELETE FROM skill_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Category deleted successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting skill category:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill category' },
      { status: 500 }
    );
  }
}
