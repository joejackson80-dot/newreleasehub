export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ tracks: [] });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { crate: true }
    });

    if (!user || !user.crate || user.crate.length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    const tracks = await prisma.musicAsset.findMany({
      where: { id: { in: user.crate } },
      include: {
        Organization: { select: { id: true, name: true, slug: true } }
      }
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error fetching library tracks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



