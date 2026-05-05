'use server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionFan } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function voteOnProposal(proposalId: string, voteType: 'YES' | 'NO') {
  try {
    const user = await getSessionFan();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabase = createAdminClient();

    // Check if already voted
    const { data: existing } = await supabase
      .from('votes')
      .select('id')
      .eq('proposal_id', proposalId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) return { success: false, error: 'Already voted' };

    // Calculate weight based on fan level
    const weight = user.fanLevel || 1;

    const { error } = await supabase
      .from('votes')
      .insert({
        proposal_id: proposalId,
        user_id: user.id,
        vote_type: voteType,
        weight
      });

    if (error) throw error;

    revalidatePath('/governance');
    return { success: true };
  } catch (error: unknown) {
    console.error('Vote error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return { success: false, error: message };
  }
}

export async function getProposals() {
  try {
    const supabase = createAdminClient();

    const { data: proposals, error: propError } = await supabase
      .from('proposals')
      .select(`
        *,
        organizations (name, profile_image_url),
        votes (
          id,
          vote_type,
          weight,
          created_at,
          users (display_name)
        )
      `)
      .eq('status', 'ACTIVE')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (propError) throw propError;

    // Calculate weighted sums for each proposal in-memory
    const proposalsWithWeights = (proposals || []).map((p: any) => {
      const votes = p.votes || [];
      const yesWeight = votes.filter((v: any) => v.vote_type === 'YES').reduce((sum: number, v: any) => sum + (v.weight || 0), 0);
      const noWeight = votes.filter((v: any) => v.vote_type === 'NO').reduce((sum: number, v: any) => sum + (v.weight || 0), 0);
      const totalWeight = yesWeight + noWeight;

      // Normalize votes to match previous structure if needed for UI
      const normalizedVotes = votes.slice(0, 5).map((v: any) => ({
        id: v.id,
        voteType: v.vote_type,
        weight: v.weight,
        createdAt: v.created_at,
        User: v.users
      }));

      return {
        ...p,
        Organization: p.organizations,
        Votes: normalizedVotes,
        _count: { Votes: votes.length },
        yesWeight,
        noWeight,
        totalWeight,
        consensusPercent: totalWeight > 0 ? Math.round((yesWeight / totalWeight) * 100) : 0
      };
    });

    return { success: true, proposals: proposalsWithWeights };
  } catch (error: unknown) {
    console.error('Get proposals error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return { success: false, error: message };
  }
}
