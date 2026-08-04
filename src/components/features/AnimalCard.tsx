"use client";

import Link from "next/link";
import Image from "next/image";
import { Animal } from "@/types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface AnimalCardProps {
  animal: Animal;
  onAddToCart?: (animal: Animal) => void;
}

// Safely unwraps nested/double-serialized JSON strings
function getImageUrl(imagesRaw: unknown): string {
  if (!imagesRaw) return "/placeholder-animal.jpg";

  let parsed: unknown = imagesRaw;

  // Un-stringify recursively in case of double/triple stringified JSON
  while (typeof parsed === "string") {
    const trimmed = parsed.trim();
    
    // Check if it's a URL directly
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }

    // Attempt parsing if it looks like JSON array or stringified JSON
    if (trimmed.startsWith("[") || trimmed.startsWith('"')) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        break;
      }
    } else {
      break;
    }
  }

  // Handle parsed Array
  if (Array.isArray(parsed) && parsed.length > 0) {
    const firstItem = parsed[0];
    if (typeof firstItem === "string" && firstItem.trim().length > 0) {
      return firstItem.trim();
    }
  }

  return "/placeholder-animal.jpg";
}

export const AnimalCard = ({ animal, onAddToCart }: AnimalCardProps) => {
  const healthStatusColors = {
    healthy: "success",
    vaccinated: "primary",
    treated: "warning",
    unknown: "danger",
  } as const;

  const imageSrc = getImageUrl(animal.images);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow animate-fade-up card-hover-raise">
      <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={animal.name || "Livestock listing"}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-emerald-100">{animal.name}</h3>
          <p className="text-sm text-emerald-400">
            {animal.breed} • {animal.age} months
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="primary">{animal.category}</Badge>
          <Badge
            variant={
              healthStatusColors[animal.health_status as keyof typeof healthStatusColors] ?? "danger"
            }
          >
            {animal.health_status}
          </Badge>
        </div>

        <p className="text-sm text-emerald-400">{animal.location}</p>

        <p className="text-sm text-emerald-300 line-clamp-3">
          {animal.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-emerald-800">
          <div>
            <p className="text-2xl font-bold text-emerald-400">
              ₦{Number(animal.price || 0).toLocaleString()}
            </p>
            {animal.weight && (
              <p className="text-xs text-emerald-400">{Number(animal.weight)} kg</p>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/listings/${animal.id}`}>
              <Button variant="secondary" size="sm" className="px-4">
                View
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {onAddToCart && animal.status === "AVAILABLE" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAddToCart(animal)}
                  className="px-4"
                >
                  Add
                </Button>
              )}
              {animal.status !== "AVAILABLE" && (
                <Badge
                  variant="outline"
                  className="text-gray-500 border-gray-700"
                >
                  Sold
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
