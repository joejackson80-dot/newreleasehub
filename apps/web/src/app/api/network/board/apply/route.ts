export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { opportunityId, pitch } = await req.json();

    if (!opportunityId || !pitch) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if already applied
    const { data: existing } = await supabase
      .from('opportunity_applications')
      .select('id')
      .eq('opportunity_id', opportunityId)
      .eq('artist_id', artist.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error: 'Already applied' }, { status: 400 });
    }

    const { data: application, error: createError } = await supabase
      .from('opportunity_applications')
      .insert({
        opportunity_id: opportunityId,
        artist_id: artist.id,
        pitch,
        status: 'PENDING'
      })
      .select()
      .single();

    if (createError) throw createError;

    // Increment applicant count on the opportunity
    const { data: opp } = await supabase
      .from('opportunities')
      .select('applicant_count')
      .eq('id', opportunityId)
      .single();
    
    if (opp) {
      await supabase
        .from('opportunities')
        .update({ applicant_count: (opp.applicant_count || 0) + 1 })
        .eq('id', opportunityId);
    }

    return NextResponse.json({ success: true, application });
  } catch (error: unknown) {
    console.error('Opportunity Apply API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
