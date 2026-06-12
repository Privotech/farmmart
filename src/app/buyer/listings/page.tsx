"use client";

import { useState, useEffect } from "react";
import { AnimalCard } from "@/components/features/AnimalCard";
import { FilterPanel } from "@/components/features/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Animal, AnimalFilters } from "@/types";
import { localStorageDb } from "@/lib/localStorageDb";
import { useSession } from "@/lib/auth-client";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter } from "next/navigation";

export default function BuyerListingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filters, setFilters] = useState<AnimalFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "buyer") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

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

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-1">Browse Marketplace</h1>
              <p className="text-sm text-gray-400 font-medium">Find and procure quality livestock</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800">
                <FilterPanel onFilterChange={setFilters} />
              </div>
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
                <div className="text-center py-12 bg-gray-900 p-8 rounded-2xl border border-gray-800">
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
      </main>
    </div>
  );
}
