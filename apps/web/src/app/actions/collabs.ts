'use server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function acceptCollabDeal(collabId: string) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();

    // Update collab status to ACCEPTED
    const { data: collab, error } = await supabase
      .from('collab_requests')
      .update({ status: 'ACCEPTED' })
      .eq('id', collabId)
      .eq('receiver_id', artist.id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/studio/collabs');
    return { success: true, collab };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return { success: false, error: message };
  }
}

export async function declineCollabDeal(collabId: string) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();

    const { error } = await supabase
      .from('collab_requests')
      .update({ status: 'DECLINED' })
      .eq('id', collabId)
      .eq('receiver_id', artist.id);

    if (error) throw error;

    revalidatePath('/studio/collabs');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return { success: false, error: message };
  }
}

export async function sendCollabRequest(data: { 
  receiverId: string, 
  projectTitle: string, 
  message: string, 
  collabType: string, 
  dealType: string,
  splitPercent: number,
  demoUrl?: string
}) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

    const { data: collab, error } = await supabase
      .from('collab_requests')
      .insert({
        requester_id: artist.id,
        receiver_id: data.receiverId,
        project_title: data.projectTitle,
        message: data.message,
        collab_type: data.collabType,
        deal_type: data.dealType,
        receiver_split_percent: data.splitPercent,
        requester_split_percent: 100 - data.splitPercent,
        status: 'PENDING',
        demo_url: data.demoUrl,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/studio/collabs');
    return { success: true, collab };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return { success: false, error: message };
  }
}
