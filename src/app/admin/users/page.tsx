import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminUsersClient } from "./AdminUsersClient";
import { User } from "@/types";

export default async function AdminUsers() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const allUsers = await prisma.users.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Manage Users</h1>
      <AdminUsersClient
        users={allUsers as unknown as User[]}
        currentUserId={session.userId}
      />{" "}
    </div>
  );
}
