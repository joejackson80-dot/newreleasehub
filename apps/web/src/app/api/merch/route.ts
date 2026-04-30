import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFanId } from '@/lib/session';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  
  if (!orgId) return NextResponse.json({ error: 'Org ID required' }, { status: 400 });

  const fanId = await getSessionFanId().catch(() => null);
  let fan: any = null;
  if (fanId) {
    fan = await prisma.user.findUnique({
      where: { id: fanId },
      include: {
        SupporterSubscriptions: {
          where: { artistId: orgId, status: 'ACTIVE' }
        }
      }
    });
  }

  const merch = await prisma.merch.findMany({
    where: { organizationId: orgId },
    orderBy: { isLiveDrop: 'desc' }
  });

  // Calculate locking logic
  const enrichedMerch = merch.map(m => {
    let isLocked = false;
    let lockReason = "";

    if (m.isSupporterOnly && (!fan || fan.SupporterSubscriptions.length === 0)) {
      isLocked = true;
      lockReason = "SUPPORTER ONLY";
    } else if (m.minFanLevel > (fan?.fanLevel || 0)) {
      isLocked = true;
      lockReason = `FAN LEVEL ${m.minFanLevel} REQUIRED`;
    }

    return {
      ...m,
      isLocked,
      lockReason
    };
  });

  return NextResponse.json(enrichedMerch);
}

export async function POST(req: Request) {
  try {
    const { 
      organizationId, title, priceCents, description, 
      imageUrl, stockCount, isLiveDrop, 
      isSupporterOnly, minFanLevel 
    } = await req.json();
    
    const product = await prisma.merch.create({
      data: {
        organizationId,
        title,
        priceCents,
        description,
        imageUrl,
        stockCount,
        isLiveDrop,
        isSupporterOnly: isSupporterOnly || false,
        minFanLevel: minFanLevel || 1
      }
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
