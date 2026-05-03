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
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role:     { label: 'Role', type: 'text' }, // FAN | ARTIST
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const input = credentials.username as string
        const role  = (credentials.role as string || 'FAN').toUpperCase()

        // Find user by email or username
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email:    input.toLowerCase() },
              { username: input }
            ]
          }
        })

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!valid) return null

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
    signIn:  '/login',   // default sign-in page
    error:   '/login',   // redirect here on error
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as any).role
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
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        // If they are new, we need to decide their role.
        // We will default to FAN, but if the URL contains "portal=studio", we set ARTIST.
        if (!existing) {
          // This is a bit of a hack because NextAuth doesn't pass the callbackUrl here easily,
          // but we can check if they are being created and we'll handle the role in the 
          // first session or just keep it as FAN and let the onboarding handle it.
          // For now, I will let the default stand and fix the button to pass the intent.
          return true
        }
      }
      return true
    }
  },
})
