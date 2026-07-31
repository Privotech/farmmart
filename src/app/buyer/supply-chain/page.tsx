"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

// Mock supply chain data
const mockShipments = [
  {
    id: "SH-992",
    title: "Batch-992: 50 Berkshire",
    origin: "Emerald Valley Farms, IA",
    destination: "Sterling Pork Group, IL",
    status: "in-transit",
    eta: "Aug 15, 2025",
    currentLocation: "Kansas Terminal 4",
    temperature: "68°F",
    weight: "11,000 lbs"
  },
  {
    id: "SH-985",
    title: "Batch-985: 120 Duroc",
    origin: "Heartland Ag-Corp, NE",
    destination: "Sterling Pork Group, IL",
    status: "delivered",
    eta: "Aug 10, 2025",
    currentLocation: "Delivered",
    temperature: "70°F",
    weight: "24,000 lbs"
  },
  {
    id: "SH-978",
    title: "Batch-978: 30 Yorkshire",
    origin: "Maple Creek Ranch, MN",
    destination: "Sterling Pork Group, IL",
    status: "preparing",
    eta: "Aug 20, 2025",
    currentLocation: "Origin Facility",
    temperature: "65°F",
    weight: "6,900 lbs"
  }
];

export default function BuyerSupplyChainPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [shipments, setShipments] = useState(mockShipments);

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
              <h1 className="text-3xl font-bold text-gray-100 mb-1">Supply Chain</h1>
              <p className="text-sm text-gray-400 font-medium">Track your shipments and logistics</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">In Transit</p>
              <h3 className="text-3xl font-bold text-gray-100">
                {shipments.filter(s => s.status === "in-transit").length}
              </h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Delivered</p>
              <h3 className="text-3xl font-bold text-gray-100">
                {shipments.filter(s => s.status === "delivered").length}
              </h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-600"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Preparing</p>
              <h3 className="text-3xl font-bold text-gray-100">
                {shipments.filter(s => s.status === "preparing").length}
              </h3>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-400"></div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Total Shipments</p>
              <h3 className="text-3xl font-bold text-gray-100">
                {shipments.length}
              </h3>
            </div>
          </div>

          {/* Shipments List */}
          <div className="space-y-6">
            {shipments.map(shipment => (
              <div key={shipment.id} className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-bold text-gray-100">{shipment.title}</h3>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                        shipment.status === "in-transit" ? "bg-blue-900/30 text-blue-400" :
                        shipment.status === "delivered" ? "bg-emerald-900/30 text-emerald-400" :
                        "bg-amber-900/30 text-amber-400"
                      }`}>
                        {shipment.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Origin</p>
                        <p className="text-sm text-gray-300">{shipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Destination</p>
                        <p className="text-sm text-gray-300">{shipment.destination}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Location</p>
                        <p className="text-sm text-gray-300">{shipment.currentLocation}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">ETA</p>
                        <p className="text-sm text-gray-300">{shipment.eta}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Temperature</p>
                        <p className="text-sm text-gray-300">{shipment.temperature}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Weight</p>
                        <p className="text-sm text-gray-300">{shipment.weight}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition text-sm border border-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Track Shipment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
}
