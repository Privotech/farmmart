
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminOrdersClient } from "./AdminOrdersClient";
import { Order } from "@/types";

export default async function AdminOrders() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const allOrders = await prisma.orders.findMany({
    orderBy: { created_at: "desc" },
    include: { users: true },
  });

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Manage Orders</h1>
      <AdminOrdersClient orders={allOrders as unknown as Order[]} />
    </div>
  );
}
    