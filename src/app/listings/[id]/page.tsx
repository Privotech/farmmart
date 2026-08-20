"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon, WarningIcon } from "@/components/ui/Icons";
import { Animal, User } from "@/types";
import { toast } from "react-toastify";

import { useSession } from "@/lib/auth-client";

function getAnimalImages(
  images: string | string[] | null | undefined,
): string[] {
  if (Array.isArray(images)) {
    return images.filter((image): image is string => typeof image === "string");
  }

  if (!images) {
    return [];
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed)
        ? parsed.filter((image): image is string => typeof image === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

export default function AnimalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const [animal, setAnimal] = useState<(Animal & { users?: User }) | null>(
    null,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySending, setInquirySending] = useState(false);

  useEffect(() => {
    const fetchAnimal = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/animals/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setAnimal(result.data);
        } else {
          setError(result.error || "Failed to fetch animal details");
        }
      } catch {
        setError("An error occurred while fetching animal details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAnimal();
    }
  }, [id]);

  const images = animal ? getAnimalImages(animal.images) : [];
  const seller = animal?.users;

  const handleAddToCart = async () => {
    if (!animal) return;
    if (!session || !session.user) {
      toast.info("Please log in to add items to cart");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animalId: animal.id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Added to cart! Proceed to checkout for a protected transaction.",
        );
      } else {
        toast.error(data.error || "Error adding to cart");
      }
    } catch {
      toast.error("Error adding to cart");
    }
  };

  const handleSendInquiry = async () => {
    if (!animal || !seller) return;
    if (!session || !session.user) {
      toast.info("Please log in to send an inquiry");
      return;
    }
    if (!inquiryMessage.trim()) {
      toast.info("Please write a message to the seller");
      return;
    }

    setInquirySending(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId: animal.id,
          receiverId: seller.id,
          message: inquiryMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Inquiry sent! Your conversation will stay on the FarmMart platform.",
        );
        setInquiryOpen(false);
        setInquiryMessage("");
      } else {
        toast.error(data.error || "Error sending inquiry");
      }
    } catch {
      toast.error("Error sending inquiry");
    } finally {
      setInquirySending(false);
    }
  };

  const isSellerVerified =
    seller?.is_verified || seller?.verification_status === "APPROVED";
  const sellerJoinDate = seller?.created_at || seller?.createdAt;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen text-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen">
        <div className="bg-emerald-900/30 text-emerald-400 p-4 rounded-lg border border-emerald-800">
          {error}
        </div>
        <Link href="/buyer/listing">
          <Button variant="primary" className="mt-4">
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen">
      {animal ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <Card className="mb-4">
              <div className="relative w-full h-96">
                <Image
                  src={images[selectedImageIndex] || "/placeholder-animal.jpg"}
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            {images.length > 1 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 ${
                      index === selectedImageIndex
                        ? "border-emerald-500"
                        : "border-gray-700"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${animal.name} ${index}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-100 mb-2">
                {animal.name}
              </h1>
              <p className="text-gray-400 text-lg">
                {animal.breed} • {animal.age} months old
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="primary">{animal.category}</Badge>
                {animal.status === "AVAILABLE" ? (
                  <Badge variant="success">Available</Badge>
                ) : (
                  <Badge variant="danger">Sold Out</Badge>
                )}
                {animal.is_negotiable && (
                  <Badge variant="warning">Price Negotiable</Badge>
                )}
              </div>
            </div>

            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                  <span className="text-gray-400">Price</span>
                  <span className="text-3xl font-bold text-emerald-500">
                    ₦{Number(animal.price).toLocaleString()}
                  </span>
                </div>

                {animal.weight && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Weight</span>
                    <span className="font-semibold text-gray-100">
                      {Number(animal.weight)} kg
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Location</span>
                  <span className="font-semibold text-gray-100">
                    {animal.location}
                    {animal.state ? `, ${animal.state}` : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Views</span>
                  <span className="font-semibold text-gray-100">
                    {animal.view_count || 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Seller Info Card */}
            {seller && (
              <Card>
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-700">
                  <h3 className="text-lg font-bold text-gray-100">
                    Seller Information
                  </h3>
                  {isSellerVerified ? (
                    <Badge
                      variant="success"
                      className="inline-flex items-center gap-1"
                    >
                      <CheckIcon className="w-3.5 h-3.5" /> VERIFIED SELLER
                    </Badge>
                  ) : (
                    <Badge variant="warning">UNVERIFIED SELLER</Badge>
                  )}
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-emerald-700">
                    {seller.avatar_url ? (
                      <Image
                        src={seller.avatar_url}
                        alt={seller.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-emerald-300 font-bold text-xl">
                        {seller.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg text-gray-100">
                      {seller.farm_name || seller.name}
                    </div>
                    {seller.farm_name && (
                      <div className="text-gray-400 text-sm">
                        Owner: {seller.name}
                      </div>
                    )}
                    {seller.state || seller.city ? (
                      <div className="text-gray-400 text-sm mt-1 inline-flex items-center gap-1">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-4 h-4"
                        >
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {seller.city}
                        {seller.city && seller.state ? ", " : ""}
                        {seller.state}
                      </div>
                    ) : null}
                    {seller.bio && (
                      <p className="text-gray-300 text-sm mt-2 whitespace-pre-wrap line-clamp-3">
                        {seller.bio}
                      </p>
                    )}
                    {sellerJoinDate && (
                      <div className="text-gray-500 text-xs mt-2">
                        Member since:{" "}
                        {new Date(
                          sellerJoinDate as string,
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {seller.cac_number && (
                  <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
                    <strong className="text-gray-300">CAC Registered:</strong>{" "}
                    {seller.cac_number}
                  </div>
                )}
                {!isSellerVerified && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-amber-400 text-sm flex items-start gap-2">
                      <WarningIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>
                        This seller has <strong>not</strong> been verified by
                        FarmMart admin. For maximum protection, we recommend
                        buying only from{" "}
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckIcon className="w-4 h-4" /> VERIFIED SELLERS
                        </span>{" "}
                        and completing the full transaction ON the platform.
                      </span>
                    </p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Link href={`/sellers/${seller.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      View Seller Profile →
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            <Card>
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Description
              </h3>
              <p className="text-gray-400 whitespace-pre-wrap">
                {animal.description ||
                  "No detailed description provided by the seller."}
              </p>
            </Card>

            <div className="flex gap-4 flex-wrap">
              {animal.status === "AVAILABLE" ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 inline-flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-5 h-5"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>
                    Add to Cart & Checkout
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="inline-flex items-center justify-center gap-2"
                    onClick={() => setInquiryOpen(!inquiryOpen)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-5 h-5"
                    >
                      <path d="M21 11.5a8.5 8.5 0 01-15.5 4.5L3 21l5-2.5A8.5 8.5 0 1121 11.5z" />
                    </svg>
                    Send Inquiry to Seller
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled
                >
                  Sold Out
                </Button>
              )}

              <Link href="/buyer/listing" className="flex-1">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full inline-flex items-center justify-center gap-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Back to Listings
                </Button>
              </Link>
            </div>

            {/* Inquiry Modal */}
            {inquiryOpen && (
              <Card className="mt-4 border-2 border-emerald-600">
                <h4 className="text-lg font-bold mb-4 text-gray-100 inline-flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5"
                  >
                    <path d="M21 11.5a8.5 8.5 0 01-15.5 4.5L3 21l5-2.5A8.5 8.5 0 1121 11.5z" />
                  </svg>
                  Send Inquiry to{" "}
                  {seller?.farm_name || seller?.name || "Seller"}
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Your message will be delivered via FarmMart&apos;s secure
                  in-app messaging.
                </p>

                <textarea
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder={`Hello ${seller?.name || "Seller"}, I'm interested in this ${animal.name}. Please tell me more about...`}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />

                <div className="flex gap-3 mt-4 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setInquiryOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    isLoading={inquirySending}
                    onClick={handleSendInquiry}
                  >
                    Send Inquiry
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400 mb-4">Animal not found</p>
          <Link href="/buyer/listing">
            <Button variant="primary">Back to Listings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
