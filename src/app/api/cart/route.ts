import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { executeQuery, executeInsert, executeDelete } from '@/lib/db';
import { CartItem } from '@/types';

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sql = `
      SELECT ci.*, a.* FROM cartitems ci
      JOIN animals a ON ci.animalId = a.id
      WHERE ci.userId = ?
    `;

    const cartItems = await executeQuery<CartItem>(sql, [session.user.email]);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.animal?.price * item.quantity || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { animalId, quantity = 1 } = await request.json();

    const sql = `
      INSERT INTO cartitems (userId, animalId, quantity, addedAt)
      VALUES (?, ?, ?, NOW())
    `;

    const result = await executeInsert(sql, [session.user.email, animalId, quantity]);

    return NextResponse.json({
      success: true,
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    const sql = 'DELETE FROM cartitems WHERE id = ? AND userId = ?';
    const result = await executeDelete(sql, [itemId, session.user.email]);

    return NextResponse.json({
      success: true,
      data: { deletedCount: result.affectedRows },
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
