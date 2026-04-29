'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function loginArtist(identifier: string, password: string) {
  try {
    // DEMO MODE FALLBACK
    if (identifier === 'iamjoejack' && password === 'Password123') {
      const demoArtist = await prisma.organization.findFirst({
        where: { username: 'iamjoejack' }
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
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function loginFan(identifier: string, password: string) {
  try {
    // DEMO MODE FALLBACK
    if (identifier === 'johndoe' && password === 'Password123') {
      const demoFan = await prisma.user.findFirst({
        where: { username: 'johndoe' }
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
  } catch (error: any) {
    console.error('Login error:', error);
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


