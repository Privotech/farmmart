import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { Animal } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    
    const sql = 'SELECT * FROM animals WHERE id = ?';
    const animals = await executeQuery<Animal>(sql, [id]);

    if (animals.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: animals[0],
    });
  } catch (error) {
    console.error('Error fetching animal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch animal' },
      { status: 500 }
    );
  }
}