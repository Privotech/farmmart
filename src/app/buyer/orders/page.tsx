"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { localStorageDb } from "@/lib/localStorageDb";

export default function BuyerOrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "buyer") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      const userOrders = localStorageDb.getOrders(session.user?.email || "");
      setOrders(userOrders);
      setIsLoading(false);
    }
  }, [session]);

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet</p>
            <Button variant="primary" onClick={() => router.push("/buyer/listings")}>
              Browse Listings
            </Button>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 font-semibold text-gray-700">Items</th>
                    <th className="text-left py-3 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 font-semibold text-gray-700">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-semibold">{order.id}</td>
                      <td className="py-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-gray-600">{order.items.length} items</td>
                      <td className="py-3 font-semibold">₦{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "success"
                              : order.status === "pending"
                                ? "warning"
                                : order.status === "cancelled"
                                  ? "danger"
                                  : "primary"
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={order.paymentStatus === "completed" ? "success" : "warning"}
                        >
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
