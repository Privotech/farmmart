"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/types";
import { Button } from "../ui/Button";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

// Helper to parse image URL safely
function getImageUrl(imagesRaw: unknown): string {
  if (!imagesRaw) return "/placeholder-animal.jpg";
  try {
    if (typeof imagesRaw === "string") {
      const parsed = JSON.parse(imagesRaw);
      if (Array.isArray(parsed) && parsed[0]) return parsed[0];
      if (imagesRaw.startsWith("http") || imagesRaw.startsWith("/"))
        return imagesRaw;
    }
  } catch {
    if (typeof imagesRaw === "string") return imagesRaw;
  }
  return "/placeholder-animal.jpg";
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const quantity = item.quantity || 1;
  const animal = item.animal;
  const unitPrice = Number(animal?.price || 0);
  const totalPrice = unitPrice * quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-primary-50">
        <Image
          src={getImageUrl(animal?.images)}
          alt={animal?.name || "Cart item"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground truncate">
          {animal?.name || "Item Unavailable"}
        </h3>
        <p className="text-sm text-text-secondary">
          {animal?.breed || "N/A"} • {animal?.type || "Livestock"}
        </p>
        <p className="text-primary font-semibold">
          ₦{unitPrice.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onUpdateQuantity && (
          <div className="flex items-center border border-border rounded-lg bg-surface">
            <button
              onClick={() =>
                onUpdateQuantity(item.id, Math.max(1, quantity - 1))
              }
              className="px-2 py-1 text-text-secondary hover:text-foreground"
            >
              -
            </button>
            <span className="px-2 text-sm text-foreground font-medium">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              className="px-2 py-1 text-text-secondary hover:text-foreground"
            >
              +
            </button>
          </div>
        )}

        <div className="text-right min-w-[80px]">
          <p className="font-bold text-primary">
            ₦{totalPrice.toLocaleString()}
          </p>
        </div>

        {onRemove && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="p-1"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};
