import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const liveStations = await prisma.organization.findMany({
      where: { isLive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        profileImageUrl: true,
        liveListenerCount: true,
        isVerified: true
      }
    });

    return NextResponse.json({ success: true, stations: liveStations });
  } catch (error: any) {
    console.error('Network Live API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
