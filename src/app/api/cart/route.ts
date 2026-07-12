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

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user_id = user.userId as string;

    const cartItems = await prisma.cart.findMany({
      where: { user_id },
      include: {
        animals: true
      }
    });

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (parseFloat(item.animals.price.toString()) * item.quantity), 
      0
    );

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
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId as string;
    const { animalId, quantity = 1 } = await request.json();

    // Check if already exists first
    const existing = await prisma.cart.findFirst({
      where: { user_id: userId, animal_id: animalId }
    });

    if (existing) {
      // Update quantity
      const updated = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
      
      return NextResponse.json({ success: true, data: updated });
    }

    // Create new
    const cartItem = await prisma.cart.create({
      data: {
        user_id: userId,
        animal_id: animalId,
        quantity: parseInt(quantity)
      }
    });

    return NextResponse.json({ success: true, data: cartItem });
    
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
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const userId = user.userId as string;

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Missing item id' },
        { status: 400 }
      );
    }

    await prisma.cart.delete({
      where: { id: itemId, user_id: userId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
