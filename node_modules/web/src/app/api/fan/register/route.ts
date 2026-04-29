import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Check if email or username already taken
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: 'insensitive' } },
          { username: { equals: username, mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email or username already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        displayName: username,
        crate: [],
      }
    });

    // Send welcome email (async, don't wait to block response)
    sendWelcomeEmail(email, username).catch(err => console.error('Failed to send welcome email:', err));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Fan Registration Error]', error);
    return NextResponse.json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}


