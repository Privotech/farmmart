import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  const cartData = await prisma.cart.findMany({
    where: { user_id: session.userId },
    include: { animals: true },
  });

  const cartTotal = cartData.reduce(
    (sum, item) => sum + Number(item.animals.price) * item.quantity,
    0
  );

  const shippingCost = 5000;
  const tax = Math.floor(cartTotal * 0.075);
  const total = cartTotal + shippingCost + tax;

  return (
    <CheckoutClient
      cartTotal={cartTotal}
      shippingCost={shippingCost}
      tax={tax}
      total={total}
    />
  );
}
