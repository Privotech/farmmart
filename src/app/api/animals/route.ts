import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Animal, AnimalsCategory, AnimalsStatus } from '@/types';

// GET /api/animals - Get all animals or filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as AnimalsCategory | null;
    const breed = searchParams.get('breed');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const state = searchParams.get('state');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const sellerId = searchParams.get('sellerId');
    const status = searchParams.get('status') as AnimalsStatus;

    const where: any = {};

    if (category) {
      where.category = category;
    }
    
    if (breed) {
      where.breed = { contains: breed, mode: 'insensitive' };
    }

    if (minPrice) {
      where.price = { gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      if (where.price) {
        where.price.lte = parseFloat(maxPrice);
      } else {
        where.price = { lte: parseFloat(maxPrice) };
      }
    }

    if (state) {
      where.state = state;
    }

    if (sellerId) {
      where.seller_id = sellerId;
    }
    
    if (status) {
      where.status = status;
    } else {
      // Default to available only
      where.status = 'AVAILABLE';
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { breed: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'oldest':
        orderBy = { created_at: 'asc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }

    const animals = await prisma.animals.findMany({
      where,
      orderBy,
      include: {
        users: true // Include seller data
      }
    });

    return NextResponse.json({
      success: true,
      data: animals,
    });
  } catch (error) {
    console.error('Error fetching animals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch animals' },
      { status: 500 }
    );
  }
}

// POST /api/animals - Create new animal listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      breed,
      age,
      weight,
      price,
      description,
      images,
      sellerId,
      location,
      state,
      isNegotiable = false
    } = body;

    const animal = await prisma.animals.create({
      data: {
        name,
        category: category as AnimalsCategory,
        breed,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        price: parseFloat(price),
        description,
        images: JSON.stringify(images || []),
        seller_id: sellerId,
        location,
        state,
        is_negotiable: isNegotiable,
        status: 'AVAILABLE',
        view_count: 0
      }
    });

    return NextResponse.json({
      success: true,
      data: animal,
    });
  } catch (error) {
    console.error('Error creating animal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create animal' },
      { status: 500 }
    );
  }
}
