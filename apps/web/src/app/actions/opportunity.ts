'use server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createOpportunity(formData: FormData) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Unauthorized' };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const budget = formData.get('budget') as string;
    const deadlineStr = formData.get('deadline') as string;
    const genresStr = formData.get('genres') as string;

    if (!title || !description || !type) {
      return { success: false, error: 'Missing required fields' };
    }

    const supabase = await createClient();

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .insert({
        poster_id: artist.id,
        poster_name: artist.name,
        poster_is_verified: artist.isVerified,
        title,
        description,
        type,
        budget,
        deadline: deadlineStr ? new Date(deadlineStr).toISOString() : null,
        genre_targets: genresStr ? genresStr.split(',').map(s => s.trim()) : [],
        status: 'OPEN'
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/network/board');
    revalidatePath('/studio/opportunities');
    
    return { success: true, opportunity };
  } catch (error: unknown) {
    console.error('Create opportunity error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return { success: false, error: message };
  }
}
