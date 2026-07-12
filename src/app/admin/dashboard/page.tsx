import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [allUsers, allAnimals, allOrders] = await Promise.all([
    prisma.users.findMany({
      orderBy: { created_at: 'desc' },
      take: 5
    }),
    prisma.animals.findMany({
      where: { status: 'AVAILABLE' }
    }),
    prisma.orders.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        users: true
      }
    })
  ]);

  const totalUsersCount = await prisma.users.count();
  const totalOrdersCount = await prisma.orders.count();
  const activeListings = allAnimals.length;
  
  const totalRevenue = allOrders.reduce(
    (sum, order) => sum + Number(order.amount),
    0
  );
  
  const pendingOrders = allOrders.filter(
    (o) => o.status === "PENDING"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {totalUsersCount}
              </div>
              <p className="text-gray-600 text-sm">Total Users</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {activeListings}
              </div>
              <p className="text-gray-600 text-sm">Active Listings</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM1 9h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {totalOrdersCount}
              </div>
              <p className="text-gray-600 text-sm">Total Orders</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                ₦{totalRevenue.toLocaleString()}
              </div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-bold mb-4">User Management</h3>
            <p className="text-gray-600 mb-4">Manage platform users</p>
            <Link href="/admin/users">
              <Button variant="primary" className="w-full">
                Manage Users
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Analytics</h3>
            <p className="text-gray-600 mb-4">View platform statistics</p>
            <Link href="/admin/analytics">
              <Button variant="primary" className="w-full">
                View Analytics
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Content Moderation</h3>
            <p className="text-gray-600 mb-4">Review listings and reports</p>
            <Link href="/admin/moderation">
              <Button variant="primary" className="w-full">
                Moderate Content
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Pending Orders</h3>
            <p className="text-gray-600 mb-4">
              {pendingOrders} orders awaiting action
            </p>
            <Link href="/admin/orders">
              <Button variant="primary" className="w-full">
                View Orders
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-4">Recent Users</h3>
            <div className="space-y-3">
              {allUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                  <Badge variant={user.role === "ADMIN" ? "primary" : user.role === "SELLER" ? "success" : "warning"}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {allOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-semibold">{order.id}</div>
                    <div className="text-sm text-gray-600">
                      {order.users?.name || "Unknown"}
                    </div>
                  </div>
                  <Badge variant={order.status === "DELIVERED" ? "success" : order.status === "PENDING" ? "primary" : "warning"}>
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

