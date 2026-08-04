import { useState, useEffect, useCallback } from "react";
import { Order, CartItem } from "@/types";
import { useSession } from "@/lib/auth-client";

export function useOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error || "Failed to fetch orders");
      }
    } catch {
      setError("Network error fetching orders");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchOrders(), 0);
    return () => clearTimeout(timeout);
  }, [fetchOrders]);

  const createOrder = async (items: CartItem[], deliveryAddress: string, phoneNumber: string, totalAmount: number) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, deliveryAddress, phoneNumber, totalAmount })
      });
      const data = await res.json();
      if (data.success) {
        return data.data; // array of created orders
      }
      throw new Error(data.error || "Failed to create order");
    } catch (err: unknown) {
      throw err;
    }
  };

  return { orders, isLoading, error, fetchOrders, createOrder };
}
