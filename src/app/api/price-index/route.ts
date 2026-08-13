import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const animals = await prisma.animals.findMany({
      where: { status: "AVAILABLE" },
      select: {
        id: true,
        category: true,
        breed: true,
        price: true,
        weight: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    if (animals.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          overall: { avgPricePerKg: 0, change: 0, trend: "flat" },
          byCategory: [],
          byBreed: [],
          history: [],
        },
      });
    }

    const totalWeight = animals.reduce(
      (sum, a) => sum + (a.weight ? Number(a.weight) : 0),
      0,
    );
    const totalValue = animals.reduce(
      (sum, a) => sum + Number(a.price),
      0,
    );
    const avgPricePerKg =
      totalWeight > 0 ? totalValue / totalWeight : totalValue / animals.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAnimals = animals.filter(
      (a) => new Date(a.created_at) >= thirtyDaysAgo,
    );
    const olderAnimals = animals.filter(
      (a) => new Date(a.created_at) < thirtyDaysAgo,
    );

    const recentAvg =
      recentAnimals.length > 0
        ? recentAnimals.reduce((s, a) => s + Number(a.price), 0) /
          recentAnimals.length
        : 0;
    const olderAvg =
      olderAnimals.length > 0
        ? olderAnimals.reduce((s, a) => s + Number(a.price), 0) /
          olderAnimals.length
        : recentAvg;
    const changePercent =
      olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    const categoryMap: Record<
      string,
      { total: number; count: number; weight: number }
    > = {};
    for (const a of animals) {
      if (!categoryMap[a.category])
        categoryMap[a.category] = { total: 0, count: 0, weight: 0 };
      categoryMap[a.category].total += Number(a.price);
      categoryMap[a.category].count += 1;
      categoryMap[a.category].weight += a.weight ? Number(a.weight) : 0;
    }

    const byCategory = Object.entries(categoryMap).map(([cat, v]) => ({
      category: cat,
      avgPrice: v.total / v.count,
      avgPricePerKg: v.weight > 0 ? v.total / v.weight : v.total / v.count,
      listingsCount: v.count,
    }));

    const breedMap: Record<
      string,
      { total: number; count: number; weight: number; category?: string }
    > = {};
    for (const a of animals) {
      const breed = a.breed || "Unknown";
      if (!breedMap[breed])
        breedMap[breed] = {
          total: 0,
          count: 0,
          weight: 0,
          category: a.category,
        };
      breedMap[breed].total += Number(a.price);
      breedMap[breed].count += 1;
      breedMap[breed].weight += a.weight ? Number(a.weight) : 0;
    }

    const byBreed = Object.entries(breedMap)
      .map(([breed, v]) => ({
        breed,
        category: v.category,
        avgPrice: v.total / v.count,
        avgPricePerKg: v.weight > 0 ? v.total / v.weight : v.total / v.count,
        listingsCount: v.count,
      }))
      .sort((a, b) => b.listingsCount - a.listingsCount)
      .slice(0, 12);

    const historyBuckets: Record<string, number[]> = {};
    for (const a of animals) {
      const d = new Date(a.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!historyBuckets[key]) historyBuckets[key] = [];
      historyBuckets[key].push(Number(a.price));
    }
    const history = Object.entries(historyBuckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, prices]) => ({
        date,
        avgPrice: prices.reduce((s, p) => s + p, 0) / prices.length,
        listingsCount: prices.length,
      }))
      .slice(-30);

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          avgPricePerKg,
          change: changePercent,
          trend: changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat",
          totalListings: animals.length,
          totalCategories: Object.keys(categoryMap).length,
          totalBreeds: Object.keys(breedMap).length,
        },
        byCategory,
        byBreed,
        history,
      },
    });
  } catch (error) {
    console.error("Price index error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute price index" },
      { status: 500 },
    );
  }
}
