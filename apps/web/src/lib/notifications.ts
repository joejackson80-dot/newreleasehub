import { prisma } from './prisma';

export async function createNotification(userId: string, userType: 'FAN' | 'ARTIST', type: string, title: string, body: string, link?: string) {
  return await prisma.notification.create({
    data: {
      userId,
      userType,
      type,
      title,
      body,
      link,
      isRead: false
    }
  });
}

export async function notifyArtistMilestone(artistId: string, milestoneType: string, cardImageUrl: string | null) {
  const milestoneLabel = milestoneType.replace(/_/g, ' ');
  return await createNotification(
    artistId,
    'ARTIST',
    'MILESTONE',
    'New Milestone Achieved!',
    `Congratulations! You've reached the ${milestoneLabel} milestone. View and share your card now.`,
    '/studio/milestones'
  );
}
