import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { AdminModerationClient } from "./AdminModerationClient";

export default async function AdminModerationPage() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const dbAnimals = await prisma.animals.findMany({
    orderBy: { created_at: "desc" },
    include: { users: true },
  });

  const animals = dbAnimals.map((a) => ({
    id: a.id,
    name: a.name,
    breed: a.breed || "Unknown",
    type: a.category.toLowerCase().replace("_", " "),
    price: Number(a.price),
    status: a.status,
    sellerName: a.users?.name,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">Review and moderate animal listings</p>
        </div>

        {animals.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg">No listings to review</p>
          </Card>
        ) : (
          <AdminModerationClient animals={animals} />
        )}
      </div>
    </div>
  );
}
