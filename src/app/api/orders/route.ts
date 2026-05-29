import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { executeQuery, executeInsert } from '@/lib/db';
import { Order } from '@/types';

// GET /api/orders - Get user's orders
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
      SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC
    `;

    const orders = await executeQuery<Order>(sql, [session.user.email]);

    return NextResponse.json({
      success: true,
      data: orders,
    });
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
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      items,
      totalAmount,
      deliveryAddress,
      phoneNumber,
    } = await request.json();

    // Insert order
    const orderSql = `
      INSERT INTO orders (userId, totalAmount, status, paymentStatus, deliveryAddress, phoneNumber, createdAt, updatedAt)
      VALUES (?, ?, 'pending', 'pending', ?, ?, NOW(), NOW())
    `;

    const orderResult = await executeInsert(orderSql, [
      session.user.email,
      totalAmount,
      deliveryAddress,
      phoneNumber,
    ]);

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      const itemSql = `
        INSERT INTO orderitems (orderId, animalId, quantity, pricePerUnit, totalPrice)
        VALUES (?, ?, ?, ?, ?)
      `;

      await executeInsert(itemSql, [
        orderId,
        item.animalId,
        item.quantity,
        item.price,
        item.quantity * item.price,
      ]);
    }

    return NextResponse.json({
      success: true,
      data: { orderId },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
