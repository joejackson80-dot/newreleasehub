import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { organizationId, title, audioUrl, imageUrl } = await req.json();

    if (!organizationId || !title || !audioUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const asset = await prisma.musicAsset.create({
      data: {
        organizationId,
        title,
        audioUrl,
        imageUrl,
        allocatedLicenseBps: 0
      }
    });

    return NextResponse.json(asset);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    if (!orgId) throw new Error("orgId is required");

    const assets = await prisma.musicAsset.findMany({
      where: { organizationId: orgId },
      orderBy: { title: 'asc' }
    });

    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
