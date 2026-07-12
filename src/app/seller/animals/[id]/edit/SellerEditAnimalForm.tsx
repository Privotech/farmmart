"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ImageUpload from "@/components/ImageUpload";
import { updateAnimal } from "@/actions/animals";
import { z } from "zod";

const animalSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.string(),
  weight: z.string(),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  images: z.string().optional(),
});

type Animal = z.infer<typeof animalSchema>;

export default function SellerEditAnimalForm({ animal }: { animal: Animal }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: animal.name || "",
    category: animal.category || "CATTLE",
    breed: animal.breed || "",
    age: animal.age ? animal.age.toString() : "",
    weight: animal.weight ? animal.weight.toString() : "",
    price: animal.price ? animal.price.toString() : "",
    description: animal.description || "",
    location: animal.location || "",
  });
  const [imageUrl, setImageUrl] = useState(
    animal.images && animal.images !== "[]" ? JSON.parse(animal.images)[0] : ""
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const res = await updateAnimal(animal.id, {
        name: formData.name,
        category: formData.category,
        breed: formData.breed,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location,
        images: imageUrl ? JSON.stringify([imageUrl]) : "[]",
      });

      if (res.success) {
        router.push("/seller/animals");
      } else {
        setError(res.error || "Failed to update listing");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      {error && (
        <div className="bg-rose-900/30 text-rose-400 p-4 rounded-lg mb-6 border border-rose-800">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUpload onImageUpload={setImageUrl} currentImage={imageUrl} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="text"
            name="name"
            label="Animal Name"
            placeholder="e.g., Brown Cow"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />

          <div>
            <label className="block text-sm font-medium text-emerald-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-emerald-950 border border-emerald-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-100"
              disabled={isSaving}
            >
              <option value="CATTLE">Cattle</option>
              <option value="GOAT">Goat</option>
              <option value="SHEEP">Sheep</option>
              <option value="PIG">Pig</option>
              <option value="POULTRY">Poultry</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <Input
            type="text"
            name="breed"
            label="Breed"
            placeholder="e.g., White Fulani"
            value={formData.breed}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />

          <Input
            type="number"
            name="age"
            label="Age (months)"
            placeholder="e.g., 24"
            value={formData.age}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />

          <Input
            type="number"
            name="weight"
            label="Weight (kg) - Optional"
            placeholder="e.g., 350"
            value={formData.weight}
            onChange={handleInputChange}
            disabled={isSaving}
          />

          <Input
            type="number"
            name="price"
            label="Price (₦)"
            placeholder="e.g., 120000"
            value={formData.price}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />

          <Input
            type="text"
            name="location"
            label="Location"
            placeholder="e.g., Lagos"
            value={formData.location}
            onChange={handleInputChange}
            required
            disabled={isSaving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 bg-emerald-950 border border-emerald-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-100"
            placeholder="Describe the animal's condition, temperament, etc."
            required
            disabled={isSaving}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" isLoading={isSaving}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/seller/animals")}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
