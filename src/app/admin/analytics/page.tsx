
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";

export default async function AdminAnalytics() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const [totalUsersCount, totalOrdersCount, allAnimals, allOrders] = await Promise.all([
    prisma.users.count(),
    prisma.orders.count(),
    prisma.animals.findMany({ where: { status: "AVAILABLE" } }),
    prisma.orders.findMany(),
  ]);

  const activeListings = allAnimals.length;
  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.amount), 0);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Platform Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex flex-col items-center text-center gap-2">
            <h3 className="text-xl font-bold">Total Users</h3>
            <p className="text-3xl font-bold text-emerald-600">{totalUsersCount}</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center text-center gap-2">
            <h3 className="text-xl font-bold">Active Listings</h3>
            <p className="text-3xl font-bold text-emerald-600">{activeListings}</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center text-center gap-2">
            <h3 className="text-xl font-bold">Total Orders</h3>
            <p className="text-3xl font-bold text-emerald-600">{totalOrdersCount}</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center text-center gap-2">
            <h3 className="text-xl font-bold">Total Revenue</h3>
            <p className="text-3xl font-bold text-emerald-600">₦{totalRevenue.toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
    