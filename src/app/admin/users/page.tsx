import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminUsersClient } from "./AdminUsersClient";
import { User, UsersRole } from "@/types";

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  const dbUsers = await prisma.users.findMany({
    orderBy: { created_at: "desc" },
  });

  const users: User[] = dbUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as UsersRole,
    firebaseUid: u.firebase_uid,
    isVerified: u.is_verified,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage platform users and their roles</p>
        </div>

        <AdminUsersClient users={users} currentUserId={session.userId} />
      </div>
    </div>
  );
}
