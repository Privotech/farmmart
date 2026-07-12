import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { BuyerListingsClient } from "./BuyerListingsClient";

export default async function BuyerListingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "BUYER") {
    redirect("/login");
  }

  // Parse searchParams
  const category = searchParams.type as string;
  const minPrice = searchParams.minPrice as string;
  const maxPrice = searchParams.maxPrice as string;
  const search = searchParams.search as string;
  const sortBy = searchParams.sortBy as string;

  const where: any = {
    status: "AVAILABLE",
  };

  if (category) {
    where.category = category.toUpperCase();
  }

  if (minPrice) where.price = { gte: parseFloat(minPrice) };
  if (maxPrice) {
    where.price = where.price || {};
    where.price.lte = parseFloat(maxPrice);
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { breed: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = {};
  switch (sortBy) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const animalsData = await prisma.animals.findMany({
    where,
    orderBy,
    include: { users: true },
  });

  const animals = animalsData.map((a) => ({
    ...a,
    type: a.category.toLowerCase().replace("_", " "),
    price: Number(a.price),
    sellerId: a.seller_id,
    sellerName: a.users?.name,
    sellerRating: undefined,
  }));

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-emerald-100 mb-1">
                Browse Marketplace
              </h1>
              <p className="text-sm text-emerald-400 font-medium">
                Find and procure quality livestock
              </p>
            </div>
          </div>

          <BuyerListingsClient animals={animals as any} />
        </div>
      </main>
    </div>
  );
}
