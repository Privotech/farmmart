"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { initializePayment, verifyPayment } from "@/lib/paystack";
import { Numeric } from "@/types";

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
  city?: string;
  state?: string;
}

function calculateCartTotals(
  cartItems: Array<{
    quantity: number;
    animals: {
      price: unknown;
    };
  }>,
) {
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.animals.price) * item.quantity,
    0,
  );
  const shippingCost = 5000;
  const tax = cartTotal * 0.075;
  const totalAmount = cartTotal + shippingCost + tax;

  return {
    cartTotal,
    shippingCost,
    tax,
    totalAmount,
    totalAmountInKobo: Math.round(totalAmount * 100),
  };
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

    if (!user.email) {
      return {
        success: false,
        error: "Your account is missing an email address.",
      };
    }

    const reference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const totals = calculateCartTotals(cartItems);
    const metadata = {
      userId: user.id,
      deliveryAddress: data.deliveryAddress,
      phoneNumber: data.phoneNumber,
      deliveryCity: data.city ?? null,
      deliveryState: data.state ?? null,
      itemCount: cartItems.length,
      cancel_action: "/checkout",
    };

    const paystackResponse = await initializePayment({
      email: user.email,
      amount: totals.totalAmountInKobo,
      reference,
      currency: "NGN",
      metadata,
    });

    return {
      success: true,
      authorizationUrl: paystackResponse.data.authorization_url,
      accessCode: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
      email: user.email,
      amount: totals.totalAmountInKobo,
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

    if (!data.paystackRef) {
      return { success: false, error: "Missing payment reference." };
    }

    const totals = calculateCartTotals(cartItems);
    const verification = await verifyPayment(data.paystackRef);

    if (!verification.status || verification.data.status !== "success") {
      return {
        success: false,
        error: "Payment could not be verified. Please contact support.",
      };
    }

    if (verification.data.amount !== totals.totalAmountInKobo) {
      return {
        success: false,
        error: "Payment amount does not match your cart total.",
      };
    }

    if (
      user.email &&
      verification.data.customer.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      return {
        success: false,
        error: "Payment email does not match your signed-in account.",
      };
    }

    const existingOrder = await prisma.orders.findFirst({
      where: {
        paystack_ref: {
          startsWith: verification.data.reference,
        },
      },
    });

    if (existingOrder) {
      return { success: true, orders: [], alreadyProcessed: true };
    }

    const createdOrders: Array<{
      id: string;
      buyer_id: string;
      animal_id: string;
      amount: Numeric;
      paystack_ref: string;
      paystack_channel: string | null;
      delivery_address: string;
      delivery_phone: string;
      delivery_state: string | null;
      delivery_city: string | null;
      notes: string | null;
      status: string;
      paid_at: Date | null;
    }> = [];

    await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const animal = await tx.animals.findUnique({
          where: { id: item.animal_id },
          select: { status: true },
        });

        if (!animal || animal.status !== "AVAILABLE") {
          throw new Error("One or more items in your cart are no longer available.");
        }

        const order = await tx.orders.create({
          data: {
            buyer_id: user.id,
            animal_id: item.animal_id,
            amount: Number(item.animals.price) * item.quantity,
            paystack_ref: `${verification.data.reference}-${item.id}`,
            paystack_channel: verification.data.channel,
            delivery_address: data.deliveryAddress,
            delivery_phone: data.phoneNumber,
            delivery_state: data.state || null,
            delivery_city: data.city || null,
            notes: data.notes || null,
            status: "PAID",
            paid_at: verification.data.paid_at
              ? new Date(verification.data.paid_at)
              : new Date(),
          },
        });

        await tx.animals.update({
          where: { id: item.animal_id },
          data: { status: "SOLD" },
        });

        createdOrders.push(order as (typeof createdOrders)[number]);
      }

      await tx.cart.deleteMany({
        where: { user_id: user.id },
      });
    });

    revalidatePath("/buyer/orders");
    revalidatePath("/cart");
    revalidatePath("/seller/orders");
    revalidatePath("/seller/animals");

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
export async function updateOrderStatus(orderId: string, status: "PENDING" | "PAID" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED") {
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
