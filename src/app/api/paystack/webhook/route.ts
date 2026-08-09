/**
 * src/app/api/paystack/webhook/route.ts
 *
 * Set this URL in Paystack Dashboard:
 * https://dashboard.paystack.com → Settings → Webhooks
 * URL: https://yourdomain.com/api/paystack/webhook
 *
 * For local dev use ngrok:
 *   npx ngrok http 3000
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWebhookSignature, verifyPayment } from "@/lib/paystack";

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

  return Math.round((cartTotal + shippingCost + tax) * 100);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const paystackSignature = req.headers.get("x-paystack-signature") ?? "";

    // ── 1. Validate webhook signature ─────────────────────
    if (!validateWebhookSignature(rawBody, paystackSignature)) {
      console.warn("[webhook] Invalid signature — rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // ── 2. Parse event ────────────────────────────────────
    let event: {
      event: string;
      data: { reference: string; metadata?: Record<string, unknown> };
    };

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // ── 3. Only handle charge.success ─────────────────────
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const reference = event.data.reference;
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    // ── 4. Re-verify directly with Paystack ───────────────
    const verification = await verifyPayment(reference);

    if (!verification.status || verification.data.status !== "success") {
      console.warn("[webhook] Payment not verified:", reference);
      return NextResponse.json({ received: true });
    }

    // ── 5. Idempotency check ──────────────────────────────
    const existingOrder = await prisma.orders.findFirst({
      where: { paystack_ref: { startsWith: reference } },
    });

    if (existingOrder) {
      console.log("[webhook] Already processed:", reference);
      return NextResponse.json({ received: true });
    }

    // ── 6. Extract metadata ───────────────────────────────
    const meta = verification.data.metadata ?? event.data.metadata ?? {};
    let userId = meta.userId as string | undefined;
    const deliveryAddress = (meta.deliveryAddress as string) ?? "Not provided";
    const phoneNumber = (meta.phoneNumber as string) ?? "";
    const deliveryCity = (meta.deliveryCity as string) ?? null;
    const deliveryState = (meta.deliveryState as string) ?? null;

    if (!userId) {
      const user = await prisma.users.findUnique({
        where: { email: verification.data.customer.email },
        select: { id: true },
      });
      userId = user?.id;
    }

    if (!userId) {
      console.error("[webhook] Could not resolve user for:", reference);
      return NextResponse.json({ received: true });
    }

    // ── 7. Load cart and create orders in a transaction ───
    const cartItems = await prisma.cart.findMany({
      where: { user_id: userId },
      include: { animals: true },
    });

    if (cartItems.length === 0) {
      console.warn("[webhook] Cart empty for user:", userId);
      return NextResponse.json({ received: true });
    }

    const expectedAmount = calculateCartTotals(cartItems);
    if (verification.data.amount !== expectedAmount) {
      console.error("[webhook] Amount mismatch:", {
        reference,
        expectedAmount,
        paidAmount: verification.data.amount,
      });
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const animal = await tx.animals.findUnique({
          where: { id: item.animal_id },
          select: { status: true },
        });

        if (!animal || animal.status !== "AVAILABLE") {
          console.warn("[webhook] Skipping unavailable animal:", item.animal_id);
          continue;
        }

        await tx.orders.create({
          data: {
            buyer_id: userId,
            animal_id: item.animal_id,
            amount: Number(item.animals.price) * item.quantity,
            status: "PAID",
            paystack_ref: `${reference}-${item.id}`,
            paystack_channel: verification.data.channel,
            delivery_address: deliveryAddress,
            delivery_phone: phoneNumber || null,
            delivery_city: deliveryCity,
            delivery_state: deliveryState,
            paid_at: new Date(verification.data.paid_at),
          },
        });

        await tx.animals.update({
          where: { id: item.animal_id },
          data: { status: "SOLD" },
        });
      }

      await tx.cart.deleteMany({ where: { user_id: userId } });
    });

    console.log("[webhook] Orders created:", reference);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] Error:", error);
    // Always return 200 so Paystack doesn't keep retrying
    return NextResponse.json({ received: true });
  }
}
