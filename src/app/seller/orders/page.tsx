"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { localStorageDb } from "@/lib/localStorageDb";
import { Order } from "@/types";

export default function SellerOrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(() => {
    if (session) {
      const sellerOrders = localStorageDb.getSellerOrders(session?.user?.id || "");
      setOrders(sellerOrders);
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    localStorageDb.updateOrderStatus(orderId, newStatus);
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-100 mb-2">
            Order Management
          </h1>
          <p className="text-emerald-400">View and manage incoming orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-emerald-400 text-lg mb-6">No orders yet</p>
            <Button
              variant="primary"
              onClick={() => router.push("/seller/animals")}
            >
              Manage Listings
            </Button>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-emerald-800">
                  <tr>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Order ID
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Date
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Customer
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Amount
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Status
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-emerald-800 hover:bg-emerald-900/30">
                      <td className="py-3 font-semibold text-emerald-100">{order.id}</td>
                      <td className="py-3 text-emerald-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-emerald-400">
                        {order.user?.name || "Unknown"}
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">
                        ₦{order.totalAmount.toLocaleString()}
                      </td>
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
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(order.id, "confirmed")
                                }
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(order.id, "cancelled")
                                }
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(order.id, "shipped")
                              }
                            >
                              Mark Shipped
                            </Button>
                          )}
                          {order.status === "shipped" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(order.id, "delivered")
                              }
                            >
                              Mark Delivered
                            </Button>
                          )}
                        </div>
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
