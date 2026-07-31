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
      if (imagesRaw.startsWith("http") || imagesRaw.startsWith("/")) return imagesRaw;
    }
  } catch {
    if (typeof imagesRaw === "string") return imagesRaw;
  }
  return "/placeholder-animal.jpg";
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const quantity = item.quantity || 1;
  const animal = item.animal;
  const unitPrice = Number(animal?.price || 0);
  const totalPrice = unitPrice * quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-emerald-950 border border-emerald-800 rounded-xl">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-emerald-900">
        <Image
          src={getImageUrl(animal?.images)}
          alt={animal?.name || "Cart item"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-100 truncate">
          {animal?.name || "Item Unavailable"}
        </h3>
        <p className="text-sm text-gray-400">
          {animal?.breed || "N/A"} • {animal?.type || "Livestock"}
        </p>
        <p className="text-emerald-500 font-semibold">
          ₦{unitPrice.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onUpdateQuantity && (
          <div className="flex items-center border border-emerald-700 rounded-lg bg-emerald-900">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))}
              className="px-2 py-1 text-emerald-300 hover:text-white"
            >
              -
            </button>
            <span className="px-2 text-sm text-white font-medium">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              className="px-2 py-1 text-emerald-300 hover:text-white"
            >
              +
            </button>
          </div>
        )}

        <div className="text-right min-w-[80px]">
          <p className="font-bold text-emerald-400">₦{totalPrice.toLocaleString()}</p>
        </div>

        {onRemove && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="p-1 text-red-400 hover:bg-red-900/30"
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  );
};