import { NextResponse } from 'next/server';
import { safeError, sanitizeResponse } from '@/lib/private/sanitize';

export async function POST(req: Request) {
  try {
    const { targetId, content, userId } = await req.json();

    if (!targetId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mock comment recording for phase 6
    const mockResponse = {
      success: true,
      comment: {
        id: `cmt-${Date.now()}`,
        targetId,
        content,
        userId: userId || 'anonymous',
        createdAt: new Date().toISOString(),
      }
    };

    return NextResponse.json(sanitizeResponse(mockResponse));
  } catch (error) {
    return NextResponse.json(safeError(error, 'comments-api'), { status: 500 });
  }
}


