import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rlResponse = rateLimit(req, 10, 15 * 60 * 1000); // 10 requests per 15 min
    if (rlResponse) return rlResponse;

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Token and password are required" }, { status: 400 });
    }

    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRequest || resetRequest.used || new Date() > resetRequest.expiresAt) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.users.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.update({
      where: { token },
      data: { used: true },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error: unknown) {
    console.error("Reset Password API error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
