"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ImageUpload from "@/components/ImageUpload";
import { localStorageDb } from "@/lib/localStorageDb";
import { Animal } from "@/types";

export default function EditAnimalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    if (session && id) {
      const animal = localStorageDb.getAnimalById(id);
      if (!animal) {
        setError("Animal listing not found");
        setIsLoading(false);
        return;
      }
      if (animal.sellerId !== session.user.id) {
        setError("You do not have permission to edit this listing");
        setIsLoading(false);
        return;
      }

      setFormData({
        name: animal.name,
        type: animal.type,
        breed: animal.breed,
        age: animal.age.toString(),
        weight: animal.weight ? animal.weight.toString() : "",
        price: animal.price.toString(),
        description: animal.description,
        location: animal.location,
        health_status: animal.health_status,
      });
      setImageUrl(animal.images?.[0] || "");
      setIsLoading(false);
    }
  }, [session, id]);

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
    setIsSaving(true);

    try {
      if (!session || !session.user) {
        setError("No active session found");
        return;
      }

      const updated = localStorageDb.updateAnimal(id, {
        name: formData.name,
        type: formData.type as Animal["type"],
        breed: formData.breed,
        age: parseInt(formData.age),
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location,
        health_status: formData.health_status as Animal["health_status"],
        images: imageUrl ? [imageUrl] : [],
      });

      if (updated) {
        router.push("/seller/animals");
      } else {
        setError("Failed to update listing");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading listing details...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Edit Animal Listing
          </h1>
          <p className="text-gray-600">Update your animal listing information</p>
        </div>

        <Card>
          {error ? (
            <div className="text-center py-8">
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                {error}
              </div>
              <Button variant="secondary" onClick={() => router.push("/seller/animals")}>
                Back to Inventory
              </Button>
            </div>
          ) : (
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSaving}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Status
                  </label>
                  <select
                    name="health_status"
                    value={formData.health_status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSaving}
                  >
                    <option value="healthy">Healthy</option>
                    <option value="vaccinated">Vaccinated</option>
                    <option value="treated">Treated</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
          )}
        </Card>
      </div>
    </div>
  );
}
