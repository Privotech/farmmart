"use client";

import { useState, useEffect } from "react";
import { AnimalCard } from "@/components/features/AnimalCard";
import { FilterPanel } from "@/components/features/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Animal, AnimalFilters } from "@/types";
import { localStorageDb } from "@/lib/localStorageDb";
import { useSession } from "@/lib/auth-client";

export default function ListingsPage() {
  const { data: session } = useSession();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filters, setFilters] = useState<AnimalFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimals = () => {
      setIsLoading(true);
      setError("");

      try {
        const data = localStorageDb.getAnimals(filters);
        setAnimals(data);
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
      localStorageDb.addToCart(session.user.email, animal.id, 1);
      alert("Added to cart!");
    } catch {
      alert("Error adding to cart");
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Animals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel onFilterChange={setFilters} />
        </div>

        {/* Animals Grid */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading animals...</p>
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No animals found</p>
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
