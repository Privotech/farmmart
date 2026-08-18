import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const favourites = await prisma.favourites.findMany({
      where: { user_id: session.userId },
      orderBy: { created_at: "desc" },
      include: {
        animals: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                farm_name: true,
                avatar_url: true,
                is_verified: true,
                verification_status: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      favourites,
      animalIds: favourites.map((f) => f.animal_id),
    });
  } catch (err) {
    console.error("GET /api/favourites error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load favourites" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    const animalId = body?.animalId;

    if (!animalId || typeof animalId !== "string") {
      return NextResponse.json(
        { success: false, error: "animalId is required" },
        { status: 400 },
      );
    }

    const animal = await prisma.animals.findUnique({
      where: { id: animalId, status: "AVAILABLE" },
      select: { id: true },
    });

    if (!animal) {
      return NextResponse.json(
        { success: false, error: "Animal not found or unavailable" },
        { status: 404 },
      );
    }

    const existing = await prisma.favourites.findUnique({
      where: {
        user_id_animal_id: {
          user_id: session.userId,
          animal_id: animalId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.favourites.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({
        success: true,
        isFavourited: false,
        message: "Removed from saved",
      });
    }

    await prisma.favourites.create({
      data: {
        user_id: session.userId,
        animal_id: animalId,
      },
    });

    return NextResponse.json({
      success: true,
      isFavourited: true,
      message: "Saved to favourites",
    });
  } catch (err) {
    console.error("POST /api/favourites error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update favourite" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const animalId = searchParams.get("animalId");

    if (!animalId) {
      return NextResponse.json(
        { success: false, error: "animalId query parameter is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.favourites.findUnique({
      where: {
        user_id_animal_id: {
          user_id: session.userId,
          animal_id: animalId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.favourites.delete({ where: { id: existing.id } });
    }

    return NextResponse.json({
      success: true,
      isFavourited: false,
    });
  } catch (err) {
    console.error("DELETE /api/favourites error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to remove favourite" },
      { status: 500 },
    );
  }
}
