"use client";

import { Button } from "@/components/ui/Button";
import { deleteAnimal } from "@/actions/animals";
import { useRouter } from "next/navigation";

export default function SellerAnimalActions({ animalId }: { animalId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      const res = await deleteAnimal(animalId);
      if (res.success) {
        // UI will be updated via revalidatePath, but we can also do a soft refresh just in case
        router.refresh();
      } else {
        alert(res.error || "Failed to delete animal");
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push(`/seller/animals/${animalId}/edit`)}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
}
