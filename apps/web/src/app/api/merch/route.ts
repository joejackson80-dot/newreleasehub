import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  
  if (!orgId) return NextResponse.json({ error: 'Org ID required' }, { status: 400 });

  const merch = await prisma.merch.findMany({
    where: { organizationId: orgId },
    orderBy: { isLiveDrop: 'desc' }
  });

  return NextResponse.json(merch);
}

export async function POST(req: Request) {
  try {
    const { organizationId, title, priceCents, description, imageUrl, stockCount, isLiveDrop } = await req.json();
    
    const product = await prisma.merch.create({
      data: {
        organizationId,
        title,
        priceCents,
        description,
        imageUrl,
        stockCount,
        isLiveDrop
      }
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
