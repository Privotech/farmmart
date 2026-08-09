"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: "BUYER" | "SELLER" | "ADMIN") {
  const user = await getCurrentUser();
  
  if (!user?.id || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.users.update({
      where: { id: userId },
      data: { role },
    });
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

export async function deleteUser(userId: string) {
  const user = await getCurrentUser();
  
  if (!user?.id || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.users.delete({
      where: { id: userId },
    });
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function verifySeller(
  userId: string,
  status: "APPROVED" | "REJECTED" | "SUSPENDED",
  notes?: string
) {
  const adminUser = await getCurrentUser();
  
  if (!adminUser?.id || adminUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.users.update({
      where: { id: userId },
      data: {
        verification_status: status,
        is_verified: status === "APPROVED",
        verification_notes: notes,
        verified_at: status === "APPROVED" ? new Date() : null,
        verified_by_id: adminUser.id,
      },
    });
    
    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error verifying seller:", error);
    return { success: false, error: "Failed to update seller verification status" };
  }
}

export async function submitSellerVerification(data: {
  documentType: string;
  documentUrl: string;
  farmName?: string;
  farmAddress?: string;
  cacNumber?: string;
  bio?: string;
  phone?: string;
  state?: string;
  city?: string;
  address?: string;
}) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.users.update({
      where: { id: currentUser.id },
      data: {
        verification_document_type: data.documentType,
        verification_document_url: data.documentUrl,
        verification_status: "PENDING",
        is_verified: false,
        farm_name: data.farmName,
        farm_address: data.farmAddress,
        cac_number: data.cacNumber,
        bio: data.bio,
        phone: data.phone,
        state: data.state,
        city: data.city,
        address: data.address,
      },
    });
    
    revalidatePath("/seller/settings");
    revalidatePath("/seller/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error submitting seller verification:", error);
    return { success: false, error: "Failed to submit verification documents" };
  }
}

export async function updateUserAccount(userId: string, data: Record<string, unknown>) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser?.id) {
    throw new Error("Unauthorized");
  }

  if (currentUser.role !== "ADMIN" && currentUser.id !== userId) {
    throw new Error("Unauthorized to modify this account");
  }

  try {
    await prisma.users.update({
      where: { id: userId },
      data,
    });
    
    revalidatePath("/admin/users");
    revalidatePath("/seller/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating user account:", error);
    return { success: false, error: "Failed to update account" };
  }
}
