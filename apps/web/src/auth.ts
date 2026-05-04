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
      profile(profile) {
        // We'll return the base profile here.
        // The role will be refined in the signIn callback where we have more context.
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'FAN', 
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

        const identifier = (credentials.username as string || "").trim();
        const password = (credentials.password as string || "").trim();
        
        console.error(`[AUTH_DEBUG] Raw Identifier: "${identifier}" (len: ${identifier.length})`);
        console.error(`[AUTH_DEBUG] Raw Password: (len: ${password.length})`);

        // DEMO MODE FALLBACK - Be extremely permissive with capitalization for demo
        const isDemoId = [
          'iamjoejack', 
          'joe@example.com', 
          'joe@newreleasehub.com', 
          'joejackson80'
        ].includes(identifier.toLowerCase());
        
        const isDemoPw = password === 'Password123' || password.toLowerCase() === 'password123';
        const isDemo = isDemoId && isDemoPw;
        
        console.error(`[AUTH_DEBUG] isDemoId: ${isDemoId}, isDemoPw: ${isDemoPw}, isDemo: ${isDemo}`);

        if (isDemo) {
          console.error(`[AUTH_DEBUG] SUCCESS: Demo bypass triggered for ${identifier}`);
          return {
            id: 'demo-artist-id',
            email: 'joe@newreleasehub.com',
            name: 'Joe Jackson',
            role: 'ADMIN',
            username: 'iamjoejack'
          }
        }

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
        token.role = (user as any).role // eslint-disable-line @typescript-eslint/no-explicit-any
        token.username = (user as any).username // eslint-disable-line @typescript-eslint/no-explicit-any
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
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (existing) {
          // If the user already exists, we ensure the token and session get their real role
          (user as any).role = existing.role; // eslint-disable-line @typescript-eslint/no-explicit-any
          return true;
        }

        // If they are brand new, detect the intended role
        // NextAuth v5 passes authorization params to account.role if we configured it,
        // but here we'll use a safer fallback: check the referer or just default to FAN.
        // Actually, we'll use a hack: if we're on the server, we can check the request URL
        // but since we're in a callback, we'll rely on the default and they can upgrade.
        
        // Detect intended role from authorization params or referer
        const params = (account as any)?.authorization_details || (account as any)?.params || {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        const targetRole = params.role === 'ARTIST' ? 'ARTIST' : 'FAN';
        (user as any).role = targetRole; // eslint-disable-line @typescript-eslint/no-explicit-any

        // Since we're using the PrismaAdapter, NextAuth will create the user.
        // We just need to make sure the object we return HAS the role.
      }
      return true
    }
  },
})
