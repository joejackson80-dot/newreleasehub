export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch top 5 trending artists (by supporter count growth or just top supporters for now)
    const topArtists = await prisma.organization.findMany({
      orderBy: { supporterCount: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        profileImageUrl: true,
        supporterCount: true
      }
    });

    // Fetch latest 4 opportunities
    const latestOpps = await prisma.opportunity.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
      take: 4
    });

    const items = [
      ...topArtists.map(a => ({
        id: a.id,
        type: 'artist',
        name: a.name,
        slug: a.slug,
        profileImageUrl: a.profileImageUrl || '/images/default-avatar.png',
        growth: Math.floor(Math.random() * 15) + 5 // Simulated growth metric
      })),
      ...latestOpps.map(o => ({
        id: o.id,
        type: 'opportunity',
        title: o.title,
        description: o.description,
        category: o.type,
        reward: o.budget || 'PROTOCOL REWARD',
        deadline: o.deadline ? new Date(o.deadline).toLocaleDateString() : 'Rolling'
      }))
    ];

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Network Discovery API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

