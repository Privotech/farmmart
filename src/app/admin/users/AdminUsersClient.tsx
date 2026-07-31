"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, UserRole } from "@/types";
import { updateUserRole, deleteUser } from "@/actions/users";
import { useTransition } from "react";

export function AdminUsersClient({ users, currentUserId }: { users: User[], currentUserId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    startTransition(async () => {
      // Cast newRole to the union expected by your server action
      const res = await updateUserRole(userId, newRole as "BUYER" | "SELLER" | "ADMIN");
      if (!res.success) {
        alert(res.error || "Failed to update role");
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      startTransition(async () => {
        const res = await deleteUser(userId);
        if (!res.success) {
          alert(res.error || "Failed to delete user");
        }
      });
    }
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 font-semibold text-gray-700">User</th>
              <th className="text-left py-3 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 font-semibold text-gray-700">Joined</th>
              <th className="text-left py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-semibold">{user.name}</td>
                <td className="py-3 text-gray-600">{user.email}</td>
                <td className="py-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as User["role"])
                    }
                    className="px-3 py-1 border rounded-lg text-sm"
                    disabled={user.id === currentUserId || isPending}
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="py-3 text-gray-600">
                  {new Date(user.createdAt || user.created_at || Date.now()).toLocaleDateString()}
                </td>
                <td className="py-3">
                  {user.id !== currentUserId && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isPending}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}