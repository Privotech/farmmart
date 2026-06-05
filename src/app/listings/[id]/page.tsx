"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Animal } from "@/types";
import { localStorageDb } from "@/lib/localStorageDb";
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
    const fetchAnimal = () => {
      setIsLoading(true);
      setError("");

      try {
        const data = localStorageDb.getAnimalById(id);
        if (data) {
          setAnimal(data);
        } else {
          setError("Failed to fetch animal details");
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
      localStorageDb.addToCart(session.user.email, animal.id, 1);
      alert("Added to cart!");
    } catch {
      alert("Error adding to cart");
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>
        <Link href="/listings">
          <Button variant="primary" className="mt-4">
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {animal ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <Card className="mb-4">
              <div className="relative w-full h-96">
                <Image
                  src={
                    animal.images[selectedImageIndex] ||
                    "/placeholder-animal.jpg"
                  }
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            {animal.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {animal.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 border-2 rounded-lg overflow-hidden ${
                      index === selectedImageIndex
                        ? "border-green-600"
                        : "border-gray-300"
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {animal.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {animal.breed} • {animal.age} months old
              </p>
            </div>

            <Card className="mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Price</span>
                  <span className="text-3xl font-bold text-green-600">
                    ₦{animal.price.toLocaleString()}
                  </span>
                </div>

                {animal.weight && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-semibold">{animal.weight} kg</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{animal.location}</span>
                </div>

                <div className="flex gap-2">
                  <Badge variant="primary">{animal.type}</Badge>
                  <Badge variant="success">{animal.health_status}</Badge>
                  <Badge variant={animal.available ? "success" : "danger"}>
                    {animal.available ? "Available" : "Sold Out"}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {animal.description}
              </p>
            </Card>

            <div className="flex gap-4">
              {animal.available ? (
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
          <p className="text-gray-600 mb-4">Animal not found</p>
          <Link href="/listings">
            <Button variant="primary">Back to Listings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
