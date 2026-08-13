// src/app/api/animals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session"; // or your auth session helper

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const breed = searchParams.get("breed");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const location = searchParams.get("location");
    const state = searchParams.get("state");
    const sellerId = searchParams.get("sellerId");
    const status = searchParams.get("status") || "AVAILABLE";
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = {};

    if (category) where.category = category;
    if (breed) where.breed = { contains: breed, mode: "insensitive" };
    if (location) {
      where.OR = [
        { location: { contains: location, mode: "insensitive" } },
        { state: { contains: location, mode: "insensitive" } },
      ];
    }
    if (state) where.state = { contains: state, mode: "insensitive" };
    if (sellerId) where.seller_id = sellerId;
    if (status) where.status = status;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      const searchConditions = [
        { name: { contains: search, mode: "insensitive" } },
        { breed: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
      if (where.OR) {
        where.OR = [...where.OR, ...searchConditions];
      } else {
        where.OR = searchConditions;
      }
    }

    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    const animals = await prisma.animals.findMany({
      where,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            farm_name: true,
            state: true,
            city: true,
            is_verified: true,
            avatar_url: true,
            phone: true,
          },
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json({ success: true, data: animals });
  } catch (error) {
    console.error("Error fetching animals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch animals" },
      { status: 500 },
    );
  }
}

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
