import { createAdminClient } from './supabase/admin';

export async function createNotification(
  userId: string, 
  userType: 'FAN' | 'ARTIST', 
  type: string, 
  title: string, 
  body: string, 
  link?: string
) {
  const supabase = createAdminClient();
  return await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      user_type: userType.toLowerCase(),
      type,
      title,
      body,
      link,
      is_read: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
}

export async function notifyArtistMilestone(artistId: string, milestoneType: string, cardImageUrl: string | null) {
  const milestoneLabel = milestoneType.replace(/_/g, ' ');
  return await createNotification(
    artistId,
    'ARTIST',
    'MILESTONE',
    'New Milestone Achieved!',
    `Congratulations! You've reached the ${milestoneLabel} milestone. ${cardImageUrl ? 'View your card here: ' + cardImageUrl : ''}`,
    '/studio/milestones'
  );
}
