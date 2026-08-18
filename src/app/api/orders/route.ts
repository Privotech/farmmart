import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

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

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId as string;
    const userRole = user.role as string;

    let orders;
    
    if (userRole === 'SELLER' || userRole === 'ADMIN') {
      // Seller can see orders for their animals
      orders = await prisma.orders.findMany({
        where: {
          animals: {
            seller_id: userId
          }
        },
        include: {
          users: true, // includes the buyer/user info
          animals: true // includes the items
        },
        orderBy: { created_at: 'desc' }
      });
    } else {
      // Buyer sees their own orders
      orders = await prisma.orders.findMany({
        where: { buyer_id: userId },
        include: {
          users: true, // includes the buyer/user info
          animals: true // includes the items
        },
        orderBy: { created_at: 'desc' }
      });
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
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
      amount,
      deliveryAddress,
      deliveryState,
      deliveryCity,
      notes,
    } = await request.json();

    const paystackRef = crypto.randomUUID();
    const orderAmount = parseFloat(amount);
    const platformFee = orderAmount * 0.10;
    const sellerPayout = orderAmount - platformFee;

    const order = await prisma.orders.create({
      data: {
        buyer_id: userId,
        animal_id: animalId,
        amount: orderAmount,
        platform_fee: platformFee,
        seller_payout: sellerPayout,
        status: 'PENDING',
        paystack_ref: paystackRef,
        delivery_address: deliveryAddress,
        delivery_state: deliveryState,
        delivery_city: deliveryCity,
        notes,
      }
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
