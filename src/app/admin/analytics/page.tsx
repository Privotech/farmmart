"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { localStorageDb } from "@/lib/localStorageDb";
import { User, Order, Animal } from "@/types";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) {
        setIsLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [session]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading analytics...
      </div>
    );
  }

  const allUsers = localStorageDb.getUsers();
  const allAnimals = localStorageDb.getAnimals({});
  const allOrders = localStorageDb.getAllOrders();

  const buyerCount = allUsers.filter((u: User) => u.role === "buyer").length;
  const sellerCount = allUsers.filter((u: User) => u.role === "seller").length;
  const adminCount = allUsers.filter((u: User) => u.role === "admin").length;

  const totalRevenue = allOrders.reduce(
    (sum: number, order: Order) => sum + order.totalAmount,
    0,
  );
  const deliveredOrders = allOrders.filter(
    (o: Order) => o.status === "delivered",
  ).length;
  const pendingOrders = allOrders.filter(
    (o: Order) => o.status === "pending",
  ).length;

  const animalTypes = allAnimals.reduce(
    (acc: Record<string, number>, animal: Animal) => {
      acc[animal.type] = (acc[animal.type] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Platform Analytics
          </h1>
          <p className="text-gray-600">Overview of platform performance</p>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-bold mb-4">User Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Buyers</span>
                <span className="font-semibold">{buyerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sellers</span>
                <span className="font-semibold">{sellerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admins</span>
                <span className="font-semibold">{adminCount}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Order Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold">{allOrders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivered</span>
                <span className="font-semibold">{deliveredOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold">{pendingOrders}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold text-green-600">
                  ₦{totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Order Value</span>
                <span className="font-semibold">
                  ₦
                  {allOrders.length > 0
                    ? Math.floor(
                        totalRevenue / allOrders.length,
                      ).toLocaleString()
                    : 0}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Animal Type Distribution */}
        <Card className="mb-8">
          <h3 className="text-lg font-bold mb-4">Animal Type Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(animalTypes).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {count as number}
                </div>
                <div className="text-sm text-gray-600 capitalize">{type}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Platform Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">
                {allUsers.length}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">
                {allAnimals.length}
              </div>
              <div className="text-sm text-gray-600">Total Listings</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">
                {allOrders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">
                {allAnimals.filter((a: Animal) => a.available).length}
              </div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
