"use client";

import { useState, useEffect } from "react";
import { AnimalCard } from "@/components/features/AnimalCard";
import { FilterPanel } from "@/components/features/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Animal, AnimalFilters } from "@/types";

export default function ListingsPage() {
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
        if (filters.type) params.append("type", filters.type);
        if (filters.breed) params.append("breed", filters.breed);
        if (filters.minPrice)
          params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice)
          params.append("maxPrice", filters.maxPrice.toString());
        if (filters.search) params.append("search", filters.search);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);

        const response = await fetch(`/api/animals?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setAnimals(data.data);
        } else {
          setError("Failed to fetch animals");
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
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId: animal.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        alert("Added to cart!");
      } else {
        alert("Failed to add to cart");
      }
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
