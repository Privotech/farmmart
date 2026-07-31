"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

// Mock bid data
const mockBids = [
  {
    id: 552,
    title: "Lot #552: Berkshire Select (50 Head)",
    supplier: "Emerald Valley Farms",
    avgWeight: 220,
    currentBid: 18400,
    myBid: 18400,
    status: "leading",
    timeLeft: "02h 45m",
    image: "/placeholder-animal.jpg"
  },
  {
    id: 558,
    title: "Lot #558: Duroc Commercial Grade (120 Head)",
    supplier: "Heartland Ag-Corp",
    avgWeight: 250,
    currentBid: 42100,
    myBid: 41500,
    status: "outbid",
    timeLeft: "00h 12m",
    image: "/placeholder-animal.jpg"
  },
  {
    id: 560,
    title: "Lot #560: Yorkshire Premium (30 Head)",
    supplier: "Maple Creek Ranch",
    avgWeight: 230,
    currentBid: 15200,
    myBid: null,
    status: "open",
    timeLeft: "05h 30m",
    image: "/placeholder-animal.jpg"
  },
  {
    id: 565,
    title: "Lot #565: Hampshire Show Stock (20 Head)",
    supplier: "Sunset Livestock Co.",
    avgWeight: 240,
    currentBid: 22000,
    myBid: 21800,
    status: "leading",
    timeLeft: "01h 15m",
    image: "/placeholder-animal.jpg"
  }
];

export default function BuyerLiveBidsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bids, setBids] = useState(mockBids);
  const [bidInputs, setBidInputs] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "BUYER") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handlePlaceBid = (lotId: number) => {
    const bidAmount = bidInputs[lotId];
    if (!bidAmount) return;
    
    setBids(prev => prev.map(bid => {
      if (bid.id === lotId && bidAmount > bid.currentBid) {
        return { ...bid, currentBid: bidAmount, myBid: bidAmount, status: "leading" };
      }
      return bid;
    }));
    
    alert(`Bid of ₦${bidAmount.toLocaleString()} placed successfully!`);
  };

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-1">Live Bids</h1>
              <p className="text-sm text-gray-400 font-medium">Track and manage your active bidding positions</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Leading Bids</p>
              <h3 className="text-3xl font-bold text-gray-100">
                {bids.filter(b => b.status === "leading").length}
              </h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Outbid Positions</p>
              <h3 className="text-3xl font-bold text-gray-100">
                {bids.filter(b => b.status === "outbid").length}
              </h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Open Auctions</p>
              <h3 className="text-3xl font-bold text-gray-100">
                {bids.length}
              </h3>
            </div>
          </div>

          {/* Bids List */}
          <div className="space-y-6">
            {bids.map(bid => (
              <div key={bid.id} className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-24 h-24 bg-gray-800 rounded-xl relative overflow-hidden flex-shrink-0">
                      <Image 
                        src={bid.image} 
                        alt={bid.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-100 mb-2">{bid.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Supplier: <span className="text-emerald-500 font-medium">{bid.supplier}</span> • Avg. {bid.avgWeight} lbs
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                          bid.status === "leading" ? "bg-emerald-900/30 text-emerald-400" :
                          bid.status === "outbid" ? "bg-red-900/30 text-red-400" :
                          "bg-blue-900/30 text-blue-400"
                        }`}>
                          {bid.status.toUpperCase()}
                        </span>

                        <span className="text-gray-500 text-sm font-bold flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {bid.timeLeft} remaining
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Bid</p>
                      <p className="text-2xl font-bold text-emerald-500">₦{bid.currentBid.toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <input
                        type="number"
                        value={bidInputs[bid.id] || ""}
                        onChange={(e) => setBidInputs(prev => ({ 
                          ...prev, 
                          [bid.id]: Number(e.target.value) 
                        }))}
                        placeholder="Enter bid"
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-100 placeholder-gray-500"
                        min={bid.currentBid + 100}
                      />
                      
                      <Button
                        variant="primary"
                        onClick={() => handlePlaceBid(bid.id)}
                        disabled={!bidInputs[bid.id] || bidInputs[bid.id] <= bid.currentBid}
                        className="text-sm"
                      >
                        Place Bid
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
}
