"use client";

import React from 'react';
import { getSellerOrders, updateOrderStatus } from '@/actions/orders';
import { Card } from '@/components/ui/Card';
import { Prisma } from '@prisma/client';

type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

// Define the exact shape of an order returned by getSellerOrders
type SellerOrder = Prisma.ordersGetPayload<{
  include: {
    animals: true;
    users: true;
  };
}>;

// Interactive component handling status updates
const OrderStatusUpdater = ({ orderId, currentStatus }: { orderId: string; currentStatus: string }) => {
  const [status, setStatus] = React.useState(currentStatus);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    const result = await updateOrderStatus(orderId, newStatus as OrderStatus);
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert("Failed to update status");
    }
    setIsUpdating(false);
  };

  return (
    <select
      value={status}
      onChange={(e) => handleUpdate(e.target.value)}
      disabled={isUpdating}
      className="bg-gray-800 text-white rounded p-1 border border-gray-700 focus:outline-none"
    >
      <option value="PAID">Paid</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = React.useState<SellerOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getSellerOrders();
        if (res.success && res.orders) {
          setOrders(res.orders as SellerOrder[]);
        }
      } catch (err) {
        console.error("Failed to load seller orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-400">
        Loading seller orders...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400">You have not received any orders yet.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Buyer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Animal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gross Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Platform Fee (10%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Your Payout</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {orders.map((order) => {
                  const gross = Number(order.amount ?? 0);
                  const platformFee = Number((order as unknown as { platform_fee?: number }).platform_fee ?? (gross * 0.10));
                  const payout = Number((order as unknown as { seller_payout?: number }).seller_payout ?? (gross * 0.90));
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {order.users?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {order.animals?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ₦{gross.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-400">
                        -₦{platformFee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400">
                        ₦{payout.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}