"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateAnimalStatus, deleteAnimal } from "@/actions/animals";
import { useTransition } from "react";
import type { Animal } from "@/types";

type ModerationAnimal = Animal & { sellerName?: string };

export function AdminModerationClient({ animals }: { animals: ModerationAnimal[] }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const res = await updateAnimalStatus(id, "AVAILABLE");
      if (!res.success) {
        alert(res.error || "Failed to approve listing");
      }
    });
  };

  const handleReject = (id: string) => {
    if (confirm("Are you sure you want to remove this listing?")) {
      startTransition(async () => {
        const res = await deleteAnimal(id);
        if (!res.success) {
          alert(res.error || "Failed to remove listing");
        }
      });
    }
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 font-semibold text-gray-700">Animal</th>
              <th className="text-left py-3 font-semibold text-gray-700">Seller</th>
              <th className="text-left py-3 font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal.id} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  <div className="font-semibold">{animal.name}</div>
                  <div className="text-sm text-gray-600">
                    {animal.breed} • {animal.type}
                  </div>
                </td>
                <td className="py-3 text-gray-600">
                  {animal.sellerName || "Unknown"}
                </td>
                <td className="py-3 font-semibold">
                  ₦{animal.price.toLocaleString()}
                </td>
                <td className="py-3">
                  <Badge variant={animal.status === "AVAILABLE" ? "success" : "warning"}>
                    {animal.status === "AVAILABLE" ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    {animal.status !== "AVAILABLE" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(animal.id)}
                        disabled={isPending}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(animal.id)}
                      disabled={isPending}
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
