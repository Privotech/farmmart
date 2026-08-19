"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckIcon, SearchIcon } from "@/components/ui/Icons";
import { useRouter, useSearchParams } from "next/navigation";

type OrderShipment = {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  amount: string | number;
  paid_at?: string | null;
  delivery_address?: string | null;
  delivery_city?: string | null;
  delivery_state?: string | null;
  animals?: {
    name: string;
    category?: string;
    breed?: string | null;
    location?: string | null;
    state?: string | null;
    users?: {
      name: string;
      farm_name?: string | null;
      city?: string | null;
      state?: string | null;
      address?: string | null;
    } | null;
  } | null;
};

function buildStages(order: OrderShipment | null): {
  label: string;
  time: string;
  location: string;
  done: boolean;
  active: boolean;
}[] {
  if (!order) return [];
  const created = new Date(order.created_at);
  const paid = order.paid_at ? new Date(order.paid_at) : null;
  const updated = new Date(order.updated_at);
  const fmt = (d: Date | undefined | null, fallback = "Pending") =>
    d
      ? d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : fallback;

  const origin = [
    order.animals?.users?.farm_name,
    order.animals?.state || order.animals?.location,
  ]
    .filter(Boolean)
    .join(", ") || "Seller Facility";

  const dest = [order.delivery_city, order.delivery_state]
    .filter(Boolean)
    .join(", ") ||
    order.delivery_address ||
    "Your Registered Address";

  const isAtLeast = (s: string) =>
    [
      "PENDING",
      "PAID",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
    ].indexOf(order.status) >=
    [
      "PENDING",
      "PAID",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
    ].indexOf(s);

  const pending = order.status === "PENDING";
  const paidOrBetter = isAtLeast("PAID");
  const confirmedOrBetter = isAtLeast("CONFIRMED");
  const shippedOrBetter = isAtLeast("SHIPPED");
  const delivered = order.status === "DELIVERED";

  return [
    {
      label: "Animal Collected from Farm",
      time: fmt(created, "Awaiting order placement"),
      location: origin,
      done: true,
      active: false,
    },
    {
      label: "Health Verification & Seller Confirmation",
      time: fmt(paid ?? (confirmedOrBetter ? updated : null), pending ? "Awaiting payment" : "Seller preparing"),
      location:
        order.animals?.users?.city && order.animals?.users?.state
          ? `${order.animals.users.city}, ${order.animals.users.state}`
          : `${order.animals?.state || "Origin"} Vet Checkpoint`,
      done: confirmedOrBetter,
      active: paidOrBetter && !confirmedOrBetter,
    },
    {
      label: "In Transit (Nationwide Logistics)",
      time: fmt(
        shippedOrBetter ? updated : null,
        paidOrBetter ? "Awaiting dispatch" : "Pending",
      ),
      location:
        shippedOrBetter && !delivered
          ? `In transit via ${order.delivery_state || "FarmMart"} logistics`
          : paidOrBetter
            ? "Awaiting loading & dispatch"
            : "Not yet dispatched",
      done: shippedOrBetter,
      active: confirmedOrBetter && !shippedOrBetter,
    },
    {
      label: "City Distribution Hub",
      time: fmt(
        delivered ? updated : null,
        shippedOrBetter ? "ETA next distribution run" : "Pending",
      ),
      location:
        order.delivery_state || order.delivery_city
          ? `${order.delivery_city || "City"} Hub, ${order.delivery_state || ""}`
          : "Nearest Regional Distribution Hub",
      done: delivered,
      active: shippedOrBetter && !delivered,
    },
    {
      label: "Delivered to Buyer",
      time: fmt(delivered ? updated : null, "Pending final delivery"),
      location: dest,
      done: delivered,
      active: false,
    },
  ];
}

function statusBadge(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-900/40 border-amber-700/50 text-amber-300";
    case "PAID":
    case "CONFIRMED":
      return "bg-emerald-900/40 border-emerald-700/50 text-emerald-300";
    case "SHIPPED":
      return "bg-blue-900/40 border-blue-700/50 text-blue-300";
    case "DELIVERED":
      return "bg-emerald-900/40 border-emerald-700/50 text-emerald-300";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-900/40 border-red-700/50 text-red-300";
    default:
      return "bg-gray-800/40 border-gray-700/50 text-gray-300";
  }
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function LogisticsPageInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const orderParam = sp.get("order") || sp.get("trackingId");

  const [trackingId, setTrackingId] = useState(orderParam || "");
  const [tracked, setTracked] = useState<null | OrderShipment>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (orderParam) {
      void handleLookUp(orderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderParam]);

  const handleLookUp = async (id: string) => {
    const search = id.trim();
    if (!search) return;
    setIsSearching(true);
    setNotFound(false);
    setTracked(null);
    try {
      const res = await fetch(`/api/orders`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) {
        setNotFound(true);
        return;
      }
      const match = data.data.find(
        (o: OrderShipment) =>
          o.id.toLowerCase() === search.toLowerCase() ||
          o.id.toLowerCase().includes(search.toLowerCase()),
      );
      if (match) {
        setTracked(match);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLookUp(trackingId);
  };

  const stages = buildStages(tracked);
  const created = tracked ? new Date(tracked.created_at) : null;
  const eta = tracked
    ? addDays(created!, tracked.status === "DELIVERED" ? 0 : tracked.status === "SHIPPED" ? 2 : tracked.status === "PAID" || tracked.status === "CONFIRMED" ? 4 : 6)
    : null;

  return (
    <div className="min-h-screen bg-black text-emerald-50">
      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-emerald-950/80 via-emerald-950/40 to-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #10b981 0%, transparent 40%), radial-gradient(circle at 80% 70%, #059669 0%, transparent 40%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-sm font-semibold">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 inline-block mr-2"
              >
                <path d="M5 12V8a2 2 0 012-2h3l1-2h4l1 2h3a2 2 0 012 2v4" />
                <path d="M5 12h14v3a3 3 0 01-3 3H8a3 3 0 01-3-3v-3z" />
              </svg>
              Nationwide Livestock Logistics
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              FarmMart{" "}
              <span className="text-emerald-400">Logistics &amp; Delivery</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              End-to-end delivery of your livestock with GPS tracking, health
              verification, temperature-controlled vehicles and full insurance —
              from farm gate straight to your doorstep.
            </p>
          </div>

          {/* Tracking search */}
          <form onSubmit={handleTrack} className="max-w-3xl mx-auto mt-4">
            <Card className="!p-2 border-emerald-700/50 bg-emerald-950/60">
              <div className="flex flex-col md:flex-row gap-3 items-stretch">
                <div className="flex-1">
                  <input
                    type="text"
                    name="trackingId"
                    placeholder="Enter your Order ID (UUID or ORD-YYYYMMDD-NNN)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-emerald-950 border border-emerald-800 text-white placeholder-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="md:py-0 md:h-full md:px-8 py-3.5 inline-flex items-center justify-center gap-2"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-75"
                        />
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="w-4 h-4" /> Track Shipment
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </section>

      {/* TRACKING RESULT */}
      {(tracked || notFound || isSearching) && (
        <section className="py-16 container mx-auto px-4 max-w-4xl">
          {isSearching ? (
            <Card className="!p-8 border-emerald-800/50 bg-emerald-950/30 animate-pulse">
              <div className="h-6 bg-emerald-900/40 rounded w-1/3 mb-8"></div>
              <div className="space-y-8">
                {[0, 1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-16 bg-emerald-900/20 rounded"></div>
                ))}
              </div>
            </Card>
          ) : notFound ? (
            <Card className="!p-12 border-red-900/50 bg-red-950/10 text-center">
              <svg
                className="w-16 h-16 mx-auto text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">
                Shipment not found
              </h3>
              <p className="text-emerald-100/70 mb-6 max-w-md mx-auto">
                We couldn&apos;t find an order matching that ID. Double-check your
                Order ID from your confirmation email or order history.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/buyer/supply-chain">
                  <Button variant="secondary">My Orders</Button>
                </Link>
                <Link href="/buyer/listing">
                  <Button variant="primary">Browse Marketplace</Button>
                </Link>
              </div>
            </Card>
          ) : (
            tracked && (
              <Card className="!p-8 border-emerald-800/50 bg-emerald-950/30">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-emerald-900">
                  <div>
                    <p className="text-emerald-300 text-sm mb-1 font-medium">
                      Tracking Number
                    </p>
                    <h3 className="text-2xl font-bold text-white break-all">
                      {tracked.id}
                    </h3>
                    <p className="text-emerald-100/60 text-xs mt-1">
                      {tracked.animals?.name || "Livestock Order"}
                      {tracked.animals?.breed ? ` • ${tracked.animals.breed}` : ""}
                      {tracked.animals?.category ? ` • ${tracked.animals.category}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`px-4 py-2 rounded-lg border font-semibold ${statusBadge(
                        tracked.status,
                      )}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4 inline-block mr-2"
                      >
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
                      </svg>
                      {tracked.status.replace(/_/g, " ")}
                    </span>
                    <span className="px-4 py-2 rounded-lg bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 font-semibold">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4 inline-block mr-2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9.5 12.5l1.5 1.5 3.5-3.5" />
                      </svg>
                      Insured
                    </span>
                    <span className="px-4 py-2 rounded-lg bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 font-semibold">
                      ₦{Number(tracked.amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-900">
                    <p className="text-xs text-emerald-400 mb-1 uppercase tracking-wider">
                      Origin
                    </p>
                    <p className="font-bold text-white">
                      {tracked.animals?.users?.state ||
                        tracked.animals?.state ||
                        "Seller"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-900">
                    <p className="text-xs text-emerald-400 mb-1 uppercase tracking-wider">
                      Destination
                    </p>
                    <p className="font-bold text-white">
                      {tracked.delivery_state || tracked.delivery_city
                        ? `${tracked.delivery_city || ""} ${tracked.delivery_state || ""}`
                        : "Buyer"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-900">
                    <p className="text-xs text-emerald-400 mb-1 uppercase tracking-wider">
                      ETA
                    </p>
                    <p className="font-bold text-emerald-300">
                      {eta?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-emerald-300 mb-6">
                  Shipment Timeline
                </h4>
                <ol className="relative border-s-2 border-emerald-800 ms-3">
                  {stages.map((stage, idx) => (
                    <li key={idx} className="mb-10 ms-6 last:mb-0">
                      <span
                        className={`absolute -start-3.5 flex items-center justify-center w-7 h-7 rounded-full ring-4 ring-black ${
                          stage.active
                            ? "bg-emerald-500 animate-pulse"
                            : stage.done
                              ? "bg-emerald-600"
                              : "bg-emerald-900 border border-emerald-800"
                        }`}
                      >
                        {stage.done ? (
                          <svg
                            className="w-4 h-4 text-white"
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
                        ) : (
                          <span className="text-xs text-emerald-200 font-bold">
                            {idx + 1}
                          </span>
                        )}
                      </span>
                      <h5
                        className={`font-bold text-lg ${
                          stage.active
                            ? "text-emerald-300"
                            : stage.done
                              ? "text-white"
                              : "text-emerald-100/50"
                        }`}
                      >
                        {stage.label}
                      </h5>
                      <time className="block text-sm text-emerald-400/70 mb-1">
                        {stage.time}
                      </time>
                      <p
                        className={`text-sm ${
                          stage.active
                            ? "text-emerald-100/80"
                            : "text-emerald-100/50"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4 inline-block mr-1"
                        >
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {stage.location}
                      </p>
                    </li>
                  ))}
                </ol>
              </Card>
            )
          )}
        </section>
      )}

      {/* FEATURES */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Use FarmMart Logistics?
            </h2>
            <p className="text-emerald-100/70 text-lg max-w-2xl mx-auto">
              We handle the complexity of livestock delivery so buyers and
              sellers can transact with full peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-9 h-9 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"
                    />
                  </svg>
                ),
                title: "Temperature-Controlled Fleet",
                desc: "Refrigerated / ventilated trucks with on-board attendants to maintain animal welfare during transit.",
              },
              {
                icon: (
                  <svg
                    className="w-9 h-9 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                title: "Real-Time GPS Tracking",
                desc: "Track every movement of your shipment live via our dashboard. SMS/email updates at each checkpoint.",
              },
              {
                icon: (
                  <svg
                    className="w-9 h-9 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 012 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Full Cargo Insurance",
                desc: "Every shipment is insured against theft, loss, injury, or death in transit. Verified claims are paid within 7 days.",
              },
              {
                icon: (
                  <svg
                    className="w-9 h-9 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Certified Vet Checks",
                desc: "Mandatory health inspection by licensed veterinarians at origin and destination. Health certificates provided.",
              },
              {
                icon: (
                  <svg
                    className="w-9 h-9 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Transparent, Flat Pricing",
                desc: "Fixed logistics fee shown at checkout (₦5,000 flat nationwide). No hidden surcharges or fuel levies.",
              },
              {
                icon: (
                  <svg
                    className="w-9 h-9 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                title: "Professional Handlers",
                desc: "Experienced livestock handlers accompany all shipments to ensure humane loading, unloading, and care.",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="!p-7 hover:!border-emerald-600/70 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-emerald-900/60 rounded-2xl flex items-center justify-center mb-6 border border-emerald-800/80">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-emerald-100/70 leading-relaxed">
                  {card.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="py-20 bg-emerald-950/30 border-y border-emerald-900/70">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Nationwide Delivery Coverage
              </h2>
              <p className="text-emerald-100/75 text-lg mb-8 leading-relaxed">
                We deliver to all 36 states of Nigeria and the Federal Capital
                Territory. Our logistics network includes 12 regional
                distribution hubs located in:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Lagos (HQ)",
                  "Abuja (FCT)",
                  "Kano",
                  "Port Harcourt",
                  "Ibadan",
                  "Kaduna",
                  "Enugu",
                  "Benin",
                  "Jos",
                  "Abeokuta",
                  "Uyo",
                  "Sokoto",
                ].map((city) => (
                  <div
                    key={city}
                    className="flex items-center gap-2 text-emerald-100/90"
                  >
                    <CheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium">{city}</span>
                  </div>
                ))}
              </div>
              <p className="text-emerald-400/70 text-sm mt-6 italic inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-4 h-4 flex-shrink-0"
                >
                  <path d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
                Rural and riverine areas: Available with 1-3 additional transit
                days.
              </p>
            </div>
            <div>
              <Card className="!p-10 text-center bg-emerald-900/20 border-emerald-800/50">
                <div className="mb-6 flex justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="w-20 h-20 text-emerald-400"
                  >
                    <path d="M3 7l6-3 6 3 6-3v14l-6 3-6-3-6 3z" />
                    <path d="M9 4v14" />
                    <path d="M15 7v14" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Coverage: 100%
                </h3>
                <p className="text-emerald-100/70 mb-6">
                  No destination in Nigeria is out of reach for FarmMart
                  logistics.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-900/70">
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">12</p>
                    <p className="text-xs text-emerald-100/60 uppercase mt-1">
                      Hubs
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">37</p>
                    <p className="text-xs text-emerald-100/60 uppercase mt-1">
                      States + FCT
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">24/7</p>
                    <p className="text-xs text-emerald-100/60 uppercase mt-1">
                      Support
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Buy with confidence. Ship with{" "}
              <span className="text-emerald-400">FarmMart.</span>
            </h2>
            <p className="text-xl text-emerald-100/70 mb-10 max-w-2xl mx-auto">
              Browse livestock listings, purchase securely on-platform, and let
              our logistics team handle the rest. Your animals are insured every
              step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buyer/listing">
                <Button
                  variant="primary"
                  className="!px-10 !py-4 !text-lg shadow-emerald-900/60 shadow-2xl"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5 inline-block mr-2"
                  >
                    <path d="M5 12V8a2 2 0 012-2h3l1-2h4l1 2h3a2 2 0 012 2v4" />
                    <path d="M5 12h14v3a3 3 0 01-3 3H8a3 3 0 01-3-3v-3z" />
                  </svg>
                  Browse Listings Now
                </Button>
              </Link>
              <Link href="/buyer/dashboard">
                <Button variant="secondary" className="!px-10 !py-4 !text-lg">
                  My Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function LogisticsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LogisticsPageInner />
    </Suspense>
  );
}
