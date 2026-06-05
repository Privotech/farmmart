"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { localStorageDb } from "@/lib/localStorageDb";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();


  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {session.user?.name}!
            </h1>
            <p className="text-gray-600">Heres your dashboard overview</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <p className="text-gray-600">Active Listings</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">5</div>
                <p className="text-gray-600">Pending Orders</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ₦250K
                </div>
                <p className="text-gray-600">Total Revenue</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  4.8★
                </div>
                <p className="text-gray-600">Seller Rating</p>
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recent Orders</h2>
              <Link href="/dashboard/orders">
                <Button variant="secondary" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 font-semibold text-gray-700">
                        Order ID
                      </th>
                      <th className="text-left py-3 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-3 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...localStorageDb.getOrders(session?.user?.email || "").map(o => ({
                        id: o.id,
                        date: new Date(o.createdAt).toLocaleDateString(),
                        amount: `₦${o.totalAmount.toLocaleString()}`,
                        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
                      })),
                      {
                        id: "#ORD001",
                        date: "2026-05-25",
                        amount: "₦85,000",
                        status: "Delivered",
                      },
                      {
                        id: "#ORD002",
                        date: "2026-05-24",
                        amount: "₦120,000",
                        status: "Pending",
                      },
                      {
                        id: "#ORD003",
                        date: "2026-05-23",
                        amount: "₦45,000",
                        status: "Processing",
                      },
                    ].map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-semibold">{order.id}</td>
                        <td className="py-3 text-gray-600">{order.date}</td>
                        <td className="py-3 font-semibold">{order.amount}</td>
                        <td className="py-3">
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "success"
                                : order.status === "Pending"
                                  ? "warning"
                                  : "primary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xl font-bold mb-4">List New Animal</h3>
              <p className="text-gray-600 mb-4">
                Add a new animal to your inventory and start selling
              </p>
              <Link href="/dashboard/animals/new">
                <Button variant="primary">Create Listing</Button>
              </Link>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-4">Account Settings</h3>
              <p className="text-gray-600 mb-4">
                Update your profile information and preferences
              </p>
              <Link href="/dashboard/settings">
                <Button variant="primary">Go to Settings</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
