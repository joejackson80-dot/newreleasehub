import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

/**
 * Server-side utility to retrieve the currently authenticated artist.
 * Reads the `nrh_artist_id` cookie set during login.
 * Redirects to /studio/login if no valid session exists.
 */
export async function getSessionArtist(opts?: { 
  includeReleases?: boolean; 
  includeSupporters?: boolean;
  includeParticipation?: boolean;
}) {
  const cookieStore = await cookies();
  const artistId = cookieStore.get('nrh_artist_id')?.value;

  if (!artistId) {
    redirect('/studio/login');
  }

  const org = await prisma.organization.findUnique({
    where: { id: artistId },
    include: {
      Releases: opts?.includeReleases ? { orderBy: { createdAt: 'desc' } } : false,
      SupporterSubscriptions: opts?.includeSupporters ? { where: { status: 'ACTIVE' } } : false,
      SupporterTiers: opts?.includeSupporters ? { orderBy: { priceCents: 'asc' } } : false,
      ParticipationLicenses: opts?.includeParticipation ? { orderBy: { createdAt: 'desc' } } : false,
      DeviceSessions: true,
    }
  });

  if (!org) {
    redirect('/studio/login');
  }

  return org;
}

/**
 * Lightweight check — just returns the artist ID or null.
 */
export async function getSessionArtistId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('nrh_artist_id')?.value || null;
}

/**
 * Server-side utility to retrieve the currently authenticated fan.
 * Reads the `nrh_user_id` cookie set during login.
 * Redirects to /fan/login if no valid session exists.
 */
export async function getSessionFan() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('nrh_user_id')?.value;

  if (!userId) {
    redirect('/fan/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect('/fan/login');
  }

  return user;
}

/**
 * Lightweight check — just returns the fan user ID or null.
 */
export async function getSessionFanId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('nrh_user_id')?.value || null;
}


