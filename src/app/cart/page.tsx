"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { CartItem as CartItemComponent } from "@/components/features/CartItem";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CartItem } from "@/types";
import { localStorageDb } from "@/lib/localStorageDb";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    // Defer initial state updates to avoid calling setState synchronously from an effect.
    await Promise.resolve();
    setIsLoading(true);
    try {
      if (!session || !session.user) return;
      const items = localStorageDb.getCartItems(session.user.email);
      setCartItems(items);
      const total = items.reduce((sum, item) => sum + (item.animal.price * item.quantity), 0);
      setTotalPrice(total);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    // Defer calling fetchCart so setState inside it doesn't run synchronously in the effect.
    setTimeout(() => {
      void fetchCart();
    }, 0);
  }, [session, router, fetchCart]);

  const handleRemoveItem = async (itemId: string) => {
    if (!session || !session.user) return;
    try {
      localStorageDb.removeFromCart(session.user.email, itemId);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };


  const handleUpdateQuantity = async () => {
    // In a real app, update the quantity via API
    // For now, just refetch
    await fetchCart();
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen text-gray-100">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12 border-gray-800 bg-gray-900">
          <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
          <Link href="/listings">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-gray-100">Order Summary</h3>

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
                <Button variant="primary" className="w-full mb-3">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/listings" className="block">
                <Button variant="secondary" className="w-full">
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
