import { useState, useEffect, useCallback } from "react";
import { CartItem } from "@/types";
import { useSession } from "@/lib/auth-client";

export function useCart() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) {
        setCartItems(data.data);

        const total = data.data.reduce(
          (sum: number, item: CartItem) =>
            sum + Number(item.animal?.price || 0) * (item.quantity || 1),
          0,
        );
        setTotalPrice(total);
      } else {
        setError(data.error || "Failed to fetch cart");
      }
    } catch {
      setError("Network error fetching cart");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchCart(), 0);
    return () => clearTimeout(timeout);
  }, [fetchCart]);

  const addToCart = async (animalId: string, quantity: number = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animalId, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?id=${cartItemId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        await fetchCart(); // update total price
      }
    } catch {
    }
  };

  const clearCart = async () => {
    try {
      await fetch("/api/cart?clear=true", { method: "DELETE" });
      setCartItems([]);
      setTotalPrice(0);
    } catch {
    }
  };

  return {
    cartItems,
    isLoading,
    error,
    totalPrice,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
