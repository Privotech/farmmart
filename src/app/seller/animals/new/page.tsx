"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ImageUpload from "@/components/ImageUpload";
import { localStorageDb } from "@/lib/localStorageDb";
import { Animal } from "@/types";

export default function NewAnimalPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "cattle",
    breed: "",
    age: "",
    weight: "",
    price: "",
    description: "",
    location: "",
    health_status: "healthy",
  });
  const [imageUrl, setImageUrl] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!session || !session.user) {
        setError("No active session found");
        return;
      }

      const animal = localStorageDb.createAnimal({
        name: formData.name,
        type: formData.type as Animal["type"],
        breed: formData.breed,
        age: parseInt(formData.age),
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location,
        health_status: formData.health_status as Animal["health_status"],
        sellerId: session.user.id,
        seller: {
          ...session.user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        images: imageUrl ? [imageUrl] : [],
      });

      if (animal) {
        router.push("/seller/animals");
      } else {
        setError("Failed to create listing");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-100 mb-2">
            List New Animal
          </h1>
          <p className="text-emerald-400">Add a new animal to your inventory</p>
        </div>

        <Card>
          {error && (
            <div className="bg-emerald-900/30 text-emerald-400 p-4 rounded-lg mb-6 border border-emerald-800">
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
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-emerald-950 border border-emerald-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-100"
                  disabled={isLoading}
                >
                  <option value="cattle">Cattle</option>
                  <option value="goat">Goat</option>
                  <option value="sheep">Sheep</option>
                  <option value="pig">Pig</option>
                  <option value="poultry">Poultry</option>
                  <option value="other">Other</option>
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
                disabled={isLoading}
              />

              <Input
                type="number"
                name="age"
                label="Age (months)"
                placeholder="e.g., 24"
                value={formData.age}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <Input
                type="number"
                name="weight"
                label="Weight (kg) - Optional"
                placeholder="e.g., 350"
                value={formData.weight}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Input
                type="number"
                name="price"
                label="Price (₦)"
                placeholder="e.g., 120000"
                value={formData.price}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <Input
                type="text"
                name="location"
                label="Location"
                placeholder="e.g., Lagos"
                value={formData.location}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Health Status
                </label>
                <select
                  name="health_status"
                  value={formData.health_status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-emerald-950 border border-emerald-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-100"
                  disabled={isLoading}
                >
                  <option value="healthy">Healthy</option>
                  <option value="vaccinated">Vaccinated</option>
                  <option value="treated">Treated</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
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
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Create Listing
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/seller/animals")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
