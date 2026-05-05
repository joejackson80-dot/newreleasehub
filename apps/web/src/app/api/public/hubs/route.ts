export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Fetch Organizations with Session Decks and latest Track
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select(`
        *,
        session_decks (*),
        tracks (*)
      `)
      .order('created_at', { ascending: false });

    if (orgError) throw orgError;

    // Normalize for the Hub UI structure (pick only latest track)
    const normalizedOrgs = (orgs || []).map(org => {
      const allTracks = Array.isArray(org.tracks) ? org.tracks : [];
      const latestTrack = [...allTracks].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      return {
        ...org,
        SessionDeck: org.session_decks?.[0] || null,
        MusicAssets: latestTrack ? [latestTrack] : []
      };
    });

    // 2. Fetch Licenses
    const { data: licenses, error: licError } = await supabase
      .from('participation_licenses')
      .select('*, tracks(*)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (licError) throw licError;

    // Normalize license tracks
    const normalizedLicenses = (licenses || []).map(lic => ({
      ...lic,
      MusicAsset: lic.tracks
    }));

    // 3. Fetch Pending Bids
    const { data: bids, error: bidError } = await supabase
      .from('bid_offers')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(10);

    if (bidError) throw bidError;

    return NextResponse.json({ 
      orgs: normalizedOrgs, 
      licenses: normalizedLicenses, 
      bids: bids || [] 
    });
  } catch (error: unknown) {
    console.error('Public Hubs API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
