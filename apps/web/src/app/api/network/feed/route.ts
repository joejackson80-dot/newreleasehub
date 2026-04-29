import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch Milestones
    const milestones = await prisma.artistMilestone.findMany({
      take: limit,
      orderBy: { achievedAt: 'desc' },
      include: {
        artist: {
          select: { name: true, slug: true, profileImageUrl: true }
        }
      }
    });

    // Fetch New Releases
    const releases = await prisma.musicAsset.findMany({
      where: { isLive: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        Organization: {
          select: { name: true, slug: true, profileImageUrl: true }
        }
      }
    });

    // Fetch Active Collabs
    const collabs = await prisma.collabRequest.findMany({
      where: { status: 'ACCEPTED' },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        requester: { select: { name: true, profileImageUrl: true } },
        receiver: { select: { name: true, profileImageUrl: true } }
      }
    });

    // Unified Feed Items
    const feedItems = [
      ...milestones.map(m => ({
        id: `milestone-${m.id}`,
        type: 'MILESTONE',
        title: `${m.artist.name} achieved ${m.type.replace('_', ' ')}`,
        description: `New institutional milestone verified: ${m.type.replace('_', ' ')} protocol.`,
        timestamp: m.achievedAt,
        artist: m.artist,
        metadata: { type: m.type, icon: '🏆' }
      })),
      ...releases.map(r => ({
        id: `release-${r.id}`,
        type: 'RELEASE',
        title: `New Release: ${r.title}`,
        description: `${r.Organization.name} just dropped a new track.`,
        timestamp: r.createdAt,
        artist: r.Organization,
        metadata: { assetId: r.id, icon: '🎵' }
      })),
      ...collabs.map(c => ({
        id: `collab-${c.id}`,
        type: 'COLLAB',
        title: `${c.requester.name} x ${c.receiver.name}`,
        description: `New collaboration protocol established: ${c.projectTitle}`,
        timestamp: c.createdAt,
        artist: c.requester,
        metadata: { icon: '🤝' }
      }))
    ];

    // Sort by timestamp
    feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ 
      success: true, 
      feed: feedItems.slice(0, limit) 
    });
  } catch (error: any) {
    console.error('Network Feed API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
