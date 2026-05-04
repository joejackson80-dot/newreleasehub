import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Organization } from '@prisma/client';

/**
 * Server-side utility to retrieve the currently authenticated artist.
 * Checks both NextAuth session and the legacy `nrh_artist_id` cookie.
 */
export async function getSessionArtist(opts?: { 
  includeReleases?: boolean; 
  includeSupporters?: boolean;
  includeParticipation?: boolean;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const artistIdFromCookie = cookieStore.get('nrh_artist_id')?.value;

  let artistId = artistIdFromCookie;

  // Prioritize NextAuth session if it's an ARTIST
  if (session?.user?.id && session.user.role === 'ARTIST') {
    artistId = session.user.id;
  } else if (session?.user?.id && session.user.role === 'FAN' && !artistIdFromCookie) {
    // If they are logged in as a FAN but trying to access ARTIST portal, redirect to login
    redirect('/studio/login');
  }

  if (!artistId) {
    redirect('/studio/login');
  }

  // Handle Demo Account Bypass
  if (artistId === 'demo-artist-id' || artistId === 'iamjoejack') {
    const org = await prisma.organization.findUnique({
      where: { id: artistId === 'demo-artist-id' ? 'demo-artist-id' : artistId },
      include: {
        Releases: opts?.includeReleases ? { orderBy: { createdAt: 'desc' } } : false,
        SupporterSubscriptions: opts?.includeSupporters ? { where: { status: 'ACTIVE' } } : false,
        SupporterTiers: opts?.includeSupporters ? { orderBy: { priceCents: 'asc' } } : false,
        ParticipationLicenses: opts?.includeParticipation ? { orderBy: { createdAt: 'desc' } } : false,
        DeviceSessions: true,
      }
    });

    if (org) return org;

    // Hardcoded fallback if DB record is missing
    return {
      id: 'demo-artist-id',
      name: 'Joe Jackson',
      username: 'iamjoejack',
      email: 'joe@newreleasehub.com',
      slug: 'iamjoejack',
      role: 'ARTIST',
      planTier: 'ELITE',
      isPublic: true,
      Releases: [],
      SupporterSubscriptions: [],
      SupporterTiers: [],
      ParticipationLicenses: [],
      DeviceSessions: []
    } as unknown as Organization;
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
  const session = await auth();
  if (session?.user?.id && session.user.role === 'ARTIST') {
    return session.user.id;
  }
  const cookieStore = await cookies();
  return cookieStore.get('nrh_artist_id')?.value || null;
}

/**
 * Server-side utility to retrieve the currently authenticated fan.
 * Checks both NextAuth session and the legacy `nrh_user_id` cookie.
 */
export async function getSessionFan() {
  const session = await auth();
  const cookieStore = await cookies();
  const userIdFromCookie = cookieStore.get('nrh_user_id')?.value;

  let userId = userIdFromCookie;

  if (session?.user?.id && session.user.role === 'FAN') {
    userId = session.user.id;
  }

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
  const session = await auth();
  if (session?.user?.id && session.user.role === 'FAN') {
    return session.user.id;
  }
  const cookieStore = await cookies();
  return cookieStore.get('nrh_user_id')?.value || null;
}


