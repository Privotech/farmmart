import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("farmmart_session_token")?.value;

  if (!token || !process.env.JWT_SECRET) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      userId: string;
      email: string;
      role: "BUYER" | "SELLER" | "ADMIN";
    };
  } catch {
    return null;
  }
}

export default async function BuyerDashboard() {
  const session = await getSession();

  if (!session?.userId || session.role !== "BUYER") {
    redirect("/login");
  }

  const orders = await prisma.orders.findMany({
    where: { buyer_id: session.userId },
    include: { animals: { include: { users: true } } },
  });

  const activeOrders = orders.filter(
    (o) => o.status !== "CANCELLED" && o.status !== "DELIVERED",
  );
  const pendingDeliveries = orders.filter((o) =>
    ["PAID", "CONFIRMED", "SHIPPED"].includes(o.status),
  );
  const totalSpend = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const cartCount = await prisma.cart.count({
    where: { user_id: session.userId },
  });

  const inquiries = await prisma.inquiries.findMany({
    where: { sender_id: session.userId },
    include: { animals: { include: { users: true } } },
    orderBy: { created_at: "desc" },
    take: 3,
  });

  const activityTimeline = [
    ...orders.slice(0, 3).map((o) => ({
      id: `order-${o.id}`,
      type: "order" as const,
      title: `Order ${o.status}: ₦${Number(o.amount).toLocaleString()}`,
      subtitle: o.animals?.name ?? "Livestock purchase",
      time: new Date(o.created_at),
      icon: "order",
    })),
    ...inquiries.map((i) => ({
      id: `inq-${i.id}`,
      type: "inquiry" as const,
      title: `Inquiry: ${i.animals?.name ?? "Animal"}`,
      subtitle: `Status: ${i.status.toLowerCase()}`,
      time: new Date(i.created_at),
      icon: "message",
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 4);

  const priceIndexData = await prisma.animals.findMany({
    where: { status: "AVAILABLE" },
    select: { price: true, weight: true, created_at: true, category: true },
    orderBy: { created_at: "desc" },
    take: 50,
  });

  const totalWeight = priceIndexData.reduce(
    (s, a) => s + (a.weight ? Number(a.weight) : 0),
    0,
  );
  const totalPrice = priceIndexData.reduce(
    (s, a) => s + Number(a.price),
    0,
  );
  const liveIndex =
    totalWeight > 0
      ? totalPrice / totalWeight
      : priceIndexData.length > 0
        ? totalPrice / priceIndexData.length
        : 0;

  return (
    <div className="p-8 bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-100 mb-1">
            Welcome, {session.email.split("@")[0]}
          </h1>
          <p className="text-sm text-emerald-400 font-medium">
            Market status:{" "}
            <span className="text-emerald-400 font-bold">Open</span> •{" "}
            {priceIndexData.length > 0
              ? `${priceIndexData.length} active listings`
              : "No live listings yet"}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/listings">
            <button className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-sm">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Browse Marketplace
            </button>
          </Link>
          <Link href="/cart">
            <button className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-sm">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Cart ({cartCount})
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-950 p-6 rounded-2xl shadow-sm border border-emerald-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4">
                Total Spend
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-emerald-100">
                  ₦{totalSpend.toLocaleString()}
                </h3>
              </div>
              <p className="text-emerald-400 text-xs font-bold mt-2">
                {orders.filter((o) => o.status !== "CANCELLED").length}{" "}
                completed orders
              </p>
            </div>

            <div className="bg-emerald-950 p-6 rounded-2xl shadow-sm border border-emerald-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4">
                Active Orders
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-emerald-100">
                  {activeOrders.length}
                </h3>
              </div>
              <p className="text-emerald-400 text-xs font-bold mt-2">
                {pendingDeliveries.length} pending delivery
              </p>
            </div>

            <div className="bg-emerald-950 p-6 rounded-2xl shadow-sm border border-emerald-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-700"></div>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4">
                Cart Items
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-emerald-100">
                  {cartCount}
                </h3>
              </div>
              <Link
                href="/cart"
                className="text-emerald-400 text-xs font-bold mt-2 hover:underline block"
              >
                View cart &rarr;
              </Link>
            </div>
          </div>

          {/* Active Orders Section */}
          <div className="bg-emerald-900 p-8 rounded-[32px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-emerald-100">
                Recent Orders
              </h2>
              <Link
                href="/buyer/supply-chain"
                className="text-emerald-400 text-sm font-bold hover:underline"
              >
                View Supply Chain &rarr;
              </Link>
            </div>

            {activeOrders.length === 0 &&
            orders.filter((o) => o.status !== "CANCELLED").length === 0 ? (
              <div className="bg-emerald-950 p-8 rounded-2xl border border-emerald-800 text-center">
                <p className="text-emerald-100 font-bold mb-2">
                  No orders yet
                </p>
                <p className="text-emerald-400 text-sm mb-6">
                  Browse the marketplace to place your first order.
                </p>
                <Link href="/listings">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition">
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {[...orders]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )
                  .slice(0, 3)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="bg-emerald-950 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-emerald-800"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-emerald-100 text-lg">
                          {order.animals?.name ?? "Livestock Order"}
                        </h4>
                        <p className="text-sm text-emerald-400 truncate">
                          Seller:{" "}
                          <span className="text-emerald-300">
                            {order.animals?.users?.farm_name ??
                              order.animals?.users?.name ??
                              "N/A"}
                          </span>
                          {order.animals?.weight
                            ? ` • ${order.animals.weight}kg`
                            : ""}
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                              order.status === "DELIVERED"
                                ? "bg-emerald-800/50 text-emerald-300"
                                : order.status === "SHIPPED"
                                  ? "bg-blue-900/40 text-blue-300"
                                  : order.status === "PAID" ||
                                      order.status === "CONFIRMED"
                                    ? "bg-amber-900/40 text-amber-300"
                                    : order.status === "CANCELLED"
                                      ? "bg-red-900/40 text-red-300"
                                      : "bg-gray-700/50 text-gray-300"
                            }`}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-emerald-500 text-[10px] font-bold">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">
                          Order Value
                        </p>
                        <p className="text-2xl font-bold text-emerald-400">
                          ₦{Number(order.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Market Insights */}
          <div className="bg-emerald-900 p-8 rounded-[32px] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-emerald-100">
                  Market Price Index
                </h3>
                <Link
                  href="/buyer/price-index"
                  className="text-emerald-400 text-xs font-bold hover:underline"
                >
                  Full Details &rarr;
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">
                    Live Animal Index
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-100">
                      ₦{liveIndex.toFixed(2)}
                    </span>
                    <span className="text-sm text-emerald-500 font-bold">
                      / kg est.
                    </span>
                  </div>
                </div>
                <div className="flex-1 h-12 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    {priceIndexData.length >= 2 ? (
                      <>
                        <path
                          d={`M 0 ${40 - (Number(priceIndexData[priceIndexData.length - 1].price) / Math.max(...priceIndexData.map((d) => Number(d.price))) * 35)} ${priceIndexData.slice(1).map((d, i) => {
                            const prev = priceIndexData[i];
                            return `L ${((i + 1) / (priceIndexData.length - 1)) * 100} ${40 - (Number(d.price) / Math.max(...priceIndexData.map((x) => Number(x.price))) * 35)}`;
                          }).join(" ")}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                      </>
                    ) : (
                      <path
                        d="M0 20 L100 20"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                    )}
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-sm text-emerald-400 leading-relaxed">
                Based on{" "}
                <span className="text-emerald-300 font-bold">
                  {priceIndexData.length}
                </span>{" "}
                recent listings across the marketplace.
              </p>
            </div>
            <div className="bg-emerald-950 p-6 rounded-2xl border border-emerald-800 flex gap-4">
              <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-emerald-100 mb-2">
                  Procurement Tip
                </h4>
                <p className="text-sm text-emerald-400 leading-relaxed">
                  {priceIndexData.length >= 3
                    ? `Check individual listings for negotiable pricing — ${
                        priceIndexData.filter((d: any) => d.is_negotiable || d.isNegotiable).length || 0
                      }+ listings support direct negotiation with sellers.`
                    : "Add animals to your cart to compare multiple sellers side by side before purchasing."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Recent Activity */}
        <div className="bg-emerald-950 p-8 rounded-[32px] shadow-sm border border-emerald-800 flex flex-col h-full relative">
          <h3 className="text-xl font-bold text-emerald-100 mb-8">
            Recent Activity
          </h3>

          {activityTimeline.length === 0 ? (
            <div className="text-emerald-400 text-sm py-8 text-center flex-1">
              No recent activity. Start shopping to see your history here.
            </div>
          ) : (
            <div className="space-y-8 flex-1">
              {activityTimeline.map((act) => (
                <div key={act.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    {act.icon === "order" ? (
                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-100 text-sm mb-1">
                      {act.title}
                    </h5>
                    <p className="text-[11px] text-emerald-400 leading-tight mb-1">
                      {act.subtitle}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">
                      {act.time.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col items-center">
            <Link
              href="/buyer/supply-chain"
              className="text-emerald-600 text-xs font-bold mb-8 hover:underline"
            >
              Load Full History
            </Link>
            <Link href="/listings">
              <button className="w-12 h-12 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-emerald-700 transition">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
