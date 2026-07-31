import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AnimalForm } from "@/components/features/AnimalForm";
import { updateAnimal } from "@/actions/animals";

// 1. Mark params as a Promise for Next.js 15 compatibility
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAnimalPage({ params }: PageProps) {
  // 2. Await params to extract the actual 'id' string
  const { id } = await params;
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  // 3. Use findFirst to safely query both 'id' and 'seller_id' together
  const animal = await prisma.animals.findFirst({
    where: { 
      id: id, 
      seller_id: session.userId 
    },
  });

  if (!animal) {
    return (
      <div className="p-8 bg-black min-h-screen text-white">
        Animal not found or you do not have permission to edit it.
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-100 mb-8">Edit Animal Listing</h1>
        <AnimalForm animal={animal} action={updateAnimal} />
      </div>
    </div>
  );
}