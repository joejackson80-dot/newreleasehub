'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';
import { signIn } from '@/auth';

export async function signInWithGoogle(role: string, callbackUrl: string) {
  await signIn('google', { redirectTo: callbackUrl });
}

export async function loginArtist(identifier: string, password: string) {
  try {
    // DEMO MODE FALLBACK
    const isDemo = (identifier.toLowerCase() === 'iamjoejack' || identifier.toLowerCase() === 'joe@example.com') && password === 'Password123';
    
    if (isDemo) {
      const demoArtist = await prisma.organization.findFirst({
        where: { OR: [{ username: 'iamjoejack' }, { email: 'joe@example.com' }] }
      });
      
      if (demoArtist) {
        const cookieStore = await cookies();
        cookieStore.set('nrh_artist_session', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        });
        cookieStore.set('nrh_artist_id', demoArtist.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        });
        return { success: true };
      }
    }

    const artist = await prisma.organization.findFirst({
      where: {
        OR: [
          { username: { equals: identifier, mode: 'insensitive' } },
          { email: { equals: identifier, mode: 'insensitive' } }
        ]
      }
    });

    if (!artist || !artist.passwordHash) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValid = await bcrypt.compare(password, artist.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('nrh_artist_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    // Also set artist ID for server-side checks
    cookieStore.set('nrh_artist_id', artist.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Login error:', error instanceof Error ? error.message : error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function loginFan(identifier: string, password: string) {
  try {
    // DEMO MODE FALLBACK
    const isDemo = (identifier.toLowerCase() === 'johndoe' || identifier.toLowerCase() === 'johndoe@example.com') && password === 'Password123';
    
    if (isDemo) {
      const demoFan = await prisma.user.findFirst({
        where: { OR: [{ username: 'johndoe' }, { email: 'johndoe@example.com' }] }
      });
      
      if (demoFan) {
        const cookieStore = await cookies();
        cookieStore.set('nrh_user_session', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        });
        cookieStore.set('nrh_user_id', demoFan.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        });
        return { success: true };
      }
    }

    const fan = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: identifier, mode: 'insensitive' } },
          { email: { equals: identifier, mode: 'insensitive' } }
        ]
      }
    });

    if (!fan || !fan.passwordHash) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValid = await bcrypt.compare(password, fan.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('nrh_user_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    cookieStore.set('nrh_user_id', fan.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Login error:', error instanceof Error ? error.message : error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function registerArtist(data: { email: string, username: string, name: string, password: string, planTier?: 'FREE' | 'PRO' | 'ELITE' }) {
  try {
    const existingOrg = await prisma.organization.findFirst({
      where: {
        OR: [
          { email: { equals: data.email, mode: 'insensitive' } },
          { username: { equals: data.username, mode: 'insensitive' } }
        ]
      }
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingOrg || existingUser) {
      return { success: false, error: 'Email or username already in use' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const slug = data.username.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    // Create BOTH Organization and User to allow NextAuth login
    const [artist, user] = await prisma.$transaction([
      prisma.organization.create({
        data: {
          email: data.email,
          username: data.username,
          name: data.name,
          slug: slug,
          passwordHash,
          planTier: data.planTier || 'FREE',
          isPublic: false,
          role: 'ARTIST'
        }
      }),
      prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          name: data.name,
          passwordHash,
          role: 'ARTIST',
          artistId: 'pending' // We'll link these properly later or use email as link
        }
      })
    ]);

    // Update user with the actual artist ID
    await prisma.user.update({
      where: { id: user.id },
      data: { artistId: artist.id }
    });

    console.log(`New Artist registered: ${artist.email} (${artist.id})`);

    if (data.email) {
      sendWelcomeEmail({ to: data.email, name: data.name }).catch(console.error);
    }

    // Set legacy cookies for backward compatibility if needed
    const cookieStore = await cookies();
    cookieStore.set('nrh_artist_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    
    cookieStore.set('nrh_artist_id', artist.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Registration error:', error instanceof Error ? error.message : error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function registerFan(data: { email: string, username: string, displayName: string, password: string }) {
  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: data.email, mode: 'insensitive' } },
          { username: { equals: data.username, mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      return { success: false, error: 'Email or username already in use' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const fan = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        passwordHash,
        role: 'FAN',
      }
    });

    console.log(`New Fan registered: ${fan.email} (${fan.id})`);

    // Send Welcome Email
    if (data.email) {
      sendWelcomeEmail({ to: data.email, name: data.displayName }).catch(console.error);
    }

    const cookieStore = await cookies();
    cookieStore.set('nrh_user_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    
    cookieStore.set('nrh_user_id', fan.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Registration error:', error instanceof Error ? error.message : error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function resetArtistPassword(email: string, newPassword: string) {
  try {
    const artist = await prisma.organization.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (!artist) {
      // Return success anyway to prevent email enumeration, but for MVP testing we can be explicit
      return { success: false, error: 'Account not found' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.organization.update({
      where: { id: artist.id },
      data: { passwordHash }
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Reset password error:', error instanceof Error ? error.message : error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function resetFanPassword(email: string, newPassword: string) {
  try {
    const fan = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (!fan) {
      return { success: false, error: 'Account not found' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: fan.id },
      data: { passwordHash }
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Reset password error:', error instanceof Error ? error.message : error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('nrh_artist_session');
  cookieStore.delete('nrh_artist_id');
  cookieStore.delete('nrh_user_session');
  cookieStore.delete('nrh_user_id');
  return { success: true };
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const artistId = cookieStore.get('nrh_artist_id')?.value;
  const userId = cookieStore.get('nrh_user_id')?.value;

  if (artistId) {
    const artist = await prisma.organization.findUnique({
      where: { id: artistId },
      select: { id: true, name: true, username: true, slug: true, role: true }
    });
    if (artist) return { type: 'artist', data: artist };
  }

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, displayName: true, username: true, role: true }
    });
    if (user) return { type: 'user', data: user };
  }

  return null;
}


