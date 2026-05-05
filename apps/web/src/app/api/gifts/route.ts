import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { organizationId, userId, giftType, valueCents, message } = await req.json();

    const supabase = createAdminClient();

    // 1. Create Gift Event
    const { data: gift, error: giftError } = await supabase
      .from('gift_events')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        gift_type: giftType,
        value_cents: valueCents,
        message
      })
      .select(`
        *,
        organizations (*)
      `)
      .single();

    if (giftError) throw giftError;

    // 2. Award Badge if Supernova
    if (giftType === 'SUPERNOVA' && userId && userId !== 'anonymous_fan') {
      try {
        await supabase
          .from('badges')
          .upsert({
            user_id: userId,
            type: 'WHALE',
            organization_id: organizationId
          }, {
            onConflict: 'user_id,type,organization_id'
          });
      } catch (e) {
        console.error('Badge award failed:', e);
      }
    }

    // 3. Real-time Broadcast
    const { data: { session } } = await (await import('@/lib/supabase/server')).createClient().then(c => c.auth.getSession());
    
    // We use the admin client for DB but standard for broadcast if possible
    // Actually, for broadcast we can use the same admin client if configured
    await supabase.channel(`org-${organizationId}`).send({
      type: 'broadcast',
      event: 'GIFT_RECEIVED',
      payload: {
        id: gift.id,
        userName: userId,
        giftType,
        valueCents,
        message,
        timestamp: gift.created_at
      }
    });

    return NextResponse.json({
      ...gift,
      Organization: gift.organizations
    });
  } catch (error: unknown) {
    console.error('Gift processing error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process gift';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
