"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Animal } from "@/types";

function getImageUrl(imagesRaw: unknown): string {
  if (!imagesRaw) return "/placeholder-animal.jpg";
  let parsed: unknown = imagesRaw;
  while (typeof parsed === "string") {
    const trimmed = parsed.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;
    if (trimmed.startsWith("[") || trimmed.startsWith('"')) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        break;
      }
    } else {
      break;
    }
  }
  if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
    return parsed[0];
  }
  return "/placeholder-animal.jpg";
}

function formatTimeLeft(createdAt: Date | string): string {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const ageMs = now - created;
  const durationMs = 7 * 24 * 60 * 60 * 1000 - ageMs;
  if (durationMs <= 0) return "Ending soon";
  const days = Math.floor(durationMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((durationMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function BuyerLiveBidsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [inquiries, setInquiries] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inquiryInputs, setInquiryInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "BUYER") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      Promise.all([
        fetch("/api/animals?status=AVAILABLE&limit=12").then((r) => r.json()),
        fetch("/api/inquiries").then((r) => r.json()),
      ])
        .then(([animalsRes, inquiriesRes]) => {
          if (animalsRes.success) setAnimals(animalsRes.data);
          if (inquiriesRes.success) setInquiries(inquiriesRes.data);
        })
        .catch((e) => console.error("Live bids fetch error:", e))
        .finally(() => setIsLoading(false));
    }
  }, [session]);

  const userInquiryAnimalIds = new Set(
    inquiries
      .filter((i: any) => i.sender_id === session?.user?.id)
      .map((i: any) => i.animal_id),
  );

  const handleSendInquiry = async (animalId: string, animal: Animal) => {
    const msg = inquiryInputs[animalId]?.trim();
    if (!msg) return;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId,
          receiverId: animal.seller_id || (animal as any).users?.id,
          message: msg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiryInputs((p) => ({ ...p, [animalId]: "" }));
        setInquiries((prev) => [...(prev as any), data.data]);
        alert("Inquiry sent to seller!");
      } else {
        alert(data.error || "Failed to send inquiry");
      }
    } catch {
      alert("Error sending inquiry");
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#121212]">
        Loading...
      </div>
    );
  }

  const myInquiriesCount = inquiries.filter(
    (i: any) => i.sender_id === session.user.id,
  ).length;

  const activeMarketListings = animals.length;

  return (
    <div className="p-8 bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-1">
            Live Marketplace
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Browse live listings and send inquiries to sellers directly
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/listings">
            <Button variant="secondary">Full Marketplace</Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Active Listings
          </p>
          <h3 className="text-3xl font-bold text-gray-100">
            {activeMarketListings}
          </h3>
          <p className="text-emerald-500 text-xs font-bold mt-2">
            Available across all categories
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            My Inquiries Sent
          </p>
          <h3 className="text-3xl font-bold text-gray-100">
            {myInquiriesCount}
          </h3>
          <p className="text-amber-500 text-xs font-bold mt-2">
            Sent to sellers
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Open for Negotiation
          </p>
          <h3 className="text-3xl font-bold text-gray-100">
            {animals.filter((a) => a.is_negotiable || a.isNegotiable).length}
          </h3>
          <p className="text-blue-500 text-xs font-bold mt-2">
            Negotiable listings
          </p>
        </div>
      </div>

      {/* Listing Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 animate-pulse"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-800 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : animals.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-12 rounded-2xl text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-100 mb-2">
            No active listings
          </h3>
          <p className="text-gray-400 mb-6">
            Check back soon — new livestock listings are added daily by
            verified sellers.
          </p>
          <Link href="/listings">
            <Button variant="primary">Go to Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {animals.map((animal) => {
            const inquired = userInquiryAnimalIds.has(animal.id);
            const seller = (animal as any).users;
            const negotiable = animal.is_negotiable || animal.isNegotiable;
            return (
              <div
                key={animal.id}
                className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 hover:border-emerald-800 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6 flex-1 min-w-0">
                    <div className="w-24 h-24 bg-gray-800 rounded-xl relative overflow-hidden flex-shrink-0">
                      <Image
                        src={getImageUrl(animal.images)}
                        alt={animal.name || "Livestock"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-100 truncate">
                          {animal.name}
                          {animal.category
                            ? ` • ${animal.category.charAt(0).toUpperCase()}${animal.category.slice(1).toLowerCase()}`
                            : ""}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          {negotiable && (
                            <span className="bg-amber-900/30 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                              Negotiable
                            </span>
                          )}
                          {inquired && (
                            <span className="bg-blue-900/30 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                              Inquiry Sent
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 mb-3 truncate">
                        Seller:{" "}
                        <span className="text-emerald-400 font-medium">
                          {seller?.farm_name || seller?.name || "Verified Seller"}
                        </span>
                        {animal.breed ? ` • ${animal.breed}` : ""}
                        {animal.age ? ` • ${animal.age} mo` : ""}
                        {animal.weight ? ` • ${animal.weight}kg` : ""}
                      </p>

                      <div className="flex items-center gap-4 flex-wrap">
                        {animal.state || animal.location ? (
                          <span className="text-gray-500 text-xs font-bold flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                              />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {animal.state || animal.location}
                          </span>
                        ) : null}

                        <span className="text-gray-500 text-xs font-bold flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Listed {formatTimeLeft(animal.createdAt || animal.created_at!)} ago
                        </span>

                        {seller?.is_verified ? (
                          <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Verified Seller
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Price
                      </p>
                      <p className="text-2xl font-bold text-emerald-500">
                        ₦{Number(animal.price).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <input
                        type="text"
                        value={inquiryInputs[animal.id] || ""}
                        onChange={(e) =>
                          setInquiryInputs((p) => ({
                            ...p,
                            [animal.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          negotiable
                            ? "Your offer / message..."
                            : "Message seller..."
                        }
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-100 placeholder-gray-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleSendInquiry(animal.id, animal)}
                          disabled={!inquiryInputs[animal.id]?.trim()}
                          className="text-sm flex-1"
                        >
                          {negotiable ? "Make Offer" : "Send Inquiry"}
                        </Button>
                        <Link href={`/listings`}>
                          <Button variant="secondary" className="text-sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
