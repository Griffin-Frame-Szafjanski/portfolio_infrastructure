import { NextResponse } from 'next/server';
import { getProjectSkills } from '@/lib/db';

// GET project skills
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const skills = await getProjectSkills(id);
    
    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error fetching project skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project skills' },
      { status: 500 }
    );
  }
}
