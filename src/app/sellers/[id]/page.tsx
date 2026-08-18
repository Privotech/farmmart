import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimalCard } from "@/components/features/AnimalCard";
import { CheckIcon, MapPinIcon, ClockIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { CloudinaryImage } from "@/components/CloudinaryImage";

export const dynamic = "force-dynamic";

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const seller = await prisma.users.findUnique({
    where: {
      id,
      role: "SELLER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar_url: true,
      address: true,
      state: true,
      city: true,
      is_verified: true,
      verification_status: true,
      bio: true,
      farm_name: true,
      farm_address: true,
      cac_number: true,
      created_at: true,
    },
  });

  if (!seller) {
    notFound();
  }

  const completedSales = await prisma.orders.count({
    where: {
      animals: {
        seller_id: seller.id,
      },
      status: "DELIVERED",
    },
  });

  const reviewsAggregate = await prisma.reviews.aggregate({
    where: {
      animals: {
        seller_id: seller.id,
      },
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const avgRating = reviewsAggregate._avg.rating;
  const reviewCount = reviewsAggregate._count.rating;

  const activeListings = await prisma.animals.findMany({
    where: {
      seller_id: seller.id,
      status: "AVAILABLE",
    },
    orderBy: { created_at: "desc" },
    take: 12,
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          farm_name: true,
          avatar_url: true,
          is_verified: true,
          verification_status: true,
        },
      },
    },
  });

  const memberSince = new Date(seller.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const location = [seller.city, seller.state].filter(Boolean).join(", ") ||
    seller.farm_address ||
    seller.address ||
    "Location not specified";

  const displayName = seller.farm_name || seller.name;

  function renderStars(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const fill = i < fullStars ? "#10b981" : i === fullStars && hasHalf ? "#10b981" : "#4b5563";
      stars.push(
        <svg key={i} viewBox="0 0 24 24" className="w-5 h-5 inline-block" fill={fill}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>,
      );
    }

    return stars;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Card className="overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 h-32 -mx-6 -mt-6 mb-0" />
          <div className="px-0 pb-0 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 px-6 pb-6">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-emerald-900 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  {seller.avatar_url ? (
                    <CloudinaryImage
                      src={seller.avatar_url}
                      alt={displayName}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-emerald-200">
                      {seller.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {(seller.is_verified || seller.verification_status === "APPROVED") && (
                  <div className="absolute bottom-1 right-1 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <CheckIcon className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-emerald-100">
                        {displayName}
                      </h1>
                      {(seller.is_verified || seller.verification_status === "APPROVED") && (
                        <Badge variant="success" className="inline-flex items-center gap-1">
                          <CheckIcon className="w-3.5 h-3.5" /> Verified Seller
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-emerald-400 mb-3">
                      <div className="inline-flex items-center gap-1.5 text-sm">
                        <MapPinIcon className="w-4 h-4" />
                        {location}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-sm">
                        <ClockIcon className="w-4 h-4" />
                        Member since {memberSince}
                      </div>
                    </div>

                    {seller.bio && (
                      <p className="text-emerald-300/80 max-w-2xl leading-relaxed">
                        {seller.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-800/50">
                  <div className="text-center md:text-left">
                    <p className="text-3xl font-bold text-emerald-300">{completedSales}</p>
                    <p className="text-sm text-emerald-400/70 mt-1">Completed Sales</p>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex items-center md:justify-start justify-center gap-1.5 mb-0.5">
                      <p className="text-3xl font-bold text-emerald-300">
                        {avgRating ? avgRating.toFixed(1) : "0.0"}
                      </p>
                      <div className="inline-flex">{avgRating ? renderStars(avgRating) : null}</div>
                    </div>
                    <p className="text-sm text-emerald-400/70 mt-1">
                      {reviewCount > 0 ? `${reviewCount} reviews` : "No reviews yet"}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-3xl font-bold text-emerald-300">{activeListings.length}</p>
                    <p className="text-sm text-emerald-400/70 mt-1">Active Listings</p>
                  </div>
                  <div className="text-center md:text-left">
                    <Link href={`/buyer/listings?seller=${encodeURIComponent(seller.id)}`}>
                      <Button variant="primary" className="w-full md:w-auto">
                        View All Listings
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {avgRating && reviewCount > 0 ? (
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-emerald-100 mb-4 flex items-center gap-2">
              <div className="inline-flex mr-1">{renderStars(avgRating)}</div>
              <span>{avgRating.toFixed(1)} out of 5</span>
              <span className="text-sm font-normal text-emerald-400">
                ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
              </span>
            </h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage = star === Math.round(avgRating) ? (avgRating % 1) * 100 : star < avgRating ? 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-emerald-400 text-right">{star} ★</span>
                    <div className="flex-1 h-2 bg-emerald-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${percentage || (star === 5 && reviewCount > 0 ? 75 : star === 4 ? 20 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : null}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Active Listings
              <span className="ml-2 text-lg font-normal text-gray-500">
                ({activeListings.length})
              </span>
            </h2>
            {activeListings.length > 0 && (
              <Link href={`/buyer/listings?seller=${encodeURIComponent(seller.id)}`}>
                <Button variant="secondary" size="sm">
                  See All →
                </Button>
              </Link>
            )}
          </div>

          {activeListings.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-5xl mb-4">🐄</div>
              <p className="text-gray-600 text-lg mb-2">No active listings yet</p>
              <p className="text-gray-400 text-sm">Check back soon for new animals from this seller</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeListings.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
