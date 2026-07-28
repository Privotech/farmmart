import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import SellerOrderActions from "./SellerOrderActions";

export default async function SellerOrdersPage() {
  const session = await getSession();

  if (!session?.userId || session.role !== "SELLER") {
    redirect("/login");
  }

  const orders = await prisma.orders.findMany({
    where: {
      animals: {
        seller_id: session.userId,
      },
    },
    include: {
      users: true,
      animals: true,
    },
    orderBy: { created_at: "desc" },
  });

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
            <Link
              href="/seller/animals"
              className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md"
            >
              Manage Listings
            </Link>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-emerald-800">
                  <tr>
                    <th className="text-left py-3 font-semibold text-emerald-300">Order ID</th>
                    <th className="text-left py-3 font-semibold text-emerald-300">Date</th>
                    <th className="text-left py-3 font-semibold text-emerald-300">Customer</th>
                    <th className="text-left py-3 font-semibold text-emerald-300">Amount</th>
                    <th className="text-left py-3 font-semibold text-emerald-300">Status</th>
                    <th className="text-left py-3 font-semibold text-emerald-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-emerald-800 hover:bg-emerald-900/30">
                      <td className="py-3 font-semibold text-emerald-100">{order.id}</td>
                      <td className="py-3 text-emerald-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-emerald-400">
                        {order.users?.name || "Unknown"}
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">
                        ₦{Number(order.amount).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            order.status === "DELIVERED"
                              ? "success"
                              : order.status === "PENDING"
                                ? "warning"
                                : order.status === "CANCELLED"
                                  ? "danger"
                                  : "primary"
                          }
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1).toLowerCase()}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <SellerOrderActions orderId={order.id} status={order.status} />
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
