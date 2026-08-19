import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendEmail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, adminSecretKey, firebase_uid } = body;

    if (!name || !email || (!password && !firebase_uid)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email is already registered" },
        { status: 400 },
      );
    }

    type UserRole = "BUYER" | "SELLER" | "ADMIN";
    let assignedRole: UserRole = "BUYER";

    if (role === "admin" || role === "ADMIN") {
      if (!process.env.ADMIN_SECRET_KEY) {
        throw new Error("ADMIN_SECRET_KEY is not set in environment variables");
      }
      if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json(
          { success: false, error: "Invalid admin secret key" },
          { status: 403 },
        );
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
        // If no firebase_uid provided, generate a unique placeholder
        // so the unique constraint on uq_users_firebase_uid never collides
        firebase_uid: firebase_uid || `credentials_${randomUUID()}`,
        password: hashedPassword,
        role: assignedRole,
        // Sellers must be approved by an admin before receiving a verified badge.
        is_verified: assignedRole !== "SELLER",
        verification_status: assignedRole === "SELLER" ? "PENDING" : undefined,
      },
    });

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to FarmMart",
        html: `
          <p>Hi ${name},</p>
          <p>Your FarmMart account has been created successfully.</p>
          <p>${assignedRole === "SELLER"
            ? "Your seller account is pending admin verification. You can log in and submit your verification documents from Settings."
            : "You can now log in and start using the platform."}</p>
          <p>Regards,<br />FarmMart Support</p>
        `,
      });
    } catch (mailError) {
      console.error("Registration email send failed:", mailError);
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Register API error:", JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return NextResponse.json(
      { success: false, error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
