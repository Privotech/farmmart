"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Animal } from "@/types";

interface AnimalFormProps {
  animal?: Animal;
  action: (animalId: string, data: Record<string, unknown>) => Promise<any>;
}

export function AnimalForm({ animal, action }: AnimalFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: animal?.name || "",
    category: animal?.category || "CATTLE",
    breed: animal?.breed || "",
    age: animal?.age || 0,
    weight: animal?.weight || 0,
    price: animal?.price || 0,
    description: animal?.description || "",
    location: animal?.location || "",
    state: animal?.state || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await action(animal!.id, formData);

      if (res.success) {
        router.push("/seller/animals");
      } else {
        setError(res.error || "Failed to save animal.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      {error && (
        <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6 border border-red-800">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input name="name" label="Animal Name" value={formData.name} onChange={handleInputChange} disabled={isLoading} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="category" label="Category" value={formData.category} onChange={handleInputChange} disabled={isLoading} />
            <Input name="breed" label="Breed" value={formData.breed} onChange={handleInputChange} disabled={isLoading} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input name="age" label="Age (months)" type="number" value={formData.age} onChange={handleInputChange} disabled={isLoading} />
            <Input name="weight" label="Weight (kg)" type="number" value={formData.weight} onChange={handleInputChange} disabled={isLoading} />
            <Input name="price" label="Price" type="number" value={formData.price} onChange={handleInputChange} disabled={isLoading} />
        </div>
        <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea name="description" rows={4} className="block w-full rounded-md bg-gray-800 border-gray-700 focus:ring-emerald-500 focus:border-emerald-500 text-white" value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="location" label="Location" value={formData.location} onChange={handleInputChange} disabled={isLoading} />
            <Input name="state" label="State" value={formData.state} onChange={handleInputChange} disabled={isLoading} />
        </div>

        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isLoading}>
                Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </div>
      </form>
    </Card>
  );
}
