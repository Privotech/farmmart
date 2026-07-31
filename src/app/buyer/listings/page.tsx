import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BuyerListingsClient } from "./BuyerListingsClient";

export default async function BuyerListingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  if (!session?.userId || session.role !== "BUYER") {
    redirect("/login");
  }

  const category = searchParams.type as string;
  const minPrice = searchParams.minPrice as string;
  const maxPrice = searchParams.maxPrice as string;
  const search = searchParams.search as string;
  const sortBy = searchParams.sortBy as string;

  const where: Record<string, unknown> = { status: "AVAILABLE" };

  if (category) where.category = category.toUpperCase();
  if (minPrice) where.price = { gte: parseFloat(minPrice) };
  if (maxPrice) {
    where.price = { ...(where.price as object || {}), lte: parseFloat(maxPrice) };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { breed: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderByMap: Record<string, object> = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    oldest: { created_at: "asc" },
  };
  const orderBy = orderByMap[sortBy] || { created_at: "desc" };

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
    <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-emerald-100 mb-1">Browse Marketplace</h1>
              <p className="text-sm text-emerald-400 font-medium">Find and procure quality livestock</p>
            </div>
          </div>
          <BuyerListingsClient animals={animals as never} />
        </div>
  );
}
