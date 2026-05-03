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
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? 'FAN', // Role can be injected via authorization params if needed
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
        token.id   = user.id
        token.role = (user as any).role
      }
      // Handle session updates if needed
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.id as string
        (session.user as any).role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // url is the callbackUrl passed to signIn or the target URL
      // If it's a relative URL, append baseUrl
      let target = url.startsWith('/') ? `${baseUrl}${url}` : url;

      // Role-based logic: if we're just landing at the root or login,
      // we should redirect based on the user's role.
      // Note: we don't have access to the session here easily, 
      // so we rely on the callbackUrl being passed correctly from the UI.
      
      return target;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        // If they are new, we need to decide their role.
        // We can check if they were referred from a studio URL or if we passed a role hint.
        if (!existing) {
          // Default to FAN, but the UI passes ?role=artist in callbackUrl
          // Since we can't easily read callbackUrl here, we'll allow them to land
          // and then the first time they hit /studio, we can upgrade them if they have no role.
          // However, for the best UX, we'll try to guess based on the 'role' field in the profile
          // if we managed to inject it (GoogleProvider profile callback).
          
          const targetRole = (profile as any)?.role === 'ARTIST' ? 'ARTIST' : 'FAN';
          
          await prisma.user.upsert({
            where: { email: user.email! },
            create: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: targetRole as any
            },
            update: {
              // Don't overwrite existing roles
            }
          })
        }
      }
      return true
    }
  },
})
