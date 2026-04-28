import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json({ error: 'orgId is required' }, { status: 400 });
    }

    const licenses = await prisma.participationLicense.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      include: { MusicAsset: true }
    });

    return NextResponse.json(licenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
