export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sanitizeResponse } from '@/lib/private/sanitize';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      targetArtistId,
      requesterId,
      collabType,
      dealType,
      requesterSplit,
      receiverSplit,
      feeAmount,
      projectTitle,
      message,
      demoUrl,
      proposedDeadline
    } = body;

    if (!targetArtistId || !requesterId) {
      return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    const { data: request, error } = await supabase
      .from('collab_requests')
      .insert({
        requester_id: requesterId,
        receiver_id: targetArtistId,
        collab_type: collabType,
        deal_type: dealType,
        requester_split_percent: requesterSplit || 0,
        receiver_split_percent: receiverSplit || 0,
        fee_amount_cents: (feeAmount || 0) * 100,
        project_title: projectTitle,
        message,
        demo_url: demoUrl,
        proposed_deadline: proposedDeadline ? new Date(proposedDeadline).toISOString() : null,
        expires_at: expiresAt.toISOString(),
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) throw error;

    // Normalize for response if needed, though sanitizeResponse handles most
    return NextResponse.json(sanitizeResponse(request));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
