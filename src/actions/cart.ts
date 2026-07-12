"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addToCart(animalId: string, quantity: number = 1) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to add to cart");
  }

  const userId = session.user.id;

  try {
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        user_id_animal_id: {
          user_id: userId,
          animal_id: animalId,
        },
      },
    });

    if (existingCartItem) {
      await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cart.create({
        data: {
          user_id: userId,
          animal_id: animalId,
          quantity,
        },
      });
    }

    revalidatePath("/cart");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function removeFromCart(cartItemId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.cart.delete({
      where: {
        id: cartItemId,
        user_id: session.user.id, // ensure user owns the item
      },
    });
    
    revalidatePath("/cart");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove item" };
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.cart.update({
      where: {
        id: cartItemId,
        user_id: session.user.id, // ensure user owns the item
      },
      data: { quantity },
    });
    
    revalidatePath("/cart");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return { success: false, error: "Failed to update quantity" };
  }
}

export async function clearCart() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.cart.deleteMany({
      where: {
        user_id: session.user.id,
      },
    });
    
    revalidatePath("/cart");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
