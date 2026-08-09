import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
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
 * Supports BOTH auth systems in the project:
 *   1. NextAuth session (via signIn("credentials") / Google OAuth)
 *   2. Custom JWT cookie "farmmart_session_token" (set by /api/auth/login)
 * Falls back automatically if one auth system returns null.
 * Returns the user object ({ id, email, name, role, image }) or null.
 */
export async function getCurrentUser() {
  // 1) Try NextAuth session first (most common path)
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return session.user;
  }

  // 2) Fall back: custom JWT cookie "farmmart_session_token"
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("farmmart_session_token")?.value;
    if (!token || !process.env.JWT_SECRET) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload?.userId as string | undefined;
    if (!userId) return null;

    const userFromDb = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar_url: true,
      },
    });
    if (!userFromDb) return null;

    return {
      id: userFromDb.id,
      email: userFromDb.email,
      name: userFromDb.name,
      role: userFromDb.role as "BUYER" | "SELLER" | "ADMIN",
      image: userFromDb.avatar_url ?? undefined,
    };
  } catch {
    return null;
  }
}