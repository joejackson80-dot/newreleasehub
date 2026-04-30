'use server';
import prisma from '@/lib/prisma';
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

    const release = await prisma.release.create({
      data: {
        organizationId: org.id,
        title: formData.title,
        type: formData.type.toLowerCase(),
        coverArtUrl: formData.coverArtUrl || '/images/default-cover.png',
        authorizedForRadio: formData.authorizedForRadio,
        trackCount: 1, // Default for single
      }
    });

    // Create a corresponding MusicAsset (the master track)
    await prisma.musicAsset.create({
      data: {
        organizationId: org.id,
        releaseId: release.id,
        title: formData.title,
        imageUrl: formData.coverArtUrl || '/images/default-cover.png',
        isLive: true,
      }
    });

    revalidatePath('/studio/releases');
    return { success: true, release };
  } catch (error) {
    console.error('Failed to create release', error);
    return { success: false, error: 'Database error' };
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

    await prisma.organization.update({
      where: { id: org.id },
      data: {
        name: data.name,
        bio: data.bio,
        city: data.city,
        country: data.country,
        profileImageUrl: data.profileImageUrl
      }
    });

    revalidatePath('/studio/settings');
    revalidatePath(`/${org.slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update artist profile', error);
    return { success: false, error: 'Database error' };
  }
}
