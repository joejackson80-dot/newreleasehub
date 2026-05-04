import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

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
        const password = (credentials.password as string || "");
        
        console.error(`[AUTH_DEBUG] Attempt: "${identifier}" | PwLen: ${password.length}`);

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

        // Find user by email or username (Case-Insensitive) in BOTH tables
        let dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email:    { equals: identifier.toLowerCase(), mode: 'insensitive' } },
              { username: { equals: identifier, mode: 'insensitive' } }
            ]
          }
        });

        let dbOrg = null;
        if (!dbUser) {
          dbOrg = await prisma.organization.findFirst({
            where: {
              OR: [
                { email:    { equals: identifier.toLowerCase(), mode: 'insensitive' } },
                { username: { equals: identifier, mode: 'insensitive' } }
              ]
            }
          });
        }

        if (!dbUser && !dbOrg) {
          console.warn(`[AUTH] No user or organization found for: ${identifier}`);
          return null;
        }

        const target = dbUser || dbOrg;
        if (!target?.passwordHash) {
          console.warn(`[AUTH] Identity found but has no password: ${identifier}`);
          return null;
        }

        const isValid = await bcrypt.compare(password, target.passwordHash);
        console.error(`[AUTH_DEBUG] Password for ${identifier} valid: ${isValid}`);
        if (!isValid) return null;

        // If we found them in Org but not User, we need to create a User record on the fly
        // to satisfy the Prisma Adapter and provide a modern session.
        if (!dbUser && dbOrg) {
          try {
            dbUser = await prisma.user.create({
              data: {
                email: dbOrg.email,
                username: dbOrg.username,
                name: dbOrg.name,
                passwordHash: dbOrg.passwordHash,
                role: 'ARTIST',
                artistId: dbOrg.id
              }
            });
            console.log(`[AUTH] Synchronized legacy organization ${dbOrg.email} to modern User table`);
          } catch (err) {
            console.error(`[AUTH] Failed to sync organization to user table:`, err);
          }
        }

        if (!dbUser) return null;

        return {
          id:    dbUser.id,
          email: dbUser.email,
          name:  dbUser.name || dbUser.displayName,
          role:  dbUser.role,
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
