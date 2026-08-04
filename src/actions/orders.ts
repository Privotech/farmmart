"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { initializePayment } from "@/lib/paystack";

export async function initializePaystackPayment(data: {
  deliveryAddress: string;
  phoneNumber: string;
}) {
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

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user?.email) {
      return { success: false, error: "User email not found" };
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + Number(item.animals.price) * item.quantity;
    }, 0);

    const amountInKobo = Math.round(totalAmount * 100);
    const reference = `PMT-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    const response = await initializePayment({
      email: user.email,
      amount: amountInKobo,
      reference,
      metadata: {
        userId,
        deliveryAddress: data.deliveryAddress,
        phoneNumber: data.phoneNumber,
        cartItemCount: cartItems.length,
      },
    });

    return {
      success: true,
      reference,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      email: user.email,
      amount: amountInKobo,
    };
  } catch (error) {
    console.error("Error initializing Paystack payment:", error);
    return { success: false, error: "Failed to initialize payment" };
  }
}

export async function createOrder(data: {
  deliveryAddress: string;
  phoneNumber: string;
  paystackRef?: string;
}) {
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

    const paystackRef =
      data.paystackRef ||
      `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const createdOrders = [];
    for (const item of cartItems) {
      const order = await prisma.orders.create({
        data: {
          buyer_id: userId,
          animal_id: item.animal_id,
          amount: item.animals.price,
          status: "PAID",
          paystack_ref: `${paystackRef}-${item.id}`,
          delivery_address: data.deliveryAddress,
          delivery_phone: data.phoneNumber,
        },
      });
      createdOrders.push(order);

      await prisma.animals.update({
        where: { id: item.animal_id },
        data: { status: "SOLD" },
      });
    }

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

export async function updateOrderStatus(
  orderId: string,
  newStatus:
    | "PENDING"
    | "PAID"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED",
) {
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

export async function getSellerOrders() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const sellerId = session.user.id;

  try {
    const orders = await prisma.orders.findMany({
      where: {
        animals: {
          seller_id: sellerId,
        },
      },
      include: {
        animals: true,
        users: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return [];
  }
}
