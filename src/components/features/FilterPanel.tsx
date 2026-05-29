"use client";

import { useState } from "react";
import { AnimalFilters } from "@/types";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface FilterPanelProps {
  onFilterChange?: (filters: AnimalFilters) => void;
}

export const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<AnimalFilters>({});

  const animalTypes = ["cattle", "goat", "sheep", "pig", "poultry", "other"];
  const healthStatuses = ["healthy", "vaccinated", "treated", "unknown"];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  const handleFilterChange = (key: keyof AnimalFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleReset = () => {
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <Card className="space-y-6">
      <h3 className="text-lg font-bold">Filters</h3>

      {/* Search */}
      <div>
        <Input
          type="text"
          placeholder="Search animals..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="shadow-sm"
        />
      </div>

      {/* Animal Type */}
      <div>
        <h4 className="font-semibold mb-3">Animal Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {animalTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.type === type}
                onChange={(e) =>
                  handleFilterChange("type", e.target.checked ? type : undefined)
                }
                className="w-4 h-4 text-emerald-600"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Health Status */}
      <div>
        <h4 className="font-semibold mb-3">Health Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {healthStatuses.map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.healthStatus === status}
                onChange={(e) =>
                  handleFilterChange(
                    "healthStatus",
                    e.target.checked ? status : undefined,
                  )
                }
                className="w-4 h-4 text-emerald-600"
              />
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              handleFilterChange(
                "minPrice",
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              handleFilterChange(
                "maxPrice",
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-semibold mb-3">Sort By</h4>
        <select
          value={filters.sortBy || ""}
          onChange={(e) =>
            handleFilterChange("sortBy", e.target.value || undefined)
          }
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">Default</option>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <Button variant="secondary" onClick={handleReset} className="w-full">
        Clear Filters
      </Button>
    </Card>
  );
};
