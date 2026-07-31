"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Order } from "@/types";

export function AdminOrdersClient({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 font-semibold text-gray-700">Order ID</th>
              <th className="text-left py-3 font-semibold text-gray-700">Customer</th>
              <th className="text-left py-3 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-semibold">{order.id}</td>
                <td className="py-3 text-gray-600">
                  {order.users?.name || order.user?.name || order.buyer?.name || "Unknown"}
                </td>
                <td className="py-3 text-gray-600">
                  ₦{Number(order.amount || order.totalAmount || 0).toLocaleString()}
                </td>
                <td className="py-3">
                  <Badge variant={order.status === "DELIVERED" ? "success" : order.status === "PENDING" ? "primary" : "warning"}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-3 text-gray-600">
                  {new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}