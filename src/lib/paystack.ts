/**
 * src/lib/paystack.ts
 * Paystack API helper — initialize, verify, and webhook validation.
 * Server-side only. Never import in client components.
 */

import crypto from "crypto";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = "https://api.paystack.co";

if (!PAYSTACK_SECRET) {
  console.warn("[paystack] PAYSTACK_SECRET_KEY is not set in .env");
}

// ── Types ─────────────────────────────────────────────────

export interface PaystackInitPayload {
  email: string;
  amount: number; // in kobo (Naira × 100)
  reference: string;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    status: "success" | "failed" | "abandoned" | "pending";
    amount: number;
    currency: string;
    paid_at: string;
    customer: {
      email: string;
      id: number;
    };
    metadata?: Record<string, unknown>;
    gateway_response: string;
    channel: string;
  };
}

// ── Initialize payment ────────────────────────────────────

export async function initializePayment(
  payload: PaystackInitPayload
): Promise<PaystackInitResponse> {
  const res = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      amount: payload.amount,
      reference: payload.reference,
      currency: payload.currency ?? "NGN",
      metadata: payload.metadata ?? {},
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paystack init failed (${res.status}): ${err}`);
  }

  return res.json() as Promise<PaystackInitResponse>;
}

// ── Verify payment ────────────────────────────────────────
// Always call this SERVER-SIDE before creating any order.
// Never trust a client callback alone.

export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const res = await fetch(
    `${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paystack verify failed (${res.status}): ${err}`);
  }

  return res.json() as Promise<PaystackVerifyResponse>;
}

// ── Webhook signature validation ──────────────────────────

export function validateWebhookSignature(
  rawBody: string,
  paystackSignature: string
): boolean {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");

  return hash === paystackSignature;
}