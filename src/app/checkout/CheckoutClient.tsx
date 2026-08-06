"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createOrder, initializePaystackPayment } from "@/actions/orders";
import { Animal } from "@/types";

interface CartItem {
  id: string;
  quantity: number;
  animals: Animal;
}

interface CheckoutClientProps {
  cartItems: CartItem[];
  cartTotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

interface PaystackHandler {
  openIframe: () => void;
}

function getFirstImage(images: unknown): string {
  if (!images) return "/cow.svg";

  if (Array.isArray(images)) {
    return (images[0] as string) || "/cow.svg";
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images) as string[];
      return parsed[0] || "/cow.svg";
    } catch {
      return images.startsWith("http") || images.startsWith("/")
        ? images
        : "/cow.svg";
    }
  }

  return "/cow.svg";
}

export function CheckoutClient({
  cartItems,
  cartTotal,
  shippingCost,
  tax,
  total,
}: CheckoutClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    phoneNumber: "",
    city: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paystackReady, setPaystackReady] = useState(false);

  useEffect(() => {
    const scriptId = "paystack-inline-script";
    if (document.getElementById(scriptId)) {
      setPaystackReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackReady(true);
    script.onerror = () =>
      setError("Failed to load payment script. Check your connection.");
    document.body.appendChild(script);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.deliveryAddress.trim() || !formData.phoneNumber.trim()) {
        setError("Please fill in your delivery address and phone number.");
        return;
      }

      if (
        !/^(\+234|0)[789]\d{9}$/.test(formData.phoneNumber.replace(/\s/g, ""))
      ) {
        setError(
          "Please enter a valid Nigerian phone number (e.g. 08012345678).",
        );
        return;
      }

      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackReady || !paystackPublicKey) {
        setError("Payment system is not ready. Please refresh and try again.");
        return;
      }

      const fullAddress = `${formData.deliveryAddress.trim()}, ${formData.city.trim()}, ${formData.state.trim()}`;

      // Initialize on server
      const initRes = await initializePaystackPayment({
        deliveryAddress: fullAddress,
        phoneNumber: formData.phoneNumber.trim(),
      });

      if (!initRes.success) {
        setError(initRes.error || "Failed to initialize payment.");
        return;
      }

      // FIX TS2322 — guard all three required Paystack fields
      // After this block TypeScript narrows them from T|undefined → T
      if (!initRes.email || !initRes.amount || !initRes.reference) {
        setError("Payment data incomplete. Please try again.");
        return;
      }

      const paystackWindow = window as Window & {
        PaystackPop?: {
          setup: (options: {
            key: string;
            email: string;
            amount: number;
            ref: string;
            currency?: string;
            callback: (response: { reference: string }) => void;
            onClose: () => void;
          }) => PaystackHandler;
        };
      };

      if (!paystackWindow.PaystackPop) {
        setError("Paystack failed to load. Please refresh.");
        return;
      }

      const handler = paystackWindow.PaystackPop.setup({
        key: paystackPublicKey,
        email: initRes.email, // string
        amount: initRes.amount, // number
        ref: initRes.reference, // string
        currency: "NGN",

        callback: async (response: { reference: string }) => {
          setIsLoading(true);
          setError("");

          // Server verifies with Paystack before creating order
          const res = await createOrder({
            deliveryAddress: fullAddress,
            phoneNumber: formData.phoneNumber.trim(),
            paystackRef: response.reference,
          });

          if (res.success) {
            router.push("/buyer/orders?payment=success");
          } else {
            setError(
              res.error ||
                `Payment succeeded but order failed. Save this reference: ${response.reference}`,
            );
            setIsLoading(false);
          }
        },

        onClose: () => {
          setError("Payment was cancelled. You can try again.");
          setIsLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("[CheckoutClient]", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">
          You haven&apos;t added any animals to your cart yet.
        </p>
        <Link href="/listings">
          <Button variant="primary">Browse Animals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-6 text-sm">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="deliveryAddress"
                label="Delivery Address *"
                placeholder="123 Farm Lane, Abeokuta"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <Input
                type="tel"
                name="phoneNumber"
                label="Phone Number *"
                placeholder="08012345678"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="city"
                  label="City"
                  placeholder="Lagos"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <Input
                  type="text"
                  name="state"
                  label="State"
                  placeholder="Lagos State"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                disabled={isLoading || !paystackReady}
              >
                {isLoading
                  ? "Processing..."
                  : !paystackReady
                    ? "Loading payment..."
                    : "Proceed to Payment"}
              </Button>

              {!paystackReady && (
                <p className="text-xs text-center text-gray-400">
                  Loading Paystack secure payment...
                </p>
              )}
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-xl font-bold mb-4">Your Cart</h3>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-gray-100 flex-shrink-0">
                    <Image
                      src={getFirstImage(item.animals.images)}
                      alt={item.animals.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-md w-16 h-16"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {item.animals.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold flex-shrink-0">
                    ₦
                    {(
                      Number(item.animals.price) * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  ₦{shippingCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (7.5%)</span>
                <span className="font-semibold">₦{tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-emerald-600">
                ₦{total.toLocaleString()}
              </span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg text-sm text-emerald-800">
              ✓ Secure payment via Paystack
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
