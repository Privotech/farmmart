import axios from "axios";

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

if (!paystackSecretKey) {
  throw new Error(
    "Paystack secret key is missing. Set PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your .env file.",
  );
}

export const PAYSTACK_PUBLIC_KEY = paystackPublicKey || "";

const paystackApi = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${paystackSecretKey}`,
  },
});

export interface InitializePaymentParams {
  email: string;
  amount: number; // in kobo (smallest currency unit)
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    fees: number;
    logs: null;
    time_spent: number;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: null;
      risk_action: string;
      international_format_phone: null;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
    plan: null;
    split: Record<string, unknown>;
    order_id: null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
  };
}

export async function initializePayment(params: InitializePaymentParams) {
  try {
    const response = await paystackApi.post("/transaction/initialize", {
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      metadata: params.metadata,
    });

    return response.data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw error;
  }
}

export async function verifyPayment(
  reference: string,
): Promise<VerifyPaymentResponse> {
  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);

    return response.data;
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw error;
  }
}

export async function createRecipient(
  type: "nuban" | "mobile_money" | "ghipss",
  name: string,
  accountNumber: string,
  bankCode?: string,
  currency?: string,
) {
  try {
    const response = await paystackApi.post("/transferrecipient", {
      type,
      name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency,
    });

    return response.data;
  } catch (error) {
    console.error("Paystack recipient creation error:", error);
    throw error;
  }
}

export async function initiateTransfer(
  recipientCode: string,
  amount: number,
  reference: string,
  reason?: string,
) {
  try {
    const response = await paystackApi.post("/transfer", {
      source: "balance",
      recipient: recipientCode,
      amount,
      reference,
      reason,
    });

    return response.data;
  } catch (error) {
    console.error("Paystack transfer error:", error);
    throw error;
  }
}

export default paystackApi;
