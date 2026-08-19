"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimalCard } from "@/components/features/AnimalCard";
import { FilterPanel } from "@/components/features/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Animal, AnimalFilters } from "@/types";
import { useSession } from "@/lib/auth-client";
import { addToCart } from "@/actions/cart";

function ListingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Extract current filters directly from URL searchParams
  const category = searchParams.get("category") || "";
  const breed = searchParams.get("breed") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (breed) params.append("breed", breed);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (location) params.append("location", location);

        const res = await fetch(`/api/animals?${params.toString()}`);
        const result = await res.json();

        if (result.success) {
          setAnimals(result.data);
        } else {
          setError(result.error || "Failed to fetch animals");
        }
      } catch {
        setError("An error occurred while fetching animals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, [category, breed, minPrice, maxPrice, location]);

  const handleFilterChange = (newFilters: AnimalFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString());
      }
    });
    router.push(`/buyer/listing?${params.toString()}`);
  };

  const handleAddToCart = async (animal: Animal) => {
    if (!session) {
      alert("Please log in to add items to your cart.");
      return;
    }
    try {
      const result = await addToCart(animal.id, 1);
      if (result.success) {
        alert("Added to cart!");
      } else {
        alert(result.error || "Error adding to cart");
      }
    } catch {
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Browse Animals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel 
            initialFilters={{
              category,
              breed,
              minPrice: minPrice ? Number(minPrice) : undefined,
              maxPrice: maxPrice ? Number(maxPrice) : undefined,
              location,
            }}
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Animals Grid */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6 border border-red-800">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading animals...</p>
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <p className="text-gray-400 mb-4">No animals found</p>
              <Button
                variant="primary"
                onClick={() => handleFilterChange({})}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {animals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Loading listings...</div>}>
      <ListingsPageContent />
    </Suspense>
  );
}
