import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile, tokens) {
        // tokens.params might contain our role hint in some providers, 
        // but typically we'll use a specific logic in the signIn callback.
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'FAN', // Default, will be refined in signIn callback
        }
      }
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role:     { label: 'Role', type: 'text' }, // Optional hint
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.warn('[AUTH] Missing credentials');
          return null;
        }

        const identifier = credentials.username as string;
        console.log(`[AUTH] Attempting login for: ${identifier}`);

        // Find user by email or username (Case-Insensitive)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email:    { equals: identifier.toLowerCase(), mode: 'insensitive' } },
              { username: { equals: identifier, mode: 'insensitive' } }
            ]
          }
        })

        if (!user) {
          console.warn(`[AUTH] User not found: ${identifier}`);
          return null;
        }

        if (!user.passwordHash) {
          console.warn(`[AUTH] User has no password (likely OAuth only): ${identifier}`);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        console.log(`[AUTH] Password valid: ${isValid}`);

        if (!isValid) return null;

        return {
          id:    user.id,
          email: user.email,
          name:  user.name || user.displayName,
          role:  user.role,
        }
      }
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn:  '/login',
    error:   '/login',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.username = (user as any).username
      }
      // Handle session updates if needed
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.username = token.username as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        // If they already exist, we DO NOT change their role.
        if (existing) {
          return true
        }

        // Detect intent from referer or implicit role hint passed in authorization params
        // Since profile/account structure can vary, we'll check if a role was injected
        const targetRole = (account as any)?.role === 'ARTIST' ? 'ARTIST' : 'FAN';

        // NOTE: In the UI we passed { role: 'ARTIST' } as the 3rd arg to signIn()
        // which puts it in account.params if configured, but let's be safe.
        // If we can't detect it, we default to FAN.
        
        await prisma.user.upsert({
          where: { email: user.email! },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            role: targetRole as any
          },
          update: {}
        })
      }
      return true
    }
  },
})
