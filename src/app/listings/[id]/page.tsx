"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Animal } from "@/types";

import { useSession } from "@/lib/auth-client";

export default function AnimalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleAddToCart = async () => {
    if (!animal) return;
    if (!session || !session.user) {
      alert("Please log in to add items to cart");
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalId: animal.id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Added to cart!");
      } else {
        alert(data.error || "Error adding to cart");
      }
    } catch {
      alert("Error adding to cart");
    }
  };


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
        <div className="bg-emerald-900/30 text-emerald-400 p-4 rounded-lg border border-emerald-800">{error}</div>
        <Link href="/listings">
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
                  src={
                    JSON.parse(animal.images || "[]")[selectedImageIndex] ||
                    "/placeholder-animal.jpg"
                  }
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            {JSON.parse(animal.images || "[]").length > 1 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800">
                {JSON.parse(animal.images || "[]").map((image: string, index: number) => (
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
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-100 mb-2">
                {animal.name}
              </h1>
              <p className="text-gray-400 text-lg">
                {animal.breed} • {animal.age} months old
              </p>
            </div>

            <Card className="mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                  <span className="text-gray-400">Price</span>
                  <span className="text-3xl font-bold text-emerald-500">
                    ₦{animal.price.toLocaleString()}
                  </span>
                </div>

                {animal.weight && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Weight</span>
                    <span className="font-semibold text-gray-100">{animal.weight} kg</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Location</span>
                  <span className="font-semibold text-gray-100">{animal.location}</span>
                </div>

                <div className="flex gap-2">
                  <Badge variant="primary">{animal.category}</Badge>
                  <Badge variant="success">{animal.health_status}</Badge>
                  <Badge variant={animal.status === "AVAILABLE" ? "success" : "primary"}>
                    {animal.status === "AVAILABLE" ? "Available" : "Sold Out"}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-100">Description</h3>
              <p className="text-gray-400 whitespace-pre-wrap">
                {animal.description}
              </p>
            </Card>

            <div className="flex gap-4">
              {animal.status === "AVAILABLE" ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
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

              <Link href="/listings" className="flex-1">
                <Button variant="secondary" size="lg" className="w-full">
                  Back to Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400 mb-4">Animal not found</p>
          <Link href="/listings">
            <Button variant="primary">Back to Listings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
