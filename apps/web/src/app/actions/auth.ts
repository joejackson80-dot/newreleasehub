'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';
import { signIn } from '@/auth';

export async function signInWithGoogle(role: string, callbackUrl: string) {
  await signIn('google', { 
    redirectTo: callbackUrl,
    authorization: { params: { role } }
  });
}

export async function loginArtist(identifier: string, password: string) {
  try {
    // DEMO MODE FALLBACK
    const isDemo = (identifier.toLowerCase() === 'iamjoejack' || identifier.toLowerCase() === 'joe@example.com' || identifier.toLowerCase() === 'joe@newreleasehub.com') && password === 'Password123';
    
    if (isDemo) {
      await signIn('credentials', { 
        username: identifier, 
        password: password,
        redirect: false 
      });
      return { success: true };
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

    // Perform modern NextAuth sign in
    const signInResult = await signIn('credentials', {
      username: identifier,
      password: password,
      redirect: false
    });

    return { success: true };

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

    // Perform modern NextAuth sign in
    await signIn('credentials', {
      username: identifier,
      password: password,
      redirect: false
    });

    return { success: true };

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

    // Automatically sign in the new user
    await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false
    });

    return { success: true };

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

    // Automatically sign in the new user
    await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Registration error:', error instanceof Error ? error.message : error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    const org = await prisma.organization.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });

    if (!user && !org) {
      // Return success even if not found to prevent email enumeration
      return { success: true };
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { resetToken, resetTokenExpires } });
    }
    if (org) {
      await prisma.organization.update({ where: { id: org.id }, data: { resetToken, resetTokenExpires } });
    }

    // Send the email (Mocked for now if RESEND_API_KEY is missing)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const { sendEmail } = await import('@/lib/email');
    await sendEmail({
      to: email,
      subject: 'Reset Your Password - New Release Hub',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background: #020202; color: white; padding: 40px; border-radius: 20px;">
          <h2 style="color: #A855F7; text-transform: uppercase; font-style: italic;">Password Recovery</h2>
          <p>You requested a password reset for your New Release Hub account.</p>
          <p>Click the button below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; background: #A855F7; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; margin: 20px 0;">Reset Password</a>
          <p style="font-size: 10px; color: #555;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Password reset request error:', error);
    return { success: false, error: 'Failed to process request' };
  }
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  try {
    const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });
    const org = await prisma.organization.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });

    if (!user && !org) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, resetToken: null, resetTokenExpires: null }
      });
    }
    if (org) {
      await prisma.organization.update({
        where: { id: org.id },
        data: { passwordHash, resetToken: null, resetTokenExpires: null }
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Failed to reset password' };
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
  const session = await auth();
  if (!session?.user) return null;

  return { 
    type: session.user.role?.toLowerCase() || 'user', 
    data: session.user 
  };
}


