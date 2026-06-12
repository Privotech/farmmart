"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(newQuantity);
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const totalPrice = item.animal.price * quantity;

  return (
    <Card className="flex gap-4 items-center bg-gray-900 border-gray-800">
      <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
        <Image
          src={item.animal.images[0] || "/placeholder-animal.jpg"}
          alt={item.animal.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-gray-100">{item.animal.name}</h3>
          <p className="text-sm text-gray-400">{item.animal.breed} • {item.animal.type}</p>
          <p className="text-emerald-500 font-semibold">₦{item.animal.price.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-4">
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20 text-center"
          />

          <div className="text-right">
            <p className="text-lg font-bold text-gray-100">₦{totalPrice.toLocaleString()}</p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove && onRemove(item.id)}
            className="ml-2"
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};
