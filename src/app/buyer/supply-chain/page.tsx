"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type ShipmentOrder = {
  id: string;
  amount: number | string;
  status: string;
  created_at: string;
  paid_at?: string | null;
  delivery_address?: string | null;
  delivery_city?: string | null;
  delivery_state?: string | null;
  delivery_phone?: string | null;
  animals?: {
    id: string;
    name: string;
    breed?: string | null;
    category?: string;
    weight?: number | string | null;
    location?: string | null;
    state?: string | null;
    users?: {
      name: string;
      farm_name?: string | null;
      state?: string | null;
      city?: string | null;
    };
  } | null;
};

function statusToShipment(status: string): "preparing" | "in-transit" | "delivered" {
  switch (status) {
    case "PENDING":
    case "PAID":
    case "CONFIRMED":
      return "preparing";
    case "SHIPPED":
      return "in-transit";
    case "DELIVERED":
      return "delivered";
    default:
      return "preparing";
  }
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatETA(status: string, createdAt: string): string {
  const created = new Date(createdAt);
  let eta: Date;
  switch (status) {
    case "PENDING":
      eta = addDays(created, 5);
      break;
    case "PAID":
    case "CONFIRMED":
      eta = addDays(created, 4);
      break;
    case "SHIPPED":
      eta = addDays(created, 2);
      break;
    case "DELIVERED":
      eta = new Date(created);
      break;
    default:
      eta = addDays(created, 7);
  }
  return eta.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function currentLocation(order: ShipmentOrder): string {
  switch (order.status) {
    case "PENDING":
      return "Awaiting payment confirmation";
    case "PAID":
    case "CONFIRMED":
      return `${order.animals?.users?.farm_name || order.animals?.users?.name || "Seller"} facility — preparing for dispatch`;
    case "SHIPPED":
      return `In transit via ${order.delivery_state || order.animals?.state || "route"} logistics partner`;
    case "DELIVERED":
      return "Delivered — completed";
    default:
      return order.animals?.location || order.delivery_city || "Processing";
  }
}

export default function BuyerSupplyChainPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<ShipmentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "BUYER") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      fetch("/api/orders")
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setOrders(res.data);
        })
        .catch((e) => console.error("Supply chain error:", e))
        .finally(() => setIsLoading(false));
    }
  }, [session]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#121212]">
        Loading...
      </div>
    );
  }

  const shipments = orders.map((o) => ({
    ...o,
    shipmentStatus: statusToShipment(o.status),
    shipmentTitle: `${o.animals?.name || "Livestock"} Order`,
    origin: `${o.animals?.users?.farm_name || o.animals?.users?.name || "Seller"}, ${o.animals?.state || o.animals?.location || "N/A"}`,
    destination: [o.delivery_city, o.delivery_state].filter(Boolean).join(", ") || o.delivery_address || "Your registered address",
    eta: formatETA(o.status, o.created_at),
    location: currentLocation(o),
    weight: o.animals?.weight ? `${o.animals.weight}kg` : "Per listing",
    orderRef: o.id.split("-")[0].toUpperCase() + "-" + new Date(o.created_at).toISOString().slice(0, 10).replace(/-/g, ""),
  }));

  const stats = {
    inTransit: shipments.filter((s) => s.shipmentStatus === "in-transit").length,
    delivered: shipments.filter((s) => s.shipmentStatus === "delivered").length,
    preparing: shipments.filter((s) => s.shipmentStatus === "preparing").length,
    total: shipments.length,
  };

  return (
    <div className="p-8 bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-1">Supply Chain</h1>
          <p className="text-sm text-gray-400 font-medium">
            Track your orders and shipment status in real time
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/listings">
            <Button variant="primary">Order More</Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            In Transit
          </p>
          <h3 className="text-3xl font-bold text-gray-100">{stats.inTransit}</h3>
          <p className="text-blue-500 text-xs font-bold mt-2">Currently shipping</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Delivered
          </p>
          <h3 className="text-3xl font-bold text-gray-100">{stats.delivered}</h3>
          <p className="text-emerald-500 text-xs font-bold mt-2">Successfully received</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Preparing
          </p>
          <h3 className="text-3xl font-bold text-gray-100">{stats.preparing}</h3>
          <p className="text-amber-500 text-xs font-bold mt-2">With seller</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-400"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Total Orders
          </p>
          <h3 className="text-3xl font-bold text-gray-100">{stats.total}</h3>
          <p className="text-gray-500 text-xs font-bold mt-2">All time</p>
        </div>
      </div>

      {/* Shipments List */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 animate-pulse"
            >
              <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : shipments.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-12 rounded-2xl text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-100 mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Place an order through the marketplace and your shipment details
            will appear here with live tracking information.
          </p>
          <Link href="/listings">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {[...shipments]
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
            .map((shipment) => (
              <div
                key={shipment.id}
                className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-100 truncate">
                        {shipment.shipmentTitle}
                      </h3>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                        shipment.shipmentStatus === "in-transit"
                          ? "bg-blue-900/30 text-blue-400"
                          : shipment.shipmentStatus === "delivered"
                            ? "bg-emerald-900/30 text-emerald-400"
                            : "bg-amber-900/30 text-amber-400"
                      }`}>
                        {shipment.shipmentStatus.replace("-", " ").toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-[10px] font-bold">
                        Ref #{shipment.orderRef}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Origin (Seller)
                        </p>
                        <p className="text-sm text-gray-300">{shipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Destination (You)
                        </p>
                        <p className="text-sm text-gray-300">{shipment.destination}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Current Status
                        </p>
                        <p className="text-sm text-gray-300">{shipment.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Est. Delivery
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            shipment.shipmentStatus === "delivered"
                              ? "text-emerald-400"
                              : "text-gray-300"
                          }`}
                        >
                          {shipment.eta}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Order Weight
                        </p>
                        <p className="text-sm text-gray-300">{shipment.weight}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Order Value
                        </p>
                        <p className="text-sm font-semibold text-emerald-400">
                          ₦{Number(shipment.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex lg:flex-col gap-2 lg:items-end">
                    <Link href={`/logistics?order=${shipment.id}`}>
                      <button className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-sm border border-gray-700">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Live Track
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex justify-between mb-2">
                    {[
                      { label: "Ordered", done: true },
                      { label: "Paid", done: ["PAID", "CONFIRMED", "SHIPPED", "DELIVERED"].includes(shipment.status) },
                      { label: "Shipped", done: ["SHIPPED", "DELIVERED"].includes(shipment.status) },
                      { label: "Delivered", done: shipment.status === "DELIVERED" },
                    ].map((step, i) => (
                      <div
                        key={step.label}
                        className="flex flex-col items-center flex-1 relative"
                      >
                        {i < 3 && (
                          <div
                            className={`absolute top-2.5 left-1/2 w-full h-0.5 z-0 ${
                              step.done ? "bg-emerald-600" : "bg-gray-700"
                            }`}
                          />
                        )}
                        <div
                          className={`w-5 h-5 rounded-full z-10 border-2 relative flex items-center justify-center ${
                            step.done
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-gray-900 border-gray-600"
                          }`}
                        >
                          {step.done && (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                            step.done ? "text-emerald-400" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
