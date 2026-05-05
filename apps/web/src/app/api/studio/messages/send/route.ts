export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { receiverUserId, text } = await req.json();

    if (!receiverUserId || !text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const message = await prisma.directMessage.create({
      data: {
        text,
        senderOrgId: artist.id,
        receiverUserId,
      },
      include: {
        senderOrg: {
          select: { name: true, profileImageUrl: true }
        },
        receiverUser: {
          select: { displayName: true, avatarUrl: true }
        }
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error('Send Message API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

