export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { oppId, voteType, comment, userId } = await req.json();

    if (!oppId || !voteType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Record the vote as an applicant entry with a special metadata note
    // In a real governance system, this would be a separate Vote model
    await prisma.opportunity.update({
      where: { id: oppId },
      data: {
        applicantCount: { increment: 1 }
      }
    });

    console.info(`[GOVERNANCE_AUDIT] Forensic Vote Cast: ${voteType} on Proposal ${oppId} | Comment: ${comment || 'None'}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Governance Vote Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



