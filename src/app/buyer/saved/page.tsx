import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SavedClient } from "./SavedClient";

export const metadata = {
  title: "Saved Listings | Farmmart",
  description: "Your saved livestock listings",
};

export default async function SavedPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  const favData = await prisma.favourites.findMany({
    where: { user_id: session.userId },
    orderBy: { created_at: "desc" },
    include: {
      animals: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              farm_name: true,
              avatar_url: true,
              is_verified: true,
              verification_status: true,
            },
          },
        },
      },
    },
  });

  const savedAnimals = favData.map((fav) => {
    const animal = fav.animals;
    return {
      id: animal.id,
      name: animal.name,
      category: animal.category,
      breed: animal.breed || "",
      type: (animal.category as string).toLowerCase().replace(/_/g, " "),
      price: Number(animal.price),
      weight: animal.weight ? Number(animal.weight) : null,
      age: animal.age ?? null,
      description: animal.description ?? "",
      images: animal.images,
      status: animal.status,
      location: animal.location ?? "",
      state: animal.state ?? "",
      is_negotiable: animal.is_negotiable,
      view_count: animal.view_count,
      seller_id: animal.seller_id,
      created_at: animal.created_at,
      updated_at: animal.updated_at,
      users: animal.users
        ? {
            id: animal.users.id,
            name: animal.users.name,
            email: animal.users.email,
            role: animal.users.role,
            farm_name: animal.users.farm_name,
            avatar_url: animal.users.avatar_url,
            is_verified: animal.users.is_verified,
            verification_status: animal.users.verification_status,
          }
        : undefined,
      _favId: fav.id,
    };
  });

  return <SavedClient initialAnimals={savedAnimals} />;
}
