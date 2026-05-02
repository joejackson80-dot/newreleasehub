'use server';

import { prisma } from '@/lib/prisma';
import { getSessionFan } from '@/lib/session';
import { getSessionArtist } from '@/lib/session';

export async function sendChatMessage(orgId: string, text: string) {
  try {
    let userDisplayName = 'Anonymous';
    
    // Try to get fan session first
    try {
      const fan = await getSessionFan();
      userDisplayName = fan.displayName || fan.username || 'Anonymous Fan';
    } catch (e) {
      // If not fan, try artist
      try {
        const artist = await getSessionArtist();
        userDisplayName = artist.name;
      } catch (e2) {
        // Fallback to anonymous
      }
    }

    const message = await prisma.chatMessage.create({
      data: {
        organizationId: orgId,
        user: userDisplayName,
        text,
        platform: 'NRH'
      }
    });

    return { success: true, message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


