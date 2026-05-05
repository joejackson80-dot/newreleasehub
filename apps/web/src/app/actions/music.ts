'use server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createRelease(formData: {
  title: string;
  type: string;
  genre: string;
  coverArtUrl?: string;
  authorizedForRadio: boolean;
}) {
  try {
    const org = await getSessionArtist();
    if (!org) return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();

    const { data: release, error: releaseError } = await supabase
      .from('releases')
      .insert({
        organization_id: org.id,
        title: formData.title,
        type: formData.type.toLowerCase(),
        cover_art_url: formData.coverArtUrl || '/images/default-cover.png',
        authorized_for_radio: formData.authorizedForRadio,
        track_count: 1, // Default for single
      })
      .select()
      .single();

    if (releaseError) throw releaseError;

    // Create a corresponding Track (the master track)
    const { error: trackError } = await supabase
      .from('tracks')
      .insert({
        organization_id: org.id,
        release_id: release.id,
        title: formData.title,
        image_url: formData.coverArtUrl || '/images/default-cover.png',
        is_live: true,
      });

    if (trackError) throw trackError;

    revalidatePath('/studio/releases');
    return { success: true, release };
  } catch (error: unknown) {
    console.error('Failed to create release', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return { success: false, error: message };
  }
}

export async function updateArtistProfile(data: {
  name?: string;
  bio?: string;
  city?: string;
  country?: string;
  profileImageUrl?: string;
}) {
  try {
    const org = await getSessionArtist();
    if (!org) return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();

    const { error } = await supabase
      .from('organizations')
      .update({
        name: data.name,
        bio: data.bio,
        city: data.city,
        country: data.country,
        profile_image_url: data.profileImageUrl
      })
      .eq('id', org.id);

    if (error) throw error;

    revalidatePath('/studio/settings');
    if (org.slug) {
      revalidatePath(`/${org.slug}`);
    }
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to update artist profile', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return { success: false, error: message };
  }
}
