import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeResponse, safeError } from '@/lib/private/sanitize';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) throw new Error("slug is required");

    const org = await prisma.organization.findUnique({
      where: { slug }
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json(sanitizeResponse(org));
  } catch (error: any) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { slug, name, bio, profileImageUrl } = await req.json();
    if (!slug) throw new Error("slug is required");

    const org = await prisma.organization.update({
      where: { slug },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(profileImageUrl && { profileImageUrl })
      }
    });

    return NextResponse.json(sanitizeResponse(org));
  } catch (error: any) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

