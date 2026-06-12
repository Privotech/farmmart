"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { localStorageDb } from "@/lib/localStorageDb";
import Link from "next/link";
import { Animal } from "@/types";

export default function SellerAnimalsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) {
        const sellerAnimals = localStorageDb.getAnimals({
          sellerId: session.user?.id,
        });
        setAnimals(sellerAnimals);
        setIsLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [session]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      localStorageDb.deleteAnimal(id);
      setAnimals(animals.filter((a) => a.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading listings...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Listings
            </h1>
            <p className="text-gray-600">Manage your animal listings</p>
          </div>
          <Link href="/seller/animals/new">
            <Button variant="primary">Add New Animal</Button>
          </Link>
        </div>

        {animals.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              You haven&apos;t listed any animals yet
            </p>
            <Link href="/seller/animals/new">
              <Button variant="primary">Create Your First Listing</Button>
            </Link>
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
                      Type
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
                          {animal.breed}
                        </div>
                      </td>
                      <td className="py-3 text-gray-600 capitalize">
                        {animal.type}
                      </td>
                      <td className="py-3 font-semibold">
                        ₦{animal.price.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={animal.available ? "success" : "warning"}
                        >
                          {animal.available ? "Available" : "Sold"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              router.push(`/seller/animals/${animal.id}/edit`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(animal.id)}
                          >
                            Delete
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
