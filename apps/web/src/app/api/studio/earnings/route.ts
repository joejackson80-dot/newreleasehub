import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeResponse, aliasFields } from '@/lib/private/sanitize';

import { getSessionArtist } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const artist = await getSessionArtist();
    const org = await prisma.organization.findUnique({
      where: { id: artist.id },
      include: {
        ArtistRoyalties: {
          orderBy: { createdAt: 'desc' },
          take: 6
        },
        SupporterSubscriptions: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Format payouts for the UI
    const payouts = org.ArtistRoyalties.map(r => ({
      id: r.id,
      date: new Date(r.year, r.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      amount: r.totalEarnings / 100,
      status: r.status,
      type: 'Direct Settlement'
    }));

    // Generate chart data (last 6 months)
    const chartData = org.ArtistRoyalties.slice().reverse().map(r => ({
      label: new Date(r.year, r.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      value: r.totalEarnings / 100
    }));

    // Calculate current month's projected support
    const activesupportCents = org.SupporterSubscriptions.reduce((sum, p) => sum + p.priceCents, 0);

    const responseData = {
      balance: org.balanceCents / 100,
      payouts,
      chartData,
      stats: {
        activesupportCents,
        supporterCount: org.supporterCount,
        totalEarningsCents: org.ArtistRoyalties.reduce((sum, r) => sum + r.totalEarnings, 0)
      }
    };

    return NextResponse.json(sanitizeResponse(aliasFields(responseData as any)));
  } catch (error: any) {
    console.error('Earnings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


