import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const loginAttempt = await prisma.loginAttempt.findUnique({
      where: { email },
    });

    if (
      loginAttempt &&
      loginAttempt.lockedUntil &&
      new Date() < loginAttempt.lockedUntil
    ) {
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !user.password) {
      await recordFailedAttempt(email, loginAttempt);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await recordFailedAttempt(email, loginAttempt);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (loginAttempt) {
      await prisma.loginAttempt.update({
        where: { email },
        data: { attempts: 0, lockedUntil: null },
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in the environment variables");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.avatar_url || undefined,
        phone: user.phone || undefined,
        address: user.address || undefined,
        state: user.state || undefined,
        city: user.city || undefined,
      },
    });

    response.cookies.set("farmmart_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login API error:", error);
    if (error instanceof Error) console.error("Message:", error.message);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

async function recordFailedAttempt(
  email: string,
  currentAttempt: { attempts: number; lockedUntil: Date | null } | null
) {
  const attempts = currentAttempt ? currentAttempt.attempts + 1 : 1;
  const lockedUntil =
    attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

  await prisma.loginAttempt.upsert({
    where: { email },
    update: { attempts, lockedUntil },
    create: { email, attempts, lockedUntil },
  });
}