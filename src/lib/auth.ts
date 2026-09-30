import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/db'
import type { AdminUser } from '@/types/database'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = String(credentials.email)
        const password = String(credentials.password)

        const user = await queryOne<AdminUser>(
          'SELECT id, email, password_hash FROM admin_users WHERE email = $1 LIMIT 1',
          [email]
        )

        if (!user || !user.password_hash) {
          return null
        }

        const isValid = await bcrypt.compare(password, user.password_hash)
        if (!isValid) {
          return null
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.email.split('@')[0],
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // user.role comes from the authorize() return value
        token.role = (user as { role?: string }).role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as unknown as Record<string, unknown>).role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'gts-super-secret-key-hardware-b2b-2024',
})
