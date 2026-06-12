"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { localStorageDb } from "@/lib/localStorageDb";
import { Animal } from "@/types";

export default function AdminModerationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) {
        const allAnimals = localStorageDb.getAnimals({});
        setAnimals(allAnimals);
        setIsLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [session]);

  const handleApprove = (id: string) => {
    localStorageDb.updateAnimalAvailability(id, true);
    setAnimals(
      animals.map((a) => (a.id === id ? { ...a, available: true } : a)),
    );
  };

  const handleReject = (id: string) => {
    if (confirm("Are you sure you want to remove this listing?")) {
      localStorageDb.deleteAnimal(id);
      setAnimals(animals.filter((a) => a.id !== id));
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading listings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Content Moderation
          </h1>
          <p className="text-gray-600">Review and moderate animal listings</p>
        </div>

        {animals.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg">No listings to review</p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Animal
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Seller
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-700">
                      Actions
                    </th>
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
                        {animal.seller?.name || "Unknown"}
                      </td>
                      <td className="py-3 font-semibold">
                        ₦{animal.price.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={animal.available ? "success" : "warning"}
                        >
                          {animal.available ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {!animal.available && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApprove(animal.id)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(animal.id)}
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
        )}
      </div>
    </div>
  );
}
