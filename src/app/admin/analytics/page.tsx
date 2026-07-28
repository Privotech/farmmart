import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";

export default async function AdminAnalyticsPage() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const [allUsers, allAnimals, allOrders] = await Promise.all([
    prisma.users.findMany(),
    prisma.animals.findMany(),
    prisma.orders.findMany(),
  ]);

  const buyerCount = allUsers.filter((u) => u.role === "BUYER").length;
  const sellerCount = allUsers.filter((u) => u.role === "SELLER").length;
  const adminCount = allUsers.filter((u) => u.role === "ADMIN").length;

  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.amount), 0);
  const deliveredOrders = allOrders.filter((o) => o.status === "DELIVERED").length;
  const pendingOrders = allOrders.filter((o) => o.status === "PENDING").length;

  const animalTypes = allAnimals.reduce((acc: Record<string, number>, animal) => {
    const type = animal.category.toLowerCase().replace("_", " ");
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
          <p className="text-gray-600">Overview of platform performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-bold mb-4">User Distribution</h3>
            <div className="space-y-3">
              {[
                { label: "Buyers", count: buyerCount },
                { label: "Sellers", count: sellerCount },
                { label: "Admins", count: adminCount },
              ].map(({ label, count }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Order Statistics</h3>
            <div className="space-y-3">
              {[
                { label: "Total Orders", count: allOrders.length },
                { label: "Delivered", count: deliveredOrders },
                { label: "Pending", count: pendingOrders },
              ].map(({ label, count }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold text-green-600">₦{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Order Value</span>
                <span className="font-semibold">
                  ₦{allOrders.length > 0 ? Math.floor(totalRevenue / allOrders.length).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <h3 className="text-lg font-bold mb-4">Animal Type Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(animalTypes).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{count as number}</div>
                <div className="text-sm text-gray-600 capitalize">{type}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-4">Platform Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", count: allUsers.length },
              { label: "Total Listings", count: allAnimals.length },
              { label: "Total Orders", count: allOrders.length },
              { label: "Active Listings", count: allAnimals.filter((a) => a.status === "AVAILABLE").length },
            ].map(({ label, count }) => (
              <div key={label} className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600">{count}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
