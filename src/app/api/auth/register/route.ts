import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

// 1. Force this  to run strictly as a standard dynamic Node.js server route
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rlResponse = rateLimit(req, 10, 60 * 60 * 1000); // 10 requests per hour
    if (rlResponse) return rlResponse;

    const { name, email, password, role, adminSecretKey, firebase_uid } = await req.json();

    if (!name || !email || (!password && !firebase_uid)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email is already registered" }, { status: 400 });
    }

    type UserRole = "BUYER" | "SELLER" | "ADMIN";
    let assignedRole: UserRole = "BUYER"; 
    
    if (role === "admin" || role === "ADMIN") {
      if (!process.env.ADMIN_SECRET_KEY) {
        throw new Error("ADMIN_SECRET_KEY is not set in the environment variables");
      }
      if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ success: false, error: "Invalid admin secret key" }, { status: 403 });
      }
      assignedRole = "ADMIN";
    } else if (role === "seller" || role === "SELLER") {
      assignedRole = "SELLER";
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

    const user = await prisma.users.create({
      data: {
        name,
        email,
        firebase_uid: firebase_uid || '',
        password: hashedPassword,
        role: assignedRole,
        is_verified: true
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Register API error:", error);
    return NextResponse.json({ success: false, error: "An error occurred during registration" }, { status: 500 });
  }
}