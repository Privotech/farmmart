import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Increment view count
    await prisma.animals.update({
      where: { id },
      data: {
        view_count: { increment: 1 }
      }
    });

    const animal = await prisma.animals.findUnique({
      where: { id },
      include: {
        users: true, // Seller
        reviews: {
          include: {
            users: true
          }
        }
      }
    });

    if (!animal) {
      return NextResponse.json(
        { success: false, error: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: animal,
    });
  } catch (error) {
    console.error('Error fetching animal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch animal' },
      { status: 500 }
    );
  }
}

// PUT /api/animals/[id] - Update animal
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const animal = await prisma.animals.update({
      where: { id },
      data: body
    });

    return NextResponse.json({
      success: true,
      data: animal,
    });
  } catch (error) {
    console.error('Error updating animal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update animal' },
      { status: 500 }
    );
  }
}

// DELETE /api/animals/[id] - Delete animal
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    await prisma.animals.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Animal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting animal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete animal' },
      { status: 500 }
    );
  }
}