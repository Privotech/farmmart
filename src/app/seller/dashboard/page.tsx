"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { localStorageDb } from "@/lib/localStorageDb";
import { Animal, Order } from "@/types";

export default function SellerDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#121212]">
        Loading dashboard...
      </div>
    );
  }

  const activeListings = animals.filter((a) => a.available);
  
  const getHeadCount = (description: string) => {
    const match = description.match(/(\d+)\s+Head/i);
    return match ? parseInt(match[1]) : 1;
  };

  const activeHeadCount = activeListings.reduce(
    (sum, a) => sum + getHeadCount(a.description),
    0
  );

  // Calculate seller revenue (sum of item totals for this seller's products)
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => {
      const sellerItemsTotal = o.items
        .filter((item) => item.animal.sellerId === session.user.id)
        .reduce((s, item) => s + item.totalPrice, 0);
      return sum + sellerItemsTotal;
    }, 0);

  // Generate activities based on orders and health clearances
  const activities = [
    ...orders.map((o) => ({
      type: "order" as const,
      id: o.id,
      title: `Order ${o.status === "delivered" ? "Confirmed" : o.status.charAt(0).toUpperCase() + o.status.slice(1)}: ${o.id}`,
      subtitle: `By ${o.user.name || "Customer"} • ${o.items.length} item(s)`,
      value: `₦${o.items
        .filter((item) => item.animal.sellerId === session.user.id)
        .reduce((s, i) => s + i.totalPrice, 0)
        .toLocaleString()}`,
      status: o.status,
      date: new Date(o.createdAt),
      color: o.status === "delivered" ? "emerald" : o.status === "cancelled" ? "rose" : "amber",
    })),
    ...animals.map((a) => ({
      type: "listing" as const,
      id: a.id,
      title: `Listed: ${a.name}`,
      subtitle: `${a.breed} • ${a.location}`,
      value: "Listed",
      status: "active",
      date: new Date(a.createdAt),
      color: "blue",
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);

  return (
    <div className="p-8 bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Inventory Overview</h1>
          <p className="text-sm text-gray-400">Real-time status of your herd and active market listings.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 px-5 py-3 rounded-xl shadow-sm border border-gray-800">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-gray-400">Total Sales Value</span>
          <span className="text-emerald-500 font-bold text-lg">₦{revenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Herd Growth Analytics */}
        <div className="xl:col-span-2">
          <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-8 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-emerald-900/30 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-300 text-sm">Herd Growth Analytics</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart Area */}
                <div className="h-48 flex items-end gap-2 px-4 pb-4 border-b md:border-b-0 md:border-r border-gray-800 pr-6">
                  {[
                    { label: "JAN", height: 30, color: "#065f46" },
                    { label: "FEB", height: 50, color: "#065f46" },
                    { label: "MAR", height: 40, color: "#065f46" },
                    { label: "APR", height: 70, color: "#047857" },
                    { label: "MAY", height: 95, color: "#10b981" },
                    { label: "JUN", height: 85, color: "#047857" },
                    { label: "JUL", height: 90, color: "#059669" },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-2">
                      <div
                        className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer"
                        style={{ height: `${bar.height}%`, backgroundColor: bar.color }}
                        title={`${bar.label}: ${bar.height}%`}
                      />
                      <span className="text-[10px] text-gray-500 font-bold">{bar.label}</span>
                    </div>
                  ))}
                </div>

                {/* Stats Cards */}
                <div className="flex flex-col gap-4 justify-center">
                  <div className="bg-blue-900/30 rounded-2xl p-5 border border-blue-800">
                    <span className="text-4xl font-bold text-gray-100 block mb-2">{activeHeadCount}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase">Active Head Count</span>
                  </div>
                  <div className="bg-orange-900/30 rounded-2xl p-5 border border-orange-800">
                    <span className="text-4xl font-bold text-gray-100 block mb-2">{activeListings.length}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase">Active Market Listings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Listing Callout */}
        <div className="flex flex-col">
          <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 border-dashed border-2 p-8 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-100 mb-2">Create New Listing</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-[200px]">
              Reach verified buyers instantly across the marketplace network.
            </p>
            <Link href="/seller/animals/new">
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-700 transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-100">Active Listings</h2>
          <Link href="/seller/animals" className="text-emerald-500 font-bold text-sm hover:underline">
            View All Inventory
          </Link>
        </div>

        {activeListings.length === 0 ? (
          <Card className="p-8 text-center text-gray-400 border border-gray-800 bg-gray-900">
            No active listings found.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeListings.slice(0, 4).map((animal) => (
              <div key={animal.id} className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    {animal.health_status}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-gray-800 rounded-xl relative overflow-hidden flex-shrink-0">
                    <Image
                      src={animal.images?.[0] || "/placeholder-animal.jpg"}
                      alt={animal.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-100 mb-1 truncate">{animal.name}</h3>
                    <p className="text-xs text-gray-400 mb-2 truncate">
                      {animal.breed} • {animal.age} Months • {animal.weight ? `${animal.weight}kg` : "N/A weight"}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase capitalize">
                        {animal.type}
                      </span>
                      <span className="text-gray-500 text-xs truncate">{animal.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-0.5">Price</span>
                        <span className="text-emerald-500 font-bold text-xl">₦{animal.price.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => router.push(`/seller/animals/${animal.id}/edit`)}
                        className="p-2 bg-gray-800 rounded-lg text-blue-400 hover:bg-gray-700 transition border border-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-100">Recent Activity</h2>
        </div>

        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  act.color === "emerald"
                    ? "bg-[#F0FDF4]"
                    : act.color === "rose"
                    ? "bg-[#FEF2F2]"
                    : act.color === "blue"
                    ? "bg-[#EFF6FF]"
                    : "bg-[#FFFBEB]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      act.color === "emerald"
                        ? "bg-emerald-100 text-emerald-700"
                        : act.color === "rose"
                        ? "bg-rose-100 text-rose-700"
                        : act.color === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {act.type === "order" ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{act.title}</h4>
                    <p className="text-[11px] text-gray-500">{act.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`font-bold text-sm ${
                    act.color === "emerald"
                      ? "text-emerald-700"
                      : act.color === "rose"
                      ? "text-rose-700"
                      : act.color === "blue"
                      ? "text-blue-700"
                      : "text-amber-700"
                  }`}
                >
                  {act.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Support Button */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-800 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Support
        </button>
      </div>
    </div>
  );
}
