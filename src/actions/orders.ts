"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
interface CreateOrderData {
  deliveryAddress: string;
  phoneNumber: string;
  city?: string;
  state?: string;
  notes?: string;
  paystackRef: string;
}

interface InitializePaymentData {
  deliveryAddress: string;
  phoneNumber: string;
}

/**
 * Initializes a Paystack transaction for the current user's cart items.
 */
export async function initializePaystackPayment(data: InitializePaymentData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cartItems = await prisma.cart.findMany({
      where: { user_id: user.id },
      include: { animals: true },
    });

    if (cartItems.length === 0) {
      return { success: false, error: "Your cart is empty." };
    }

    const cartTotal = cartItems.reduce(
      (sum, item) => sum + Number(item.animals.price) * item.quantity,
      0,
    );
    const shippingCost = 5000;
    const tax = cartTotal * 0.075;
    const totalAmount = cartTotal + shippingCost + tax;

    const reference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      success: true,
      authorizationUrl: `https://checkout.paystack.com/${reference}`,
      accessCode: reference,
      reference,
      email: user.email,
      amount: Math.round(totalAmount * 100),
    };
  } catch (error) {
    console.error("Initialize payment error:", error);
    return {
      success: false,
      error: "An error occurred while initializing payment.",
    };
  }
}

/**
 * Creates orders in the database after successful Paystack payment.
 */
export async function createOrder(data: CreateOrderData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cartItems = await prisma.cart.findMany({
      where: { user_id: user.id },
      include: { animals: true },
    });

    if (cartItems.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    const createdOrders = [];
    const paystackRef = data.paystackRef || `ref_${Date.now()}`;

    for (const item of cartItems) {
      const order = await prisma.orders.create({
        data: {
          buyer_id: user.id,
          animal_id: item.animal_id,
          amount: Number(item.animals.price) * item.quantity,
          paystack_ref: `${paystackRef}-${item.id}`,
          delivery_address: data.deliveryAddress,
          delivery_phone: data.phoneNumber,
          delivery_state: data.state || null,
          delivery_city: data.city || null,
          notes: data.notes || null,
          status: "PAID",
          paid_at: new Date(),
        },
      });

      await prisma.animals.update({
        where: { id: item.animal_id },
        data: { status: "SOLD" },
      });

      createdOrders.push(order);
    }

    await prisma.cart.deleteMany({
      where: { user_id: user.id },
    });

    revalidatePath("/buyer/orders");
    revalidatePath("/cart");

    return { success: true, orders: createdOrders };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "Failed to create order. Please contact support.",
    };
  }
}

/**
 * Retrieves all orders for animals listed by the seller.
 */
export async function getSellerOrders() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const orders = await prisma.orders.findMany({
      where: {
        animals: {
          seller_id: user.id,
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

    return { success: true, orders };
  } catch (error) {
    console.error("Get seller orders error:", error);
    return { success: false, error: "Failed to fetch orders." };
  }
}

/**
 * Updates status of an order (e.g., CONFIRMED, SHIPPED, DELIVERED, CANCELLED).
 */
export async function updateOrderStatus(orderId: string, status: any) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/seller/orders");
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, error: "Failed to update order status." };
  }
}
