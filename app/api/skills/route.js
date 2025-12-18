import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET all skills with optional category filter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');

    let sql = `
      SELECT s.*, sc.name as category_name
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
    `;
    
    const params = [];
    
    if (categoryId) {
      sql += ' WHERE s.category_id = $1';
      params.push(categoryId);
    }
    
    sql += ' ORDER BY s.display_order, s.name';

    const result = await query(sql, params);
    
    return NextResponse.json(result.rows);
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
    const { name, category_id, description, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO skills (name, category_id, description, display_order, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name, category_id || null, description || null, display_order || 0]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
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
