export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { type, organizationId } = await req.json(); // 'FIRE', 'COOL', or 'TRASH'
    if (!organizationId) throw new Error("organizationId is required");
    
    const supabase = createAdminClient();

    // Fetch current counts
    const { data: currentDeck, error: fetchError } = await supabase
      .from('session_decks')
      .select('*')
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (fetchError || !currentDeck) throw fetchError || new Error("Session deck not found");

    let updateData = {};
    if (type === 'FIRE') updateData = { fire_count: (currentDeck.fire_count || 0) + 1 };
    else if (type === 'COOL') updateData = { cool_count: (currentDeck.cool_count || 0) + 1 };
    else if (type === 'TRASH') updateData = { trash_count: (currentDeck.trash_count || 0) + 1 };

    const { data: updatedDeck, error: updateError } = await supabase
      .from('session_decks')
      .update(updateData)
      .eq('id', currentDeck.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedDeck);
  } catch (error: unknown) {
    console.error('DJ Vote POST error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
