import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
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

    AppleProvider({
      clientId:     process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id   = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string
        (session.user as any).role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // On Google/Apple sign-in, set default role to FAN
      // Artist OAuth sign-in handled separately below
      if (account?.provider === 'google' || account?.provider === 'apple') {
        // User is automatically created by PrismaAdapter
        // Set role to FAN if new user
        const existing = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        if (!existing?.role) {
          await prisma.user.update({
            where: { email: user.email! },
            data:  { role: 'FAN' }
          })
        }
      }
      return true
    }
  },
})
