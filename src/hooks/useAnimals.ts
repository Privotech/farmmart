import { useState, useEffect, useCallback } from "react";
import { Animal, AnimalFilters } from "@/types";

export function useAnimals(initialFilters: AnimalFilters = {}) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<AnimalFilters>(initialFilters);

  const fetchAnimals = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);  
      if (filters.breed) params.append("breed", filters.breed);
      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const res = await fetch(`/api/animals?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAnimals(data.data);
      } else {
        setError(data.error || "Failed to fetch animals");
      }
    } catch {
      setError("An error occurred while fetching animals");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchAnimals(), 0);
    return () => clearTimeout(timeout);
  }, [fetchAnimals]);

  return { animals, isLoading, error, filters, setFilters, refetch: fetchAnimals };
}
