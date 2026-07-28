import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const orders = await prisma.orders.findMany({
    orderBy: { created_at: "desc" },
    include: { users: true },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">View all platform orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders yet</p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    {["Order ID", "Customer", "Date", "Amount", "Status", "Payment"].map((h) => (
                      <th key={h} className="text-left py-3 font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-semibold">{order.id}</td>
                      <td className="py-3 text-gray-600">{order.users?.name || "Unknown"}</td>
                      <td className="py-3 text-gray-600">{order.created_at.toLocaleDateString()}</td>
                      <td className="py-3 font-semibold">₦{Number(order.amount).toLocaleString()}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            order.status === "DELIVERED" ? "success"
                              : order.status === "PENDING" ? "warning"
                                : order.status === "CANCELLED" ? "danger"
                                  : "primary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={order.status === "PAID" ? "success" : "warning"}>
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
