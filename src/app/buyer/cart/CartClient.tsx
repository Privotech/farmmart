"use client";

import Link from "next/link";
import { CartItem as CartItemComponent } from "@/components/features/CartItem";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { removeFromCart, updateCartQuantity } from "@/actions/cart";
import { useTransition } from "react";
import type { CartItem } from "@/types";

export function CartClient({
  initialCartItems,
}: {
  initialCartItems: CartItem[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      await removeFromCart(itemId);
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    startTransition(async () => {
      await updateCartQuantity(itemId, quantity);
    });
  };

  const totalPrice = initialCartItems.reduce(
    (sum, item) => sum + Number(item.animal?.price ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Shopping Cart</h1>

      {initialCartItems.length === 0 ? (
        <Card className="text-center py-12 border-gray-800 bg-gray-900">
          <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
          <Link href="/buyer/listing">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {initialCartItems.map((item) => (
              <div
                key={item.id}
                className={isPending ? "opacity-50 pointer-events-none" : ""}
              >
                <CartItemComponent
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-100">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-semibold text-gray-100">₦5,000</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="font-semibold text-gray-100">
                    ₦{Math.floor(totalPrice * 0.075).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-100">Total</span>
                <span className="text-2xl font-bold text-emerald-500">
                  ₦
                  {(
                    totalPrice +
                    5000 +
                    Math.floor(totalPrice * 0.075)
                  ).toLocaleString()}
                </span>
              </div>

              <Link href="/checkout" className="block">
                <Button
                  variant="primary"
                  className="w-full mb-3"
                  disabled={isPending}
                >
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/buyer/listing" className="block">
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={isPending}
                >
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
