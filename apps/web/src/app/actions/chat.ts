'use server';
import { createClient } from '@/lib/supabase/server';
import { getSessionFan } from '@/lib/session';
import { getSessionArtist } from '@/lib/session';

export async function sendChatMessage(orgId: string, text: string) {
  try {
    let userDisplayName = 'Anonymous';
    let badge = null;
    
    // Try to get fan session first
    const fan = await getSessionFan();
    if (fan) {
      userDisplayName = fan.displayName || fan.username || 'Anonymous Fan';
      badge = fan.fanLevel ? `Level ${fan.fanLevel}` : null;
    } else {
      // If not fan, try artist
      const artist = await getSessionArtist();
      if (artist) {
        userDisplayName = artist.name;
        badge = 'ARTIST';
      }
    }

    const supabase = await createClient();
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        organization_id: orgId,
        user: userDisplayName,
        text,
        platform: 'NRH',
        badge: badge
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, message };
  } catch (error: unknown) {
    console.error('Send chat message error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return { success: false, error: message };
  }
}
