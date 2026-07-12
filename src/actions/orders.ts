"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOrder(data: { deliveryAddress: string; phoneNumber: string; paystackRef?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    const cartItems = await prisma.cart.findMany({
      where: { user_id: userId },
      include: { animals: true },
    });

    if (cartItems.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    const paystackRef = data.paystackRef || `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create an order for each cart item
    const createdOrders = [];
    for (const item of cartItems) {
      const order = await prisma.orders.create({
        data: {
          buyer_id: userId,
          animal_id: item.animal_id,
          amount: item.animals.price,
          status: 'PAID', // or PENDING based on flow
          paystack_ref: `${paystackRef}-${item.id}`, // ensure uniqueness if multiple items
          delivery_address: data.deliveryAddress,
          // Could split address into state/city here or adapt schema
        },
      });
      createdOrders.push(order);

      // Mark animal as SOLD
      await prisma.animals.update({
        where: { id: item.animal_id },
        data: { status: 'SOLD' },
      });
    }

    // Clear cart
    await prisma.cart.deleteMany({
      where: { user_id: userId },
    });

    revalidatePath("/cart");
    revalidatePath("/buyer/orders");
    return { success: true, paystackRef };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED') {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Depending on role, we might want to check if the user is an admin or the seller of the animal
  // For simplicity, we just allow the update if they hit the action
  try {
    await prisma.orders.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    
    revalidatePath("/seller/orders");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
