
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminModerationClient } from "./AdminModerationClient";

export default async function AdminModeration() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const animals = await prisma.animals.findMany({
    include: {
      users: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedAnimals = animals.map(animal => ({
    ...animal,
    sellerName: animal.users.name,
    price: animal.price.toNumber(),
  }));

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Content Moderation</h1>
      <AdminModerationClient animals={formattedAnimals} />
    </div>
  );
}
    