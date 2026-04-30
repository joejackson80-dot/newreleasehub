import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { opportunityId, pitch } = await req.json();

    if (!opportunityId || !pitch) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already applied
    const existing = await prisma.opportunityApplication.findFirst({
      where: {
        opportunityId,
        artistId: artist.id
      }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Already applied' }, { status: 400 });
    }

    const application = await prisma.opportunityApplication.create({
      data: {
        opportunityId,
        artistId: artist.id,
        pitch,
        status: 'PENDING'
      }
    });

    // Increment applicant count on the opportunity
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { applicantCount: { increment: 1 } }
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error('Opportunity Apply API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
