import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert } from '@/lib/db';
import { Animal } from '@/types';

// GET /api/animals - Get all animals or filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const breed = searchParams.get('breed');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM animals WHERE available = true';
    const params: unknown[] = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    if (breed) {
      sql += ' AND breed = ?';
      params.push(breed);
    }
    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseInt(minPrice));
    }
    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseInt(maxPrice));
    }
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        sql += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        sql += ' ORDER BY price DESC';
        break;
      case 'oldest':
        sql += ' ORDER BY createdAt ASC';
        break;
      default:
        sql += ' ORDER BY createdAt DESC';
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const animals = await executeQuery<Animal>(sql, params);

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
    const { name, type, breed, age, weight, price, description, images, sellerId, location, health_status } = body;

    const sql = `
      INSERT INTO animals (name, type, breed, age, weight, price, description, images, sellerId, location, health_status, available, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await executeInsert(sql, [
      name,
      type,
      breed,
      age,
      weight || null,
      price,
      description,
      JSON.stringify(images),
      sellerId,
      location,
      health_status || 'unknown',
      true,
    ]);

    return NextResponse.json({
      success: true,
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error creating animal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create animal' },
      { status: 500 }
    );
  }
}
