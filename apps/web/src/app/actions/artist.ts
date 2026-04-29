'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function applyForOpportunity(data: {
  opportunityId: string,
  artistId: string,
  pitch: string
}) {
  try {
    const application = await prisma.opportunityApplication.create({
      data: {
        opportunityId: data.opportunityId,
        artistId: data.artistId,
        pitch: data.pitch
      }
    });

    // Increment applicant count
    await prisma.opportunity.update({
      where: { id: data.opportunityId },
      data: { applicantCount: { increment: 1 } }
    });

    revalidatePath('/network/board');
    return { success: true, application };
  } catch (error: any) {
    console.error('Apply for opportunity error:', error);
    return { success: false, error: error.message };
  }
}

export async function voteOnProposal(data: {
  oppId: string,
  voteType: string,
  comment?: string,
  userId: string
}) {
   try {
      // In a real app, we'd check if the user already voted
      // For demo, we just record it as an application with special pitch
      const application = await prisma.opportunityApplication.create({
         data: {
            opportunityId: data.oppId,
            artistId: 'session-artist-id', // Would be real artist ID from session
            pitch: `VOTE:${data.voteType}|COMMENT:${data.comment || ''}`
         }
      });

      await prisma.opportunity.update({
         where: { id: data.oppId },
         data: { applicantCount: { increment: 1 } }
      });

      revalidatePath('/network/board');
      return { success: true };
   } catch (error: any) {
      console.error('Vote error:', error);
      return { success: false, error: error.message };
   }
}
