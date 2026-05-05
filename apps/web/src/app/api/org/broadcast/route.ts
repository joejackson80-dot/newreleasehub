export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { organizationId, youtubeStreamKey, twitterStreamKey, twitchStreamKey } = await req.json();

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    const org = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        youtubeStreamKey,
        twitterStreamKey,
        twitchStreamKey
      }
    });

    return NextResponse.json(org);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



