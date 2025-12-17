import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { del } from '@vercel/blob';

const sql = neon(process.env.DATABASE_URL);

// GET - Fetch all media for a project
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const media = await sql`
      SELECT * FROM project_media 
      WHERE project_id = ${id}
      ORDER BY media_type, display_order, created_at
    `;
    
    return NextResponse.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching project media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// POST - Add new media to a project
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { media_type, title, description, url, file_key, display_order } = body;

    // Validate required fields
    if (!media_type || !title || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: media_type, title, url' },
        { status: 400 }
      );
    }

    // Validate media_type
    if (!['video', 'pdf'].includes(media_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid media_type. Must be "video" or "pdf"' },
        { status: 400 }
      );
    }

    // Insert the media
    const result = await sql`
      INSERT INTO project_media (
        project_id, media_type, title, description, url, file_key, display_order
      ) VALUES (
        ${id}, ${media_type}, ${title}, ${description || null}, 
        ${url}, ${file_key || null}, ${display_order || 0}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error adding project media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add media' },
      { status: 500 }
    );
  }
}

// PUT - Update media item
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { media_id, title, description, url, display_order } = body;

    if (!media_id) {
      return NextResponse.json(
        { success: false, error: 'Missing media_id' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE project_media 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        url = COALESCE(${url}, url),
        display_order = COALESCE(${display_order}, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${media_id} AND project_id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error updating project media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update media' },
      { status: 500 }
    );
  }
}

// DELETE - Remove media item
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const media_id = searchParams.get('media_id');

    if (!media_id) {
      return NextResponse.json(
        { success: false, error: 'Missing media_id parameter' },
        { status: 400 }
      );
    }

    // Get the media item to check for file_key
    const media = await sql`
      SELECT * FROM project_media 
      WHERE id = ${media_id} AND project_id = ${id}
    `;

    if (media.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    // If it's a PDF with a file_key, delete from Vercel Blob
    if (media[0].media_type === 'pdf' && media[0].file_key) {
      try {
        await del(media[0].file_key);
      } catch (blobError) {
        console.error('Error deleting blob:', blobError);
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete from database
    await sql`
      DELETE FROM project_media 
      WHERE id = ${media_id} AND project_id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
