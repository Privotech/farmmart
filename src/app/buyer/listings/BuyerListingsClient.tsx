"use client";

import { AnimalCard } from "@/components/features/AnimalCard";
import { FilterPanel } from "@/components/features/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Animal, AnimalFilters } from "@/types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { addToCart } from "@/actions/cart";

export function BuyerListingsClient({ animals }: { animals: Animal[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (filters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear old filters
    params.delete('type');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('search');
    params.delete('sortBy');
    params.delete('healthStatus');

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    
    router.push(`${pathname}?${params.toString()}`);
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filter Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-emerald-950 p-6 rounded-2xl shadow-sm border border-emerald-800">
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Animals Grid */}
      <div className="lg:col-span-3">
        {animals.length === 0 ? (
          <div className="text-center py-12 bg-emerald-950 p-8 rounded-2xl border border-emerald-800">
            <p className="text-emerald-400 mb-4">No animals found</p>
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
  );
}
