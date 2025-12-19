import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { updateMessage, deleteMessage } from '@/lib/db';
import { logResourceUpdate, logResourceDeletion } from '@/lib/audit-logger';

// PUT - Update message (mark as read/unread)
export async function PUT(request, { params }) {
  try {
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
    const { read } = body;

    const updatedMessage = await updateMessage(id, { read });

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    // Log the update
    await logResourceUpdate({
      user: authResult.user,
      resourceType: 'message',
      resourceId: String(id),
      details: { read, from: updatedMessage.name }
    }, request);

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully',
      data: updatedMessage
    });

  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete message
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const deleted = await deleteMessage(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    // Log the deletion
    await logResourceDeletion({
      user: authResult.user,
      resourceType: 'message',
      resourceId: String(id),
      details: { from: deleted.name, email: deleted.email }
    }, request);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
