"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteAnimal(animalId: string) {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.animals.delete({
      where: { id: animalId },
    });
    
    revalidatePath("/seller/animals");
    revalidatePath("/admin/moderation");
    return { success: true };
  } catch (error) {
    console.error("Error deleting animal:", error);
    return { success: false, error: "Failed to delete animal" };
  }
}

export async function updateAnimalStatus(animalId: string, status: "AVAILABLE" | "SOLD" | "RESERVED") {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.animals.update({
      where: { id: animalId },
      data: { status },
    });
    
    revalidatePath("/seller/animals");
    revalidatePath("/admin/moderation");
    return { success: true };
  } catch (error) {
    console.error("Error updating animal status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateAnimal(animalId: string, data: Record<string, unknown>) {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.animals.update({
      where: { id: animalId },
      data,
    });
    
    revalidatePath(`/seller/animals/${animalId}/edit`);
    revalidatePath("/seller/animals");
    return { success: true };
  } catch (error) {
    console.error("Error updating animal:", error);
    return { success: false, error: "Failed to update animal" };
  }
}
