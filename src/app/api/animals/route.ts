// src/app/api/animals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session"; // or your auth session helper

export async function POST(req: Request) {
  try {
    const session = await getSession();

    // 1. Verify user is logged in and is a SELLER
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 2. Create the animal record in database
    const animal = await prisma.animals.create({
      data: {
        name: body.name,
        category: body.category,
        breed: body.breed,
        age: body.age ? parseInt(body.age) : null,
        weight: body.weight ? parseFloat(body.weight) : null,
        price: parseFloat(body.price),
        description: body.description,
        location: body.location,
        state: body.state,
        is_negotiable: body.isNegotiable ?? false,
        seller_id: body.sellerId || session.userId,
        images: body.images || "[]",
        status: "AVAILABLE",
      },
    });

    // 3. Return clean JSON without altering the session cookie
    return NextResponse.json({ success: true, data: animal });
  } catch (error: unknown) {
    console.error("Error creating listing:", error);
    const message = error instanceof Error ? error.message : "Failed to create listing";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
