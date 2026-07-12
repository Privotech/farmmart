"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createOrder } from "@/actions/orders";

export function CheckoutClient({ cartTotal, shippingCost, tax, total }: { cartTotal: number, shippingCost: number, tax: number, total: number }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    phoneNumber: "",
    city: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.deliveryAddress || !formData.phoneNumber) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      const res = await createOrder({
        deliveryAddress: `${formData.deliveryAddress}, ${formData.city}, ${formData.state}`,
        phoneNumber: formData.phoneNumber
      });

      if (res.success) {
        alert("Payment simulated successfully! Order created.");
        router.push("/buyer/orders");
      } else {
        setError(res.error || "Failed to create order.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

            {error && (
              <div className="bg-emerald-100 text-emerald-800 p-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="deliveryAddress"
                label="Delivery Address"
                placeholder="123 Farm Lane"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <Input
                type="tel"
                name="phoneNumber"
                label="Phone Number"
                placeholder="+234 801 234 5678"
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
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card>
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
