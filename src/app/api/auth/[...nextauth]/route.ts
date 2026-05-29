import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { executeQuery, executeInsert } from '@/lib/db';
import { User } from '@/types';

const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Credentials (Email/Password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const users = await executeQuery<User>(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          );

          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          // In production, compare hashed passwords
          // For now, just checking if password matches (NOT SECURE - USE BCRYPT!)
          // const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          // Mock password check - REPLACE WITH ACTUAL BCRYPT
          if (credentials.password === process.env.DEMO_PASSWORD) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'buyer';
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      // Handle social login - create user if not exists
      if (account?.type === 'oauth') {
        try {
          const users = await executeQuery<User>(
            'SELECT * FROM users WHERE email = ?',
            [user.email]
          );

          if (users.length === 0) {
            // Create new user
            await executeInsert(
              'INSERT INTO users (email, name, image, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
              [user.email, user.name, user.image, 'buyer']
            );
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
