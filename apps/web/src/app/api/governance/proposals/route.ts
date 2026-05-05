export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { title, description, category, expiresAt } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description required' }, { status: 400 });
    }

    // Organizations are linked to Artists
    const proposal = await prisma.proposal.create({
      data: {
        title,
        description,
        organizationId: artist.id, // Using artist ID as organization ID (they are 1:1 for most)
        status: 'ACTIVE',
        category: category || 'NETWORK_EXPANSION',
        expiresAt: new Date(expiresAt || Date.now() + 7 * 24 * 3600 * 1000) // Default 7 days
      }
    });

    return NextResponse.json({ success: true, proposal });
  } catch (error: any) {
    console.error('Create proposal error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

