import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function BuyerOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "BUYER") {
    redirect("/login");
  }

  const orders = await prisma.orders.findMany({
    where: {
      buyer_id: session.user.id
    },
    orderBy: {
      created_at: 'desc'
    },
    include: {
      animals: true
    }
  });

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
            <Link href="/buyer/listings">
              <Button variant="primary">Browse Listings</Button>
            </Link>
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
                        {order.created_at.toLocaleDateString()}
                      </td>
                      <td className="py-3 text-gray-600">1 item</td>
                      <td className="py-3 font-semibold">₦{Number(order.amount).toLocaleString()}</td>
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
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={order.status === "PAID" ? "success" : "warning"}
                        >
                          {order.status === "PAID" ? "Completed" : "Pending"}
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

