import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Credentials (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const providedPassword = credentials.password;
        const demoPassword = process.env.DEMO_PASSWORD || "demo123";
        const isDemoAccount =
          normalizedEmail === "buyer@farmmart.ng" ||
          normalizedEmail === "seller@farmmart.ng";
        const demoRole =
          normalizedEmail === "seller@farmmart.ng" ? "SELLER" : "BUYER";
        const demoName =
          normalizedEmail === "seller@farmmart.ng"
            ? "Demo Seller"
            : "Demo Buyer";

        try {
          let user = await prisma.users.findUnique({
            where: { email: normalizedEmail },
          });

          if (!user && isDemoAccount && providedPassword === demoPassword) {
            const hashedPassword = await bcrypt.hash(providedPassword, 12);

            user = await prisma.users.create({
              data: {
                email: normalizedEmail,
                name: demoName,
                password: hashedPassword,
                role: demoRole,
                firebase_uid: `demo_${demoRole.toLowerCase()}_${randomUUID()}`,
                is_verified: true,
              },
            });
          }

          if (!user) {
            return null;
          }

          if (
            !user.password &&
            !(isDemoAccount && providedPassword === demoPassword)
          ) {
            return null;
          }

          if (!user.password) {
            const hashedPassword = await bcrypt.hash(providedPassword, 12);
            user = await prisma.users.update({
              where: { id: user.id },
              data: { password: hashedPassword },
            });
          }

          const passwordMatch = await bcrypt.compare(
            providedPassword,
            user.password!,
          );
          if (passwordMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.avatar_url,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "BUYER";
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
      if (account?.type === "oauth" && user.email) {
        try {
          const existingUser = await prisma.users.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Create new user
            await prisma.users.create({
              data: {
                email: user.email,
                name: user.name || "Unknown",
                avatar_url: user.image,
                role: "BUYER",
                firebase_uid: `google_${Date.now()}`, // fallback if needed by schema
              },
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Server-side helper for getting the currently authenticated user.
 * Wraps getServerSession(authOptions) so server actions and route handlers
 * (e.g. src/actions/orders.ts) can just call `await getCurrentUser()`.
 * Returns the session's user object ({ id, email, name, role, image }) or null.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}