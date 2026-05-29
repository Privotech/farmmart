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

export const AnimalCard = ({ animal, onAddToCart }: AnimalCardProps) => {
  const healthStatusColors = {
    healthy: "success",
    vaccinated: "primary",
    treated: "warning",
    unknown: "danger",
  } as const;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow animate-fade-up card-hover-raise">
      <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
        <Image
          src={animal.images[0] || "/placeholder-animal.jpg"}
          alt={animal.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{animal.name}</h3>
          <p className="text-sm text-gray-500">
            {animal.breed} • {animal.age} months
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="primary">{animal.type}</Badge>
          <Badge variant={healthStatusColors[animal.health_status]}>
            {animal.health_status}
          </Badge>
        </div>

        <p className="text-sm text-gray-600">{animal.location}</p>

        <p className="text-sm text-gray-700 line-clamp-3">
          {animal.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <p className="text-2xl font-bold text-emerald-600">
              ₦{animal.price.toLocaleString()}
            </p>
            {animal.weight && (
              <p className="text-xs text-gray-500">{animal.weight} kg</p>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/listings/${animal.id}`}>
              <Button variant="secondary" size="sm" className="px-4">
                View
              </Button>
            </Link>
            {onAddToCart && animal.available && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAddToCart(animal)}
                className="px-4"
              >
                Add
              </Button>
            )}
            {!animal.available && (
              <Button variant="secondary" size="sm" disabled>
                Sold
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
