'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSessionArtist } from '@/lib/session';

export async function applyForOpportunity(data: {
  opportunityId: string,
  pitch: string
}) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return { success: false, error: 'Artist session required' };

    // Check if already applied
    const existing = await prisma.opportunityApplication.findFirst({
      where: {
        opportunityId: data.opportunityId,
        artistId: artist.id
      }
    });

    if (existing) return { success: false, error: 'Application already submitted for this initiative.' };

    const application = await prisma.opportunityApplication.create({
      data: {
        opportunityId: data.opportunityId,
        artistId: artist.id,
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
  comment?: string
}) {
   try {
      const artist = await getSessionArtist();
      if (!artist) return { success: false, error: 'Artist session required for governance participation.' };

      // Check if already voted
      const existing = await prisma.opportunityApplication.findFirst({
        where: {
          opportunityId: data.oppId,
          artistId: artist.id
        }
      });

      if (existing) return { success: false, error: 'Vote already recorded in protocol ledger.' };

      const application = await prisma.opportunityApplication.create({
         data: {
            opportunityId: data.oppId,
            artistId: artist.id,
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
