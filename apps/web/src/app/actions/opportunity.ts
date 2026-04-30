'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function createOpportunity(formData: FormData) {
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

  try {
    const opportunity = await prisma.opportunity.create({
      data: {
        posterId: artist.id,
        posterName: artist.name,
        posterIsVerified: artist.isVerified,
        title,
        description,
        type,
        budget,
        deadline: deadlineStr ? new Date(deadlineStr) : null,
        genreTargets: genresStr ? genresStr.split(',').map(s => s.trim()) : [],
        status: 'OPEN'
      }
    });

    revalidatePath('/network/board');
    revalidatePath('/studio/opportunities');
    
    return { success: true, opportunity };
  } catch (error: any) {
    console.error('Create opportunity error:', error);
    return { success: false, error: error.message };
  }
}
