import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const ClockSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const XSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const CartSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const PackageSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const UsersSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const BarChartSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const ShieldSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SearchSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CheckSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const SparklesSvg = ({ className }: { className?: string }) => (
  <svg {...svgProps} className={className}>
    <path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2L12 3z" />
  </svg>
);

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    allUsers,
    allAnimals,
    allOrders,
    totalUsersCount,
    totalOrdersCount,
    totalSellers,
    totalBuyers,
    verifiedSellers,
    pendingSellers,
    rejectedSellers,
    pendingOrders,
    paidOrders,
    deliveredOrders,
    newUsersLast7Days,
    newOrdersLast7Days,
    recentListings,
    sellerVerificationQueue,
    inquiries,
  ] = await Promise.all([
    prisma.users.findMany({
      orderBy: { created_at: "desc" },
      take: 8,
    }),
    prisma.animals.findMany({
      where: { status: "AVAILABLE" },
    }),
    prisma.orders.findMany({
      orderBy: { created_at: "desc" },
      include: { users: true, animals: true },
      take: 6,
    }),
    prisma.users.count(),
    prisma.orders.count(),
    prisma.users.count({ where: { role: "SELLER" } }),
    prisma.users.count({ where: { role: "BUYER" } }),
    prisma.users.count({ where: { role: "SELLER", is_verified: true } }),
    prisma.users.count({
      where: { role: "SELLER", verification_status: "PENDING" },
    }),
    prisma.users.count({
      where: { role: "SELLER", verification_status: "REJECTED" },
    }),
    prisma.orders.count({ where: { status: "PENDING" } }),
    prisma.orders.count({ where: { status: "PAID" } }),
    prisma.orders.count({ where: { status: "DELIVERED" } }),
    prisma.users.count({ where: { created_at: { gte: sevenDaysAgo } } }),
    prisma.orders.count({ where: { created_at: { gte: sevenDaysAgo } } }),
    prisma.animals.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
      include: {
        users: { select: { name: true, farm_name: true, is_verified: true } },
      },
    }),
    prisma.users.findMany({
      where: {
        role: "SELLER",
        verification_status: "PENDING",
        verification_document_url: { not: null },
      },
      orderBy: { updated_at: "asc" },
      take: 5,
    }),
    prisma.inquiries.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
      include: {
        users_inquiries_sender_idTousers: true,
        animals: { select: { id: true, name: true } },
      },
    }),
  ]);

  const activeListings = allAnimals.length;
  const soldListings = await prisma.animals.count({
    where: { status: "SOLD" },
  });

  const totalRevenue = allOrders.reduce(
    (sum, order) => sum + Number(order.amount),
    0,
  );

  const revenueLast30Days = await prisma.orders
    .findMany({
      where: {
        created_at: { gte: thirtyDaysAgo },
        status: { in: ["PAID", "CONFIRMED", "SHIPPED", "DELIVERED"] },
      },
    })
    .then((orders) => orders.reduce((sum, o) => sum + Number(o.amount), 0));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Platform overview, moderation queue, and real-time metrics
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/moderation">
              <Button variant="secondary">Moderation Panel</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="primary">Manage Users</Button>
            </Link>
          </div>
        </div>

        {pendingSellers > 0 && (
          <Card className="mb-8 border-2 border-amber-300 bg-amber-50">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
              <div className="flex items-start gap-3">
                <div className="text-4xl flex-shrink-0 text-amber-500">
                  <ClockSvg className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-amber-900">
                    {pendingSellers} Seller{pendingSellers > 1 ? "s" : ""}{" "}
                    Awaiting Verification
                  </h3>
                  <p className="text-amber-800">
                    New seller verification applications need your review.
                    Approve documents to unlock verified status.
                  </p>
                </div>
              </div>
              <Link href="/admin/users">
                <Button variant="warning" size="lg">
                  Review Now →
                </Button>
              </Link>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {totalUsersCount}
              </div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <div className="flex gap-2 text-xs w-full justify-center">
                <Badge variant="success">{totalSellers} Sellers</Badge>
                <Badge variant="warning">{totalBuyers} Buyers</Badge>
              </div>
              <div className="text-xs text-emerald-600 font-medium">
                +{newUsersLast7Days} this week
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {activeListings}
              </div>
              <p className="text-gray-600 text-sm">Active Listings</p>
              <div className="flex gap-2 text-xs w-full justify-center">
                <Badge variant="success">{soldListings} Sold</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM1 9h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-indigo-600">
                {totalOrdersCount}
              </div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <div className="flex gap-2 text-xs w-full justify-center flex-wrap">
                <Badge variant="warning">{pendingOrders} Pending</Badge>
                <Badge variant="primary">{paidOrders} Paid</Badge>
                <Badge variant="success">{deliveredOrders} Delivered</Badge>
              </div>
              <div className="text-xs text-indigo-600 font-medium">
                +{newOrdersLast7Days} this week
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                ₦{totalRevenue.toLocaleString()}
              </div>
              <p className="text-gray-600 text-sm">Lifetime Revenue</p>
              <div className="text-xs text-emerald-600 font-medium">
                ₦{revenueLast30Days.toLocaleString()} last 30 days
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl text-green-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-8 h-8"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {verifiedSellers}
                </div>
                <div className="text-sm text-green-800">Verified Sellers</div>
              </div>
            </div>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl text-amber-500">
                <ClockSvg className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">
                  {pendingSellers}
                </div>
                <div className="text-sm text-amber-800">Pending Review</div>
              </div>
            </div>
          </Card>
          <Card className="bg-rose-50 border-rose-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl text-rose-500">
                <XSvg className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl font-bold text-rose-700">
                  {rejectedSellers}
                </div>
                <div className="text-sm text-rose-800">Rejected / Issues</div>
              </div>
            </div>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl text-red-500">
                <CartSvg className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">
                  {pendingOrders}
                </div>
                <div className="text-sm text-red-800">Pending Orders</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "User Management",
              desc: "Manage platform users, verify sellers",
              href: "/admin/users",
              label: "Manage Users",
              icon: <UsersSvg className="w-8 h-8" />,
              color: "text-blue-600",
            },
            {
              title: "Analytics",
              desc: "View platform statistics & reports",
              href: "/admin/analytics",
              label: "View Analytics",
              icon: <BarChartSvg className="w-8 h-8" />,
              color: "text-emerald-600",
            },
            {
              title: "Content Moderation",
              desc: "Review listings and reports",
              href: "/admin/moderation",
              label: "Moderate Content",
              icon: <ShieldSvg className="w-8 h-8" />,
              color: "text-amber-600",
            },
            {
              title: "Order Management",
              desc: `${pendingOrders} orders awaiting action`,
              href: "/admin/orders",
              label: "View Orders",
              icon: <PackageSvg className="w-8 h-8" />,
              color: "text-rose-600",
            },
          ].map(({ title, desc, href, label, icon, color }) => (
            <Card key={title}>
              <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{desc}</p>
              <Link href={href}>
                <Button variant="primary" className="w-full">
                  {label}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold inline-flex items-center gap-2">
                <SearchSvg className="w-5 h-5 text-emerald-600" />
                Seller Verification Queue
              </h3>
              <Link href="/admin/users">
                <Badge variant="primary">View All →</Badge>
              </Link>
            </div>
            <div className="space-y-3">
              {sellerVerificationQueue.length === 0 ? (
                <div className="py-8 text-center text-gray-500 flex flex-col items-center gap-2">
                  <SparklesSvg className="w-10 h-10 text-emerald-500" />
                  No pending verifications — you&apos;re all caught up!
                </div>
              ) : (
                sellerVerificationQueue.map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center justify-between py-3 border-b hover:bg-gray-50 px-2 -mx-2 rounded"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 font-bold text-amber-700">
                        {seller.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {seller.farm_name || seller.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {seller.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {seller.verification_document_type}
                          {seller.cac_number && ` • CAC: ${seller.cac_number}`}
                        </div>
                      </div>
                    </div>
                    <Link href="/admin/users">
                      <Button variant="warning" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5 text-emerald-600"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Recent Listings
              </h3>
              <Link href="/admin/moderation">
                <Badge variant="primary">Moderate →</Badge>
              </Link>
            </div>
            <div className="space-y-3">
              {recentListings.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No recent listings
                </div>
              ) : (
                recentListings.map((animal) => (
                  <div
                    key={animal.id}
                    className="flex items-center justify-between py-3 border-b hover:bg-gray-50 px-2 -mx-2 rounded"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {animal.name}
                        {animal.users?.is_verified && (
                          <CheckSvg className="w-4 h-4 inline-block ml-2 -mt-1 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        by {animal.users?.farm_name || animal.users?.name}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="primary">{animal.category}</Badge>
                        <Badge
                          variant={
                            animal.status === "AVAILABLE"
                              ? "success"
                              : "warning"
                          }
                        >
                          {animal.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="font-bold text-emerald-600">
                        ₦{Number(animal.price).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(animal.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5 text-emerald-600"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Recent Users
            </h3>
            <div className="space-y-3">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "primary"
                          : user.role === "SELLER"
                            ? "success"
                            : "warning"
                      }
                    >
                      {user.role}
                    </Badge>
                    {user.is_verified && (
                      <Badge
                        variant="success"
                        className="inline-flex items-center gap-1 ml-2"
                      >
                        <CheckSvg className="w-3 h-3" /> VERIFIED
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold inline-flex items-center gap-2">
                <PackageSvg className="w-5 h-5 text-emerald-600" />
                Recent Orders
              </h3>
              <Link href="/admin/orders">
                <Badge variant="primary">All Orders →</Badge>
              </Link>
            </div>
            <div className="space-y-3">
              {allOrders.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No orders yet
                </div>
              ) : (
                allOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <div className="font-semibold">
                        {order.animals?.name || order.id.slice(0, 10)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.users?.name || "Unknown"} •{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="font-bold text-emerald-600">
                        ₦{Number(order.amount).toLocaleString()}
                      </div>
                      <Badge
                        variant={
                          order.status === "DELIVERED"
                            ? "success"
                            : order.status === "PENDING" ||
                                order.status === "PAID"
                              ? "primary"
                              : order.status === "CANCELLED" ||
                                  order.status === "REFUNDED"
                                ? "danger"
                                : "warning"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card className="mt-6">
          <h3 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-emerald-600"
            >
              <path d="M21 11.5a8.5 8.5 0 01-15.5 4.5L3 21l5-2.5A8.5 8.5 0 1121 11.5z" />
            </svg>
            Recent Buyer-Seller Inquiries
          </h3>
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No recent inquiries
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="py-3 border-b hover:bg-gray-50 px-2 -mx-2 rounded"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold">
                        {inq.users_inquiries_sender_idTousers?.name ||
                          "Unknown"}
                      </span>{" "}
                      <span className="text-gray-500 text-sm">regarding </span>
                      <Link
                        href={`/buyer/listing/${inq.animal_id}`}
                        className="text-emerald-600 underline font-medium"
                      >
                        {inq.animals?.name || "this listing"}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          inq.status === "UNREAD" ? "warning" : "success"
                        }
                      >
                        {inq.status}
                      </Badge>
                      <div className="text-xs text-gray-400">
                        {new Date(inq.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 pl-2 border-l-2 border-emerald-200">
                    {inq.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
