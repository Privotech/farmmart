"use client";

import Link from "next/link";
import Image from "next/image";
import { Animal, User } from "@/types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { CheckIcon } from "../ui/Icons";

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

interface AnimalCardProps {
  animal: Animal & { users?: User };
  onAddToCart?: (animal: Animal) => void;
}

function getImageUrl(imagesRaw: unknown): string {
  if (!imagesRaw) return "/placeholder-animal.jpg";

  let parsed: unknown = imagesRaw;

  while (typeof parsed === "string") {
    const trimmed = parsed.trim();

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/")
    ) {
      return trimmed;
    }

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

  if (Array.isArray(parsed) && parsed.length > 0) {
    const firstItem = parsed[0];
    if (typeof firstItem === "string" && firstItem.trim().length > 0) {
      return firstItem.trim();
    }
  }

  return "/placeholder-animal.jpg";
}

export const AnimalCard = ({ animal, onAddToCart }: AnimalCardProps) => {
  const healthStatusColors: Record<
    string,
    "success" | "primary" | "warning" | "danger"
  > = {
    healthy: "success",
    vaccinated: "primary",
    treated: "warning",
    unknown: "danger",
  };

  const imageSrc = getImageUrl(animal.images);
  const seller = animal.users;
  const isSellerVerified =
    seller?.is_verified || seller?.verification_status === "APPROVED";

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow animate-fade-up card-hover-raise">
      <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={animal.name || "Livestock listing"}
          fill
          className="object-cover"
        />
        {isSellerVerified && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="success"
              className="shadow-lg inline-flex items-center gap-1"
            >
              <CheckIcon className="w-3.5 h-3.5" /> Verified Seller
            </Badge>
          </div>
        )}
        {animal.view_count && animal.view_count > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <Badge
              variant="secondary"
              className="shadow-lg inline-flex items-center gap-1"
            >
              <EyeIcon className="w-3.5 h-3.5" /> {animal.view_count}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-emerald-100">
              {animal.name}
            </h3>
            <p className="text-sm text-emerald-400">
              {animal.breed} • {animal.age} months
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="primary">{animal.category}</Badge>
          <Badge
            variant={
              healthStatusColors[
                animal.health_status as keyof typeof healthStatusColors
              ] ?? "danger"
            }
          >
            {animal.health_status || "Unknown"}
          </Badge>
          {animal.is_negotiable && <Badge variant="warning">Negotiable</Badge>}
        </div>

        <p className="text-sm text-emerald-400 inline-flex items-center gap-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {animal.location}
          {animal.state ? `, ${animal.state}` : ""}
        </p>

        {seller && (
          <div className="flex items-center gap-2 text-xs text-emerald-400/80 pt-1 border-t border-emerald-900/50">
            <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center overflow-hidden flex-shrink-0">
              {seller.avatar_url ? (
                <Image
                  src={seller.avatar_url}
                  alt={seller.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold text-emerald-300">
                  {seller.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="truncate">{seller.farm_name || seller.name}</span>
            {isSellerVerified && (
              <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
          </div>
        )}

        <p className="text-sm text-emerald-300 line-clamp-2">
          {animal.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-emerald-800">
          <div>
            <p className="text-2xl font-bold text-emerald-400">
              ₦{Number(animal.price || 0).toLocaleString()}
            </p>
            {animal.weight && (
              <p className="text-xs text-emerald-400">
                {Number(animal.weight)} kg
              </p>
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
