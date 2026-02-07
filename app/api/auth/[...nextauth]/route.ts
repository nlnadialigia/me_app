import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import type { Session } from 'next-auth';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;

        // Try to find a user in the database and verify hashed password
        try {
          const user = await (prisma as any).user.findUnique({ where: { email } });
          if (user && user.password) {
            const match = await bcrypt.compare(password, user.password);
            if (match) return { id: user.id, email: user.email };
          }
        } catch (e) {
          // ignore if query fails
        }

        // Fallback to ADMIN_EMAIL / ADMIN_PASSWORD env vars
        if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
          if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            return { id: 'admin', email };
          }
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any; }) {
      if (user) (token as any).user = user;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT; }) {
      if ((token as any).user) (session as any).user = (token as any).user;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
