export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    if (!orgId) throw new Error("orgId is required");

    const messages = await prisma.chatMessage.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(messages.reverse());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { organizationId, user, text, platform, badge } = await req.json();
    
    if (!organizationId || !user || !text) {
      throw new Error("Missing required fields");
    }

    const message = await prisma.chatMessage.create({
      data: {
        organizationId,
        user,
        text,
        platform: platform || "NRH",
        badge: badge || null
      }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



