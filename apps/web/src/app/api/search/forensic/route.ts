export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  
  if (!q || q.length < 3) {
    return NextResponse.json({ results: [], message: 'Query too short' });
  }

  try {
    const supabase = await createClient();

    // Search for flagged streams by artist ID or IP
    const [
      { data: flaggedStreams, error: sError },
      { data: incidents, error: iError }
    ] = await Promise.all([
      supabase
        .from('stream_plays')
        .select('id, artist_id, ip_address, device_id, flag_reason, fraud_score, started_at')
        .or(`artist_id.eq.${q},ip_address.eq.${q},device_id.eq.${q}`)
        .eq('is_excluded_from_pool', true)
        .order('started_at', { ascending: false })
        .limit(50),
      supabase
        .from('fraud_incidents')
        .select('*, organizations(name, slug)')
        .or(`artist_id.eq.${q},type.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .limit(20)
    ]);

    if (sError || iError) throw sError || iError;

    interface SupabaseStream {
      id: string;
      artist_id: string;
      ip_address?: string;
      device_id?: string;
      flag_reason?: string;
      fraud_score?: number;
      started_at: string;
    }

    interface SupabaseIncident {
      id: string;
      artist_id: string;
      created_at: string;
      organizations?: { name: string; slug: string };
      [key: string]: unknown;
    }

    // Normalize for UI compatibility (camelCase)
    const normalizedStreams = (flaggedStreams || []).map((s: SupabaseStream) => ({
      ...s,
      artistId: s.artist_id,
      ipAddress: s.ip_address,
      deviceId: s.device_id,
      flagReason: s.flag_reason,
      fraudScore: s.fraud_score,
      startedAt: s.started_at
    }));

    const normalizedIncidents = (incidents || []).map((i: SupabaseIncident) => ({
      ...i,
      artistId: i.artist_id,
      createdAt: i.created_at,
      Organization: i.organizations
    }));

    return NextResponse.json({
      flaggedStreams: normalizedStreams,
      incidents: normalizedIncidents,
      totalFlagged: normalizedStreams.length,
      totalIncidents: normalizedIncidents.length,
    });
  } catch (error) {
    console.error('[Forensic Search Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
