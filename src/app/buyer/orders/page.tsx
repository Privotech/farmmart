import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { OrderTimeline } from "@/components/ui/OrderTimeline";
import { SafeImage } from "@/components/ui/SafeImage";

// Helper — parse images JSON string from DB safely
function getFirstImage(images: string | null): string {
  if (!images) return "/placeholder-animal.svg";
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    if (typeof parsed === "string") return parsed;
  } catch {
    if (images.startsWith("http")) return images;
  }
  return "/placeholder-animal.svg";
}

export default async function BuyerOrdersPage() {
  const session = await getSession();

  if (!session?.userId || session.role !== "BUYER") {
    redirect("/login");
  }

  const rawOrders = await prisma.orders.findMany({
    where: { buyer_id: session.userId },
    orderBy: { created_at: "desc" },
    include: {
      animals: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
              farm_name: true,
              is_verified: true,
              verification_status: true,
            },
          },
        },
      },
    },
  });

  // FIX: Serialize Decimal and Date fields so they can be passed to
  // Client Components (OrderTimeline, SafeImage). Prisma returns Decimal
  // objects which Next.js cannot serialize across the server/client boundary.
  const orders = rawOrders.map((order) => ({
    ...order,
    amount: Number(order.amount),
    paid_at: order.paid_at?.toISOString() ?? null,
    created_at: order.created_at.toISOString(),
    updated_at: order.updated_at.toISOString(),
    animals: order.animals
      ? {
          ...order.animals,
          price: Number(order.animals.price),
          weight: order.animals.weight ? Number(order.animals.weight) : null,
          created_at: order.animals.created_at.toISOString(),
          updated_at: order.animals.updated_at.toISOString(),
        }
      : null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              You haven&apos;t placed any orders yet
            </p>
            <Link href="/buyer/listings">
              <Button variant="primary">Browse Listings</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const animal = order.animals;
              const seller = animal?.users;
              const isPaid =
                order.status !== "PENDING" &&
                order.status !== "CANCELLED" &&
                order.status !== "REFUNDED";

              return (
                <Card key={order.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">
                          Order #{order.id.substring(0, 8)}
                        </h2>
                        <Badge
                          variant={
                            order.status === "DELIVERED"
                              ? "success"
                              : order.status === "PENDING"
                              ? "warning"
                              : order.status === "CANCELLED" ||
                                order.status === "REFUNDED"
                              ? "danger"
                              : "primary"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Badge variant={isPaid ? "success" : "warning"}>
                          {isPaid ? "✓ Paid" : "Payment Pending"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                        <span>
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="font-semibold text-gray-800">
                          ₦{order.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {animal && (
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="w-full sm:w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {/* FIX: SafeImage is a Client Component — onError lives there */}
                        <SafeImage
                          src={getFirstImage(animal.images)}
                          alt={animal.name}
                          className="w-full h-full object-cover"
                          fallback="/placeholder-animal.svg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {animal.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {animal.breed || animal.category}
                          {animal.weight ? ` • ${animal.weight} kg` : ""}
                        </p>
                        <p className="text-sm text-gray-400 mb-3">
                          {animal.location ||
                            animal.state ||
                            "Location not specified"}
                        </p>
                        {seller && (
                          <Link
                            href={`/sellers/${seller.id}`}
                            className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                              {seller.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{seller.farm_name || seller.name}</span>
                            {(seller.is_verified ||
                              seller.verification_status === "APPROVED") && (
                              <Badge
                                variant="success"
                                className="!px-2 !py-0 text-xs"
                              >
                                ✓
                              </Badge>
                            )}
                          </Link>
                        )}
                      </div>
                      <div className="flex sm:flex-col sm:items-end justify-between sm:justify-start gap-2">
                        <div className="text-right sm:mb-2">
                          <p className="text-xs text-gray-400">Order Total</p>
                          <p className="text-2xl font-bold text-emerald-600">
                            ₦{order.amount.toLocaleString()}
                          </p>
                        </div>
                        <Link href={`/listings/${animal.id}`}>
                          <Button variant="secondary" size="sm">
                            View Listing
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Order Progress
                    </h3>
                    <OrderTimeline status={order.status} />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}