export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { checkIPReputation } from '@/lib/fraud/ipCheck'
import { createAdminClient } from '@/lib/supabase/admin'
import { safeError } from '@/lib/api/errors'

export async function POST(req: NextRequest) {
  try {
    const { trackId, artistId, deviceId, userAgent, listenerId, listenerType } = await req.json()
    
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    
    // Check IP reputation
    const ipData = await checkIPReputation(ip)
    
    const supabase = createAdminClient();

    // Determine pool source based on listener's subscription status
    let poolSource: 'A' | 'C' = 'C' // Default: free/ad-supported pool
    
    if (listenerId && (listenerType === 'fan' || listenerType === 'FAN')) {
      // Check if this fan has an active paid subscription
      const { data: activeSub } = await supabase
        .from('fan_subscriptions')
        .select('id')
        .eq('fan_id', listenerId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();
      
      if (activeSub) {
        poolSource = 'A' // Paid subscriber → premium pool
      }
    }
    
    // Create StreamPlay record
    const { data: streamPlay, error: createError } = await supabase
      .from('stream_plays')
      .insert({
        track_id: trackId,
        artist_id: artistId,
        listener_id: listenerId || null,
        listener_type: (listenerType?.toUpperCase() || 'GUEST') as any,
        device_id: deviceId || 'unknown',
        ip_address: ip,
        ip_country: ipData.country || 'unknown',
        ip_is_datacenter: !!ipData.isDatacenter,
        user_agent: userAgent || 'unknown',
        pool_source: poolSource as any,
        counted_as_stream: false,
        fraud_score: 1.0,
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (createError) throw createError;
    
    return NextResponse.json({ streamPlayId: streamPlay.id })
  } catch (error: unknown) {
    console.error('Stream start error:', error);
    return NextResponse.json(safeError(error), { status: 500 })
  }
}
