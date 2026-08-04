"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Mock price index data
const breedData = [
  { name: "Berkshire", price: 0.84, change: 3.2, trend: "up" },
  { name: "Duroc", price: 0.78, change: 1.5, trend: "up" },
  { name: "Yorkshire", price: 0.72, change: -0.8, trend: "down" },
  { name: "Hampshire", price: 0.81, change: 2.1, trend: "up" }
];

const priceHistory = [
  { date: "Jul 1", price: 0.75 },
  { date: "Jul 5", price: 0.76 },
  { date: "Jul 10", price: 0.74 },
  { date: "Jul 15", price: 0.78 },
  { date: "Jul 20", price: 0.79 },
  { date: "Jul 25", price: 0.81 },
  { date: "Jul 30", price: 0.82 },
  { date: "Aug 5", price: 0.84 }
];

export default function BuyerPriceIndexPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [timeframe, setTimeframe] = useState("week"); // day, week, month, year

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "BUYER") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-1">Price Index</h1>
              <p className="text-sm text-gray-400 font-medium">Monitor market trends and price movements</p>
            </div>

            <div className="flex bg-gray-900 rounded-lg p-1 shadow-sm border border-gray-800">
              <button 
                onClick={() => setTimeframe("day")}
                className={`px-4 py-2 text-xs font-bold rounded-md transition ${
                  timeframe === "day" ? "bg-gray-800 text-emerald-400" : "text-gray-500 hover:text-gray-200"
                }`}
              >
                Daily
              </button>
              <button 
                onClick={() => setTimeframe("week")}
                className={`px-4 py-2 text-xs font-bold rounded-md transition ${
                  timeframe === "week" ? "bg-gray-800 text-emerald-400" : "text-gray-500 hover:text-gray-200"
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setTimeframe("month")}
                className={`px-4 py-2 text-xs font-bold rounded-md transition ${
                  timeframe === "month" ? "bg-gray-800 text-emerald-400" : "text-gray-500 hover:text-gray-200"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Main Price Display */}
          <div className="bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-800 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Live Pig Index</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-gray-100">$0.84</span>
                  <span className="text-lg font-bold text-gray-500">/ lb</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold text-lg flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    3.2%
                  </span>
                  <span className="text-sm text-gray-400">vs last {timeframe}</span>
                </div>
              </div>

              {/* Chart Area */}
              <div className="lg:col-span-2 h-48 bg-gray-800 rounded-2xl p-6 flex items-end justify-between gap-2 border border-gray-700">
                {priceHistory.map((item, i) => {
                  const height = ((item.price - 0.7) / 0.15) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600"
                        style={{ height: `${height}%`, minHeight: 20 }}
                      />
                      <span className="text-[10px] text-gray-500 font-bold">{item.date.split(" ")[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Breed Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {breedData.map(breed => (
              <div key={breed.name} className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800">
                <h3 className="text-lg font-bold text-gray-100 mb-4">{breed.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-100">${breed.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 font-bold">/ lb</span>
                </div>
                <span className={`text-sm font-bold flex items-center gap-1 ${
                  breed.trend === "up" ? "text-emerald-500" : "text-red-500"
                }`}>
                  {breed.trend === "up" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {Math.abs(breed.change)}%
                </span>
              </div>
            ))}
          </div>

          {/* Market Insights */}
          <div className="bg-gray-800 p-8 rounded-[32px] border border-gray-700">
            <h3 className="text-xl font-bold text-gray-100 mb-6">Market Insights</h3>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100 mb-1">Supply Tightening</h4>
                    <p className="text-sm text-gray-400">Midwest corridor supplies down 5% week-over-week, driving price increases for premium breeds.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100 mb-1">Forward Contracts</h4>
                    <p className="text-sm text-gray-400">September forward contracts trading at 5% discount vs spot - consider locking in rates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
