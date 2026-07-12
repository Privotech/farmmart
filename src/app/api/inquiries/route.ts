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

// GET /api/inquiries - Get user's inquiries
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

    let inquiries;
    
    if (userRole === 'SELLER' || userRole === 'ADMIN') {
      // Seller can see inquiries for their animals
      inquiries = await prisma.inquiries.findMany({
        where: {
          receiver_id: userId
        },
        include: {
          users_inquiries_sender_idTousers: true,
          animals: true
        },
        orderBy: { created_at: 'desc' }
      });
    } else {
      // Buyer sees their own inquiries
      inquiries = await prisma.inquiries.findMany({
        where: { sender_id: userId },
        include: {
          users_inquiries_receiver_idTousers: true,
          animals: true
        },
        orderBy: { created_at: 'desc' }
      });
    }

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Create new inquiry
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
      receiverId,
      animalId,
      message
    } = await request.json();

    const inquiry = await prisma.inquiries.create({
      data: {
        sender_id: userId,
        receiver_id: receiverId,
        animal_id: animalId,
        message,
        status: 'UNREAD'
      }
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}

// PUT /api/inquiries - Update inquiry status
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id, status } = await request.json();

    const inquiry = await prisma.inquiries.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}
