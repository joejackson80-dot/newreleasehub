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

export async function registerArtist(data: { email: string, username: string, name: string, password: string }) {
  try {
    const existing = await prisma.organization.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    });

    if (existing) {
      return { success: false, error: 'Email or username already in use' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const artist = await prisma.organization.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        slug: data.username.toLowerCase(),
        passwordHash,
        isPublic: false, // Start hidden until they set up their profile
      }
    });

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
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function registerFan(data: { email: string, username: string, displayName: string, password: string }) {
  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
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
        role: 'fan',
      }
    });

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
  } catch (error: any) {
    console.error('Registration error:', error);
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
  } catch (error: any) {
    console.error('Reset password error:', error);
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
  } catch (error: any) {
    console.error('Reset password error:', error);
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


