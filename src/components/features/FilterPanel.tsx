"use client";

import { useState } from "react";
import { AnimalFilters } from "@/types";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface FilterPanelProps {
  initialFilters?: AnimalFilters;
  onFilterChange?: (filters: AnimalFilters) => void;
}

export const FilterPanel = ({ initialFilters = {}, onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<AnimalFilters>(initialFilters);

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
      <h3 className="text-lg font-bold text-foreground">Filters</h3>

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
        <h4 className="font-semibold mb-3 text-foreground">Animal Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {animalTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-foreground">
              <input
                type="checkbox"
                checked={filters.type === type}
                onChange={(e) =>
                  handleFilterChange("type", e.target.checked ? type : undefined)
                }
                className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Health Status */}
      <div>
        <h4 className="font-semibold mb-3 text-foreground">Health Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {healthStatuses.map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-foreground">
              <input
                type="checkbox"
                checked={filters.healthStatus === status}
                onChange={(e) =>
                  handleFilterChange(
                    "healthStatus",
                    e.target.checked ? status : undefined,
                  )
                }
                className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20"
              />
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3 text-foreground">Price Range</h4>
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
        <h4 className="font-semibold mb-3 text-foreground">Sort By</h4>
        <select
          value={filters.sortBy || ""}
          onChange={(e) =>
            handleFilterChange("sortBy", e.target.value || undefined)
          }
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm transition-all shadow-sm"
        >
          <option value="" className="bg-surface">Default</option>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface">
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