"use client";

import Link from "next/link";
import { AnimalCard } from "@/components/features/AnimalCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Animal } from "@/types";
import { addToCart } from "@/actions/cart";

interface SavedAnimal extends Animal {
  _favId: string;
}

export function SavedClient({
  initialAnimals,
}: {
  initialAnimals: SavedAnimal[];
}) {
  const handleAddToCart = async (animal: Animal) => {
    try {
      const res = await addToCart(animal.id, 1);
      if (res.success) {
        alert("Added to cart!");
      } else {
        alert(res.error || "Error adding to cart");
      }
    } catch {
      alert("Error adding to cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#0b1a12] min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-emerald-100">
          Saved Listings
        </h1>
        <p className="text-emerald-400">
          Livestock you&apos;ve saved for later
        </p>
      </div>

      {initialAnimals.length === 0 ? (
        <Card className="text-center py-16 border-emerald-800 bg-emerald-950/50">
          <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-emerald-900/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-emerald-100 mb-2">
            Nothing saved yet
          </h3>
          <p className="text-emerald-400 mb-6 max-w-md mx-auto">
            Browse the marketplace and tap the heart icon on any animal to save
            it here.
          </p>
          <Link href="/buyer/listing">
            <Button variant="primary">Browse Listings</Button>
          </Link>
        </Card>
      ) : (
        <>
          <p className="text-sm text-emerald-400 mb-6">
            Showing {initialAnimals.length} saved{" "}
            {initialAnimals.length === 1 ? "listing" : "listings"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
