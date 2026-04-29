'use server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function acceptCollabDeal(collabId: string) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Unauthorized' };

    // Update collab status to ACCEPTED
    const collab = await prisma.collabRequest.update({
      where: { id: collabId, receiverId: artist.id },
      data: { status: 'ACCEPTED' }
    });

    // We might also create a Collaboration record or split agreement here
    
    revalidatePath('/studio/collabs');
    return { success: true, collab };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function declineCollabDeal(collabId: string) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Unauthorized' };

    await prisma.collabRequest.update({
      where: { id: collabId, receiverId: artist.id },
      data: { status: 'DECLINED' }
    });

    revalidatePath('/studio/collabs');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
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

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

    const collab = await prisma.collabRequest.create({
      data: {
        requesterId: artist.id,
        receiverId: data.receiverId,
        projectTitle: data.projectTitle,
        message: data.message,
        collabType: data.collabType as any,
        dealType: data.dealType as any,
        receiverSplitPercent: data.splitPercent,
        requesterSplitPercent: 100 - data.splitPercent,
        status: 'PENDING',
        demoUrl: data.demoUrl,
        expiresAt
      }
    });

    revalidatePath('/studio/collabs');
    return { success: true, collab };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
