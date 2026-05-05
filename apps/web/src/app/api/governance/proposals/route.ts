export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { title, description, category, expiresAt } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Organizations are linked to Artists
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        title,
        description,
        organization_id: artist.id, // Using artist ID as organization ID (they are 1:1 for most)
        status: 'ACTIVE',
        category: category || 'NETWORK_EXPANSION',
        expires_at: new Date(expiresAt || Date.now() + 7 * 24 * 3600 * 1000).toISOString() // Default 7 days
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, proposal });
  } catch (error: unknown) {
    console.error('Create proposal error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
