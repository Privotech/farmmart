import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";

export default async function BuyerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "BUYER") {
    redirect("/login");
  }

  const orders = await prisma.orders.findMany({
    where: { buyer_id: session.user.id },
  });

  const totalSpend = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-emerald-100 mb-1">
                Welcome, {session.user?.name || "Green Valley Ranch Group"}
              </h1>
              <p className="text-sm text-emerald-400 font-medium">
                Market status: <span className="text-emerald-400 font-bold">Open</span> • Last price index update 4m ago.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/buyer/listings">
                <button className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Browse Marketplace
                </button>
              </Link>
              <button className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Contract Vault
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-950 p-6 rounded-2xl shadow-sm border border-emerald-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4">Total Spend (Q3)</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-emerald-100">₦{totalSpend.toLocaleString()}</h3>
                    <span className="text-emerald-400 text-xs font-bold">↑ 12%</span>
                  </div>
                </div>

                <div className="bg-emerald-950 p-6 rounded-2xl shadow-sm border border-emerald-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4">Active Bids</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-emerald-100">14</h3>
                    <span className="text-emerald-400 text-xs font-bold">Across 4 suppliers</span>
                  </div>
                </div>

                <div className="bg-emerald-950 p-6 rounded-2xl shadow-sm border border-emerald-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-700"></div>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4">Pending Deliveries</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-emerald-100">2,450</h3>
                    <span className="text-emerald-400 text-xs font-bold">Heads in transit</span>
                  </div>
                </div>
              </div>

              {/* Active Bidding Section */}
              <div className="bg-emerald-900 p-8 rounded-[32px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-emerald-100">Active Bidding Section</h2>
                  <Link href="/buyer/live-bids" className="text-emerald-400 text-sm font-bold hover:underline">View All Bids</Link>
                </div>

                <div className="space-y-4">
                  {/* Bid Card 1 */}
                  <div className="bg-emerald-950 p-6 rounded-2xl flex items-center justify-between shadow-sm border border-emerald-800">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-emerald-900 rounded-xl relative overflow-hidden">
                        <Image src="/placeholder-animal.jpg" alt="Animal" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-100 text-lg">Lot #552: Holstein Select (50 Head)</h4>
                        <p className="text-sm text-emerald-400">Supplier: <span className="text-emerald-400">Emerald Valley Farms</span> • Avg. 220 kg</p>
                        <div className="flex gap-2 mt-3">
                          <span className="bg-emerald-900/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded uppercase">Leading</span>
                          <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            02h 45m remaining
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Current Bid</p>
                      <p className="text-2xl font-bold text-emerald-400">₦18,400</p>
                    </div>
                  </div>

                  {/* Bid Card 2 */}
                  <div className="bg-emerald-950 p-6 rounded-2xl flex items-center justify-between shadow-sm border border-emerald-800">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-emerald-900 rounded-xl relative overflow-hidden">
                        <Image src="/placeholder-animal.jpg" alt="Animal" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-100 text-lg">Lot #558: Angus Commercial Grade (120 Head)</h4>
                        <p className="text-sm text-emerald-400">Supplier: <span className="text-emerald-400">Heartland Ag-Corp</span> • Avg. 250 kg</p>
                        <div className="flex gap-2 mt-3">
                          <span className="bg-emerald-900/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded uppercase">Outbid</span>
                          <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            00h 12m remaining
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Current Bid</p>
                      <p className="text-2xl font-bold text-emerald-400">₦42,100</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Insights */}
              <div className="bg-emerald-900 p-8 rounded-[32px] grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-emerald-100">Market Insights</h3>
                    <div className="flex bg-emerald-950 rounded-lg p-1 shadow-sm border border-emerald-700">
                      <button className="px-3 py-1 text-[10px] font-bold rounded-md bg-emerald-900 text-emerald-400">Daily</button>
                      <button className="px-3 py-1 text-[10px] font-bold rounded-md text-emerald-500">Weekly</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Live Animal Index</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-emerald-100">$1.12</span>
                        <span className="text-sm text-emerald-500 font-bold">/ kg</span>
                      </div>
                    </div>
                    <div className="flex-1 h-12 relative">
                      {/* Simple SVG Chart Representation */}
                      <svg className="w-full h-full" viewBox="0 0 100 40">
                        <path d="M0 35 L20 30 L40 32 L60 25 L80 20 L100 15" fill="none" stroke="#10b981" strokeWidth="3" />
                        <path d="M0 35 L20 30 L40 32 L60 25 L80 20 L100 15 L100 40 L0 40 Z" fill="rgba(16,185,129,0.1)" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-emerald-400 leading-relaxed">
                    The index has increased by <span className="text-emerald-400 font-bold">3.2%</span> over the last 24 hours due to tightening supply across all livestock categories.
                  </p>
                </div>
                <div className="bg-emerald-950 p-6 rounded-2xl border border-emerald-800 flex gap-4">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-100 mb-2">Procurement Tip</h4>
                    <p className="text-sm text-emerald-400 leading-relaxed">
                      Forward contracts for Holstein-cross cattle in September are currently trading at a 5% discount compared to spot prices.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Recent Activity */}
            <div className="bg-emerald-950 p-8 rounded-[32px] shadow-sm border border-emerald-800 flex flex-col h-full relative">
              <h3 className="text-xl font-bold text-emerald-100 mb-8">Recent Activity</h3>
              
              <div className="space-y-8 flex-1">
                {/* Activity 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-100 text-sm mb-1">Bid Placed on Lot #560</h5>
                    <p className="text-[11px] text-emerald-400 leading-tight mb-1">Amount: $12,500 for 40 head. Pending confirmation from seller.</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">2 MINUTES AGO</p>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-100 text-sm mb-1">Logistics Update</h5>
                    <p className="text-[11px] text-emerald-400 leading-tight mb-1">Batch-992 has cleared health inspection at Kansas Terminal 4.</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">1 HOUR AGO</p>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-100 text-sm mb-1">Contract Finalized</h5>
                    <p className="text-[11px] text-emerald-400 leading-tight mb-1">Emerald Valley Farms Q3 Master Agreement signed by all parties.</p>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase">3 HOURS AGO</p>
                  </div>
                </div>

                {/* Activity 4 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-100 text-sm mb-1">System Alert</h5>
                    <p className="text-[11px] text-emerald-400 leading-tight mb-1">Market volatility threshold exceeded for Angus breeds.</p>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase">YESTERDAY</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <button className="text-emerald-600 text-xs font-bold mb-8 hover:underline">Load Full History</button>
                <button className="w-12 h-12 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-emerald-700 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
