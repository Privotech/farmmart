import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import SellerAnimalActions from "./SellerAnimalActions";

export default async function SellerAnimalsPage() {
  // Use custom getSession() instead of NextAuth getServerSession
  const session = await getSession();

  // Validate session and check SELLER role cleanly
  if (!session?.userId || !session?.role || session.role.toUpperCase() !== "SELLER") {
    redirect("/login");
  }

  const animals = await prisma.animals.findMany({
    where: {
      seller_id: session.userId,
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-100 mb-2">
              My Listings
            </h1>
            <p className="text-emerald-400">Manage your animal listings</p>
          </div>
          <Link href="/seller/animals/new">
            <Button variant="primary">Add New Animal</Button>
          </Link>
        </div>

        {animals.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-emerald-400 text-lg mb-6">
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
                <thead className="border-b border-emerald-800">
                  <tr>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Animal
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Type
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Price
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Status
                    </th>
                    <th className="text-left py-3 font-semibold text-emerald-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {animals.map((animal) => (
                    <tr
                      key={animal.id}
                      className="border-b border-emerald-800 hover:bg-emerald-900/30"
                    >
                      <td className="py-3">
                        <div className="font-semibold text-emerald-100">
                          {animal.name}
                        </div>
                        <div className="text-sm text-emerald-400">
                          {animal.breed}
                        </div>
                      </td>
                      <td className="py-3 text-emerald-400 capitalize">
                        {animal.category.toLowerCase().replace("_", " ")}
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">
                        ₦{Number(animal.price).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            animal.status === "AVAILABLE" ? "success" : "warning"
                          }
                        >
                          {animal.status === "AVAILABLE" ? "Available" : "Sold"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <SellerAnimalActions animalId={animal.id} />
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