'use server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function applyForOpportunity(data: {
  opportunityId: string,
  pitch: string
}) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Artist session required' };

    const supabase = await createClient();

    // Check if already applied
    const { data: existing } = await supabase
      .from('opportunity_applications')
      .select('id')
      .eq('opportunity_id', data.opportunityId)
      .eq('artist_id', artist.id)
      .maybeSingle();

    if (existing) return { success: false, error: 'Application already submitted for this initiative.' };

    const { data: application, error: createError } = await supabase
      .from('opportunity_applications')
      .insert({
        opportunity_id: data.opportunityId,
        artist_id: artist.id,
        pitch: data.pitch
      })
      .select()
      .single();

    if (createError) throw createError;

    // Increment applicant count - sequential update
    const { data: opp } = await supabase
      .from('opportunities')
      .select('applicant_count')
      .eq('id', data.opportunityId)
      .single();
    
    if (opp) {
      await supabase
        .from('opportunities')
        .update({ applicant_count: (opp.applicant_count || 0) + 1 })
        .eq('id', data.opportunityId);
    }

    revalidatePath('/network/board');
    return { success: true, application };
  } catch (error: unknown) {
    console.error('Apply for opportunity error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return { success: false, error: message };
  }
}

export async function voteOnProposal(data: {
  oppId: string,
  voteType: string,
  comment?: string
}) {
   try {
      const artist = await getSessionArtist();
      if (!artist) return { success: false, error: 'Artist session required for governance participation.' };

      const supabase = await createClient();

      // Check if already voted (using opportunity_applications as the ledger)
      const { data: existing } = await supabase
        .from('opportunity_applications')
        .select('id')
        .eq('opportunity_id', data.oppId)
        .eq('artist_id', artist.id)
        .maybeSingle();

      if (existing) return { success: false, error: 'Vote already recorded in protocol ledger.' };

      const { error: createError } = await supabase
         .from('opportunity_applications')
         .insert({
            opportunity_id: data.oppId,
            artist_id: artist.id,
            pitch: `VOTE:${data.voteType}|COMMENT:${data.comment || ''}`
         });

      if (createError) throw createError;

      const { data: opp } = await supabase
         .from('opportunities')
         .select('applicant_count')
         .eq('id', data.oppId)
         .single();
      
      if (opp) {
        await supabase
           .from('opportunities')
           .update({ applicant_count: (opp.applicant_count || 0) + 1 })
           .eq('id', data.oppId);
      }

      revalidatePath('/network/board');
      return { success: true };
   } catch (error: unknown) {
      console.error('Vote error:', error);
      const message = error instanceof Error ? error.message : 'Database error';
      return { success: false, error: message };
   }
}
