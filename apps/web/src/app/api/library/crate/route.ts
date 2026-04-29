import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, trackId } = body;

    if (!userId || !trackId) {
      return NextResponse.json({ error: 'Missing userId or trackId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let updatedCrate = [...user.crate];
    if (updatedCrate.includes(trackId)) {
      updatedCrate = updatedCrate.filter(id => id !== trackId);
    } else {
      updatedCrate.push(trackId);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { crate: updatedCrate }
    });

    return NextResponse.json({ success: true, isLiked: updatedCrate.includes(trackId) });
  } catch (error) {
    console.error('Crate update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ crate: [] });
  }
  
  try {
     const user = await prisma.user.findUnique({ 
       where: { id: userId }, 
       select: { crate: true } 
     });
     return NextResponse.json({ crate: user?.crate || [] });
  } catch (error) {
     console.error('Crate fetch error:', error);
     return NextResponse.json({ crate: [] });
  }
}


