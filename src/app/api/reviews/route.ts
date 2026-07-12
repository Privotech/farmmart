import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('farmmart_session_token')?.value;
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_for_farmmart_2026');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// GET /api/reviews - Get reviews for an animal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const animalId = searchParams.get('animalId');

    if (!animalId) {
      return NextResponse.json(
        { success: false, error: 'Missing animalId' },
        { status: 400 }
      );
    }

    const reviews = await prisma.reviews.findMany({
      where: { animal_id: animalId },
      include: {
        users: true
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId as string;
    const {
      animalId,
      rating,
      comment
    } = await request.json();

    // Check if user already reviewed this animal
    const existing = await prisma.reviews.findFirst({
      where: {
        user_id: userId,
        animal_id: animalId
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'You already reviewed this animal' },
        { status: 400 }
      );
    }

    const review = await prisma.reviews.create({
      data: {
        user_id: userId,
        animal_id: animalId,
        rating: parseInt(rating),
        comment
      }
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
