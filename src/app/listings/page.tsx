"use client";

import { useState, useEffect } from "react";
import { AnimalCard } from "@/components/features/AnimalCard";
import { FilterPanel } from "@/components/features/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Animal, AnimalFilters } from "@/types";

import { useSession } from "@/lib/auth-client";

export default function ListingsPage() {
  const { data: session } = useSession();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filters, setFilters] = useState<AnimalFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });
        
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
  }, [filters]);

  const handleAddToCart = async (animal: Animal) => {
    if (!session || !session.user) {
      alert("Please log in to add items to cart");
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, animalId: animal.id, quantity: 1 }),
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


  return (
    <div className="container mx-auto px-4 py-8 bg-[#121212] min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Browse Animals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel onFilterChange={setFilters} />
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
                onClick={() => setFilters({})}
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
