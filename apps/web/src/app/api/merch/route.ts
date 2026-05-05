export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionFanId } from '@/lib/session';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  
  if (!orgId) return NextResponse.json({ error: 'Org ID required' }, { status: 400 });

  const fanId = await getSessionFanId().catch(() => null);
  const supabase = createAdminClient();

  let fan: any = null;
  if (fanId) {
    const { data: userData } = await supabase
      .from('users')
      .select(`
        *,
        supporter_subscriptions (*)
      `)
      .eq('id', fanId)
      .eq('supporter_subscriptions.artist_id', orgId)
      .eq('supporter_subscriptions.status', 'ACTIVE')
      .maybeSingle();
    fan = userData;
  }

  const { data: merch, error: merchError } = await supabase
    .from('merch')
    .select('*')
    .eq('organization_id', orgId)
    .order('is_live_drop', { ascending: false });

  if (merchError) {
    return NextResponse.json({ error: merchError.message }, { status: 500 });
  }

  // Calculate locking logic
  const enrichedMerch = (merch || []).map(m => {
    let isLocked = false;
    let lockReason = "";

    const activeSubs = fan?.supporter_subscriptions || [];

    if (m.is_supporter_only && (!fan || activeSubs.length === 0)) {
      isLocked = true;
      lockReason = "SUPPORTER ONLY";
    } else if (m.min_fan_level > (fan?.fan_level || 0)) {
      isLocked = true;
      lockReason = `FAN LEVEL ${m.min_fan_level} REQUIRED`;
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
    
    const supabase = createAdminClient();

    const { data: product, error } = await supabase
      .from('merch')
      .insert({
        organization_id: organizationId,
        title,
        price_cents: priceCents,
        description,
        image_url: imageUrl,
        stock_count: stockCount,
        is_live_drop: isLiveDrop,
        is_supporter_only: isSupporterOnly || false,
        min_fan_level: minFanLevel || 1
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error('Merch API POST error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
