import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeResponse } from '@/lib/private/sanitize';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results: any[] = [];

    // Search Artists (Organizations)
    if (!type || type === 'All' || type === 'Artists') {
      const artists = await prisma.organization.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { genres: { has: query } },
            { city: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });

      artists.forEach(artist => {
        results.push({
          id: artist.id,
          type: 'artist',
          name: artist.name,
          category: artist.genres.join(' / ') || 'Independent',
          img: artist.profileImageUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
          badge: artist.artistTier.toUpperCase().replace('_', ' '),
          slug: artist.slug
        });
      });
    }

    // Search Releases
    if (!type || type === 'All' || type === 'Releases') {
      const releases = await prisma.release.findMany({
        where: {
          title: { contains: query, mode: 'insensitive' },
        },
        include: {
          Organization: true,
        },
        take: 10,
      });

      releases.forEach(release => {
        results.push({
          id: release.id,
          type: 'release',
          title: release.title,
          artist: release.Organization.name,
          category: `${release.type.toUpperCase()} • ${new Date(release.releaseDate).getFullYear()}`,
          img: release.coverArtUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
          status: release.isScheduled ? 'SCHEDULED' : 'LIVE',
          artistSlug: release.Organization.slug
        });
      });
    }

    // Search Hubs
    if (!type || type === 'All' || type === 'Hubs') {
      const hubs = await prisma.organization.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      });

      hubs.forEach(hub => {
        results.push({
          id: `hub-${hub.id}`,
          type: 'hub',
          name: hub.name,
          slug: hub.slug,
          img: hub.profileImageUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
          isLive: true,
          scene: 'Recording Studio A'
        });
      });
    }

    // Search Opportunities
    if (!type || type === 'All' || type === 'Opportunities') {
      const opportunities = await prisma.opportunity.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      });

      opportunities.forEach(opp => {
        results.push({
          id: opp.id,
          type: 'opportunity',
          title: opp.title,
          poster: opp.posterName || 'Institutional Partner',
          category: `${opp.type.toUpperCase()} • $${(opp.rewardCents || 0) / 100}`,
          deadline: opp.deadline ? `${Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left` : 'Open',
        });
      });
    }

    return NextResponse.json(sanitizeResponse(results));
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


