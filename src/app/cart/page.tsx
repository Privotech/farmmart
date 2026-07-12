import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CartClient } from "./CartClient";

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cartData = await prisma.cart.findMany({
    where: {
      user_id: session.user.id,
    },
    include: {
      animals: {
        include: {
          users: true,
        },
      },
    },
  });

  const cartItems = cartData.map((item) => ({
    id: item.id,
    userId: item.user_id,
    animalId: item.animal_id,
    quantity: item.quantity,
    animal: {
      id: item.animals.id,
      name: item.animals.name,
      category: item.animals.category,
      breed: item.animals.breed || "",
      type: item.animals.category.toLowerCase().replace("_", " "),
      price: Number(item.animals.price),
      images: item.animals.images,
      status: item.animals.status,
      sellerId: item.animals.seller_id,
      createdAt: item.animals.created_at,
      updatedAt: item.animals.updated_at,
    },
    createdAt: item.created_at,
    updatedAt: item.animals?.updated_at ?? new Date(),
  }));

  return <CartClient initialCartItems={cartItems} />;
}
