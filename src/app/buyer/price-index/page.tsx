"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type BreedStat = {
  breed: string;
  category?: string;
  avgPrice: number;
  avgPricePerKg: number;
  listingsCount: number;
};

type CategoryStat = {
  category: string;
  avgPrice: number;
  avgPricePerKg: number;
  listingsCount: number;
};

type HistoryPoint = {
  date: string;
  avgPrice: number;
  listingsCount: number;
};

export default function BuyerPriceIndexPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");
  const [isLoading, setIsLoading] = useState(true);
  const [overall, setOverall] = useState<{
    avgPricePerKg: number;
    change: number;
    trend: "up" | "down" | "flat";
    totalListings: number;
    totalCategories: number;
    totalBreeds: number;
  } | null>(null);
  const [byCategory, setByCategory] = useState<CategoryStat[]>([]);
  const [byBreed, setByBreed] = useState<BreedStat[]>([]);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "BUYER") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/price-index")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setOverall(res.data.overall);
          setByCategory(res.data.byCategory);
          setByBreed(res.data.byBreed);
          setHistory(res.data.history);
        }
      })
      .catch((e) => console.error("Price index error:", e))
      .finally(() => setIsLoading(false));
  }, []);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#121212]">
        Loading...
      </div>
    );
  }

  const timeframeLabel =
    timeframe === "day" ? "24 hours" : timeframe === "week" ? "7 days" : "30 days";

  const changeDirection = overall?.change
    ? overall.change > 0
      ? "up"
      : overall.change < 0
        ? "down"
        : "flat"
    : "flat";

  const maxPrice =
    history.length > 0
      ? Math.max(...history.map((h) => h.avgPrice), 1)
      : 1;

  return (
    <div className="p-8 bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-1">Price Index</h1>
          <p className="text-sm text-gray-400 font-medium">
            Live market trends derived from actual listings across the platform
          </p>
        </div>

        <div className="flex bg-gray-900 rounded-lg p-1 shadow-sm border border-gray-800">
          {(
            [
              ["day", "Daily"],
              ["week", "Weekly"],
              ["month", "Monthly"],
            ] as const
          ).map(([tf, label]) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition ${
                timeframe === tf
                  ? "bg-gray-800 text-emerald-400"
                  : "text-gray-500 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Price Display */}
      <div className="bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-800 mb-8">
        {isLoading ? (
          <div className="flex items-center gap-8">
            <div className="space-y-4 flex-1">
              <div className="h-4 bg-gray-800 rounded w-48 animate-pulse"></div>
              <div className="h-12 bg-gray-800 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded w-32 animate-pulse"></div>
            </div>
            <div className="lg:col-span-2 h-48 bg-gray-800 rounded-2xl w-full animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Market Price Index
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-100">
                  ₦{overall?.avgPricePerKg ? overall.avgPricePerKg.toFixed(2) : "0.00"}
                </span>
                <span className="text-lg font-bold text-gray-500">/ kg</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`font-bold text-lg flex items-center gap-1 ${
                    changeDirection === "up"
                      ? "text-emerald-500"
                      : changeDirection === "down"
                        ? "text-red-500"
                        : "text-gray-400"
                  }`}
                >
                  {changeDirection === "up" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  ) : changeDirection === "down" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14"
                      />
                    </svg>
                  )}
                  {Math.abs(overall?.change ?? 0).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-400">
                  vs last {timeframeLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Listings
                  </p>
                  <p className="text-2xl font-bold text-gray-100">
                    {overall?.totalListings ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Categories
                  </p>
                  <p className="text-2xl font-bold text-gray-100">
                    {overall?.totalCategories ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Breeds
                  </p>
                  <p className="text-2xl font-bold text-gray-100">
                    {overall?.totalBreeds ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="lg:col-span-2 h-56 bg-gray-800 rounded-2xl p-6 flex items-end justify-between gap-2 border border-gray-700">
              {history.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  Insufficient data to build price history chart. Listings must
                  be created on different dates.
                </div>
              ) : (
                history.map((item, i) => {
                  const heightPct =
                    Math.round((item.avgPrice / maxPrice) * 100) || 5;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 flex-1 h-full justify-end"
                      title={`${item.date}: ₦${item.avgPrice.toFixed(0)}`}
                    >
                      <span className="text-[9px] text-gray-500 font-bold">
                        ₦{Math.round(item.avgPrice / 1000)}k
                      </span>
                      <div
                        className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600 relative"
                        style={{
                          height: `${heightPct}%`,
                          minHeight: 8,
                        }}
                      />
                      <span className="text-[10px] text-gray-500 font-bold">
                        {item.date.split("-").slice(1).join("/")}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Prices */}
      {byCategory.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-100">
              Prices by Category
            </h3>
            <Link href="/listings">
              <Button variant="secondary" className="text-sm">
                Browse All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {byCategory.map((cat) => (
              <div
                key={cat.category}
                className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 hover:border-emerald-800 transition"
              >
                <h3 className="text-lg font-bold text-gray-100 mb-4 capitalize">
                  {cat.category.toLowerCase()}
                </h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-100">
                    ₦{cat.avgPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-bold mb-3">
                  Avg listing price
                </p>
                {cat.avgPricePerKg !== cat.avgPrice && (
                  <p className="text-xs text-gray-400 mb-3">
                    ≈ ₦{cat.avgPricePerKg.toFixed(0)} / kg
                  </p>
                )}
                <span className="inline-block bg-emerald-900/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {cat.listingsCount} listings
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breed Comparison */}
      {byBreed.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-100 mb-6">
            Top Breeds by Volume
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {byBreed.slice(0, 8).map((breed) => (
              <div
                key={breed.breed}
                className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800"
              >
                <h3 className="text-lg font-bold text-gray-100 mb-4 truncate">
                  {breed.breed}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-100">
                    ₦{Number(breed.avgPrice).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">avg</span>
                </div>
                <span className="inline-block bg-blue-900/30 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {breed.listingsCount} listings
                </span>
                {breed.category && (
                  <span className="ml-2 inline-block bg-gray-800 text-gray-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {breed.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Insights */}
      <div className="bg-gray-800 p-8 rounded-[32px] border border-gray-700">
        <h3 className="text-xl font-bold text-gray-100 mb-6">Market Insights</h3>
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-emerald-400"
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
                <h4 className="font-bold text-gray-100 mb-1">
                  Live Market Snapshot
                </h4>
                <p className="text-sm text-gray-400">
                  {overall?.totalListings
                    ? `${overall.totalListings} active listings across ${overall.totalCategories} categories. Prices are ${
                        changeDirection === "up"
                          ? "trending upward"
                          : changeDirection === "down"
                            ? "trending downward"
                            : "relatively flat"
                      } — ${Math.abs(overall?.change ?? 0).toFixed(1)}% vs. last ${timeframeLabel}.`
                    : "No listings available yet — prices will populate as sellers create listings."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-100 mb-1">
                  Category Comparison
                </h4>
                <p className="text-sm text-gray-400">
                  {byCategory.length > 1
                    ? (() => {
                        const sorted = [...byCategory].sort(
                          (a, b) => b.avgPrice - a.avgPrice,
                        );
                        const highest = sorted[0];
                        const lowest = sorted[sorted.length - 1];
                        return `${highest.category.toLowerCase()} currently commands the highest average price at ₦${Number(
                          highest.avgPrice,
                        ).toLocaleString()}, while ${lowest.category.toLowerCase()} is the most affordable category at ₦${Number(
                          lowest.avgPrice,
                        ).toLocaleString()}.`;
                      })()
                    : "More categories are needed to compare relative pricing."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
