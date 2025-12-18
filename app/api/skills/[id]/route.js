import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET single skill with related projects
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get skill details
    const skillResult = await query(
      `SELECT s.*, sc.name as category_name
       FROM skills s
       LEFT JOIN skill_categories sc ON s.category_id = sc.id
       WHERE s.id = $1`,
      [id]
    );

    if (skillResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    const skill = skillResult.rows[0];

    // Get related projects
    const projectsResult = await query(
      `SELECT p.id, p.title, p.description, p.image_url
       FROM projects p
       JOIN project_skills ps ON p.id = ps.project_id
       WHERE ps.skill_id = $1
       ORDER BY p.display_order, p.title`,
      [id]
    );

    skill.projects = projectsResult.rows;

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
    const { name, category_id, description, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE skills 
       SET name = $1, category_id = $2, description = $3, display_order = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, category_id || null, description || null, display_order || 0, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating skill:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
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

    // The project_skills relationships will be deleted automatically (CASCADE)
    const result = await query(
      'DELETE FROM skills WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Skill deleted successfully',
      skill: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
