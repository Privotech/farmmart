import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SellerEditAnimalForm from "./SellerEditAnimalForm";

export default async function EditAnimalPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "SELLER") {
    redirect("/login");
  }

  // Next.js 14+: params are asynchronous
  // Wait for it if we are using Next 15 but this is likely Next 14, params.id is available sync but await params might be required in future.
  const { id } = await params;

  const animal = await prisma.animals.findUnique({
    where: { id },
  });

  if (!animal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-400">
        Animal listing not found
      </div>
    );
  }

  if (animal.seller_id !== session.user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-400">
        You do not have permission to edit this listing
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-100 mb-2">
            Edit Animal Listing
          </h1>
          <p className="text-emerald-400">
            Update your animal listing information
          </p>
        </div>

        <SellerEditAnimalForm
          animal={{
            ...animal,
            breed: animal.breed ?? "",
            age: animal.age?.toString() ?? "",
            weight: animal.weight?.toString() ?? "",
            price: animal.price.toString(),
            description: animal.description ?? "",
            location: animal.location ?? "",
            category: animal.category as string,
          }}
        />
      </div>
    </div>
  );
}
