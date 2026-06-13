"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Card } from "@/components/ui/Card";
import { localStorageDb } from "@/lib/localStorageDb";
import { User, Order, Animal } from "@/types";

export default function SellerAnalyticsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (session) {
      const sellerAnimals = localStorageDb.getAnimals({
        sellerId: session.user.id,
      });
      const sellerOrders = localStorageDb.getSellerOrders(session.user.id);
      setAnimals(sellerAnimals);
      setOrders(sellerOrders);
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-400 bg-black">
        Loading analytics...
      </div>
    );
  }

  // Calculations
  const totalListings = animals.length;
  const activeListings = animals.filter((a) => a.available).length;
  const soldListings = animals.filter((a) => !a.available).length;

  const avgPrice =
    totalListings > 0
      ? Math.floor(animals.reduce((sum, a) => sum + a.price, 0) / totalListings)
      : 0;

  // Seller specific revenue calculation
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => {
      const sellerItemsTotal = o.items
        .filter((item) => item.animal.sellerId === session.user.id)
        .reduce((s, item) => s + item.totalPrice, 0);
      return sum + sellerItemsTotal;
    }, 0);

  // Orders status breakdown
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;

  // Animal type breakdown for seller
  const animalTypes = animals.reduce((acc: Record<string, number>, animal: Animal) => {
    acc[animal.type] = (acc[animal.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-100 mb-2">
            Seller Performance & Analytics
          </h1>
          <p className="text-emerald-400">Track listings, sales, and analytics for your farm.</p>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Total Earnings</h4>
            <div className="text-2xl font-bold text-emerald-400">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-500 mt-2">Exclude cancelled orders</p>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Active Listings</h4>
            <div className="text-2xl font-bold text-emerald-400">{activeListings}</div>
            <p className="text-xs text-emerald-500 mt-2">Currently visible to buyers</p>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Sold Animals</h4>
            <div className="text-2xl font-bold text-emerald-400">{soldListings}</div>
            <p className="text-xs text-emerald-500 mt-2">Cleared from inventory</p>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Avg. Animal Price</h4>
            <div className="text-2xl font-bold text-emerald-400">₦{avgPrice.toLocaleString()}</div>
            <p className="text-xs text-emerald-500 mt-2">Across all {totalListings} listings</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Orders summary */}
          <Card className="lg:col-span-1">
            <h3 className="text-lg font-bold text-emerald-100 mb-6">Order Status Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-800">
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Pending
                </span>
                <span className="font-bold text-emerald-100">{pendingCount}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-800">
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Confirmed
                </span>
                <span className="font-bold text-emerald-100">{confirmedCount}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-800">
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Shipped
                </span>
                <span className="font-bold text-emerald-100">{shippedCount}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-800">
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Delivered
                </span>
                <span className="font-bold text-emerald-100">{deliveredCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Cancelled
                </span>
                <span className="font-bold text-emerald-100">{cancelledCount}</span>
              </div>
            </div>
          </Card>

          {/* Product Types distribution */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold text-emerald-100 mb-6">Listed Animal Types</h3>
            {Object.keys(animalTypes).length === 0 ? (
              <div className="text-center py-10 text-emerald-500">No types mapped. List an animal to begin tracking.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(animalTypes).map(([type, count]) => (
                  <div key={type} className="text-center p-6 bg-emerald-900/30 rounded-xl hover:shadow-md transition border border-emerald-800">
                    <div className="text-3xl font-extrabold text-emerald-400 mb-2">{count}</div>
                    <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider capitalize">{type}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Listings details list */}
        <Card>
          <h3 className="text-lg font-bold text-emerald-100 mb-6">Inventory Value Detail</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-emerald-800">
                <tr>
                  <th className="text-left py-3 font-semibold text-emerald-300">Animal</th>
                  <th className="text-left py-3 font-semibold text-emerald-300">Breed</th>
                  <th className="text-left py-3 font-semibold text-emerald-300">Type</th>
                  <th className="text-left py-3 font-semibold text-emerald-300">Listing Price</th>
                  <th className="text-left py-3 font-semibold text-emerald-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {animals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-emerald-500">No animals listed yet.</td>
                  </tr>
                ) : (
                  animals.map((a) => (
                    <tr key={a.id} className="border-b border-emerald-800 hover:bg-emerald-900/30">
                      <td className="py-3 font-medium text-emerald-100">{a.name}</td>
                      <td className="py-3 text-emerald-400">{a.breed}</td>
                      <td className="py-3 text-emerald-400 capitalize">{a.type}</td>
                      <td className="py-3 font-semibold text-emerald-100">₦{a.price.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            a.available
                              ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800"
                              : "bg-emerald-900/30 text-emerald-400 border border-emerald-800"
                          }`}
                        >
                          {a.available ? "Available" : "Sold"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
