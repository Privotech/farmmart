"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  CheckIcon,
  XIcon,
  CloseIcon,
  ClockIcon,
  SearchIcon,
  FileIcon,
  BanIcon,
} from "@/components/ui/Icons";
import { User } from "@/types";
import { updateUserRole, deleteUser, verifySeller } from "@/actions/users";
import { useTransition, useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

type FilterRole = "ALL" | "BUYER" | "SELLER" | "ADMIN";
type FilterVerification = "ALL" | "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED" | "UNVERIFIED";

export function AdminUsersClient({ users, currentUserId }: { users: User[], currentUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("ALL");
  const [verificationFilter, setVerificationFilter] = useState<FilterVerification>("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [verifyNotes, setVerifyNotes] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (user.phone?.includes(searchQuery) ?? false);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const verStatus = user.verification_status || (user.is_verified ? "APPROVED" : "UNVERIFIED");
      let matchesVerification = true;
      if (verificationFilter === "ALL") {
        matchesVerification = true;
      } else if (verificationFilter === "UNVERIFIED") {
        matchesVerification = !user.is_verified && !user.verification_status;
      } else {
        matchesVerification = verStatus === verificationFilter;
      }

      return matchesSearch && matchesRole && matchesVerification;
    });
  }, [users, searchQuery, roleFilter, verificationFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const sellers = users.filter(u => u.role === "SELLER").length;
    const verified = users.filter(u => u.is_verified).length;
    const pending = users.filter(u => u.verification_status === "PENDING").length;
    return { total, sellers, verified, pending };
  }, [users]);

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole as "BUYER" | "SELLER" | "ADMIN");
      if (!res.success) {
        toast.error(res.error || "Failed to update role");
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      startTransition(async () => {
        const res = await deleteUser(userId);
        if (!res.success) {
          toast.error(res.error || "Failed to delete user");
        }
      });
    }
  };

  const handleVerifySeller = (userId: string, status: "APPROVED" | "REJECTED" | "SUSPENDED") => {
    const actionWord = status === "APPROVED" ? "approve" : status === "REJECTED" ? "reject" : "suspend";
    if (confirm(`Are you sure you want to ${actionWord} this seller's verification?`)) {
      startTransition(async () => {
        const res = await verifySeller(userId, status, verifyNotes || undefined);
        if (res.success) {
          setSelectedUser(null);
          setVerifyNotes("");
        } else {
          toast.error(res.error || "Failed to update verification");
        }
      });
    }
  };

  const getVerificationBadge = (user: User) => {
    const status = user.verification_status;
    if (user.is_verified || status === "APPROVED") {
      return (
        <Badge variant="success" className="inline-flex items-center gap-1">
          <CheckIcon className="w-3.5 h-3.5" /> VERIFIED
        </Badge>
      );
    }
    if (status === "PENDING") {
      return (
        <Badge variant="warning" className="inline-flex items-center gap-1">
          <ClockIcon className="w-3.5 h-3.5" /> PENDING REVIEW
        </Badge>
      );
    }
    if (status === "REJECTED") {
      return (
        <Badge variant="danger" className="inline-flex items-center gap-1">
          <XIcon className="w-3.5 h-3.5" /> REJECTED
        </Badge>
      );
    }
    if (status === "SUSPENDED") {
      return (
        <Badge variant="danger" className="inline-flex items-center gap-1">
          <BanIcon className="w-3.5 h-3.5" /> SUSPENDED
        </Badge>
      );
    }
    return <Badge variant="secondary">NOT SUBMITTED</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-50 border-none">
          <div className="text-sm text-gray-500 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.total}</div>
        </Card>
        <Card className="bg-gray-50 border-none">
          <div className="text-sm text-gray-500 mb-1">Sellers</div>
          <div className="text-3xl font-bold text-blue-600">{stats.sellers}</div>
        </Card>
        <Card className="bg-gray-50 border-none">
          <div className="text-sm text-gray-500 mb-1">Verified Sellers</div>
          <div className="text-3xl font-bold text-green-600">{stats.verified}</div>
        </Card>
        <Card className="bg-gray-50 border-none">
          <div className="text-sm text-gray-500 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as FilterRole)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Roles</option>
              <option value="BUYER">Buyers</option>
              <option value="SELLER">Sellers</option>
              <option value="ADMIN">Admins</option>
            </select>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as FilterVerification)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Verification</option>
              <option value="APPROVED">Verified</option>
              <option value="PENDING">Pending Review</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="UNVERIFIED">Not Submitted</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Verification</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const joinedDate = user.createdAt ?? user.created_at;

                  return (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {user.avatar_url ? (
                              <Image
                                src={user.avatar_url}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-emerald-700 font-bold text-sm">
                                {user.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{user.name}</div>
                            <div className="text-sm text-gray-500 truncate">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value as User["role"])
                          }
                          className="px-2 py-1 border rounded-lg text-sm"
                          disabled={user.id === currentUserId || isPending}
                        >
                          <option value="BUYER">Buyer</option>
                          <option value="SELLER">Seller</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-2">
                          {getVerificationBadge(user)}
                          {(user.role === "SELLER") && (
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
                            >
                              Review →
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-sm">
                        {user.city && user.state
                          ? `${user.city}, ${user.state}`
                          : user.state
                          ? user.state
                          : user.city
                          ? user.city
                          : "—"}
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-sm">
                        {joinedDate ? new Date(joinedDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            View
                          </Button>
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
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">User Details</h2>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setVerifyNotes("");
                }}
                className="text-gray-500 hover:text-gray-700 leading-none p-1"
                aria-label="Close"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar_url ? (
                    <Image
                      src={selectedUser.avatar_url}
                      alt={selectedUser.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-emerald-700 font-bold text-3xl">
                      {selectedUser.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-500">
                    <Badge variant={selectedUser.role === "ADMIN" ? "primary" : selectedUser.role === "SELLER" ? "success" : "warning"}>
                      {selectedUser.role}
                    </Badge>
                    <span className="ml-2">{getVerificationBadge(selectedUser)}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Phone", selectedUser.phone],
                  ["State", selectedUser.state],
                  ["City", selectedUser.city],
                  ["Address", selectedUser.address],
                  ["Farm Name", selectedUser.farm_name],
                  ["CAC Number", selectedUser.cac_number],
                  ["Document Type", selectedUser.verification_document_type],
                  ["Verified At", selectedUser.verified_at ? new Date(selectedUser.verified_at).toLocaleDateString() : null],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">{label}</div>
                      <div className="font-medium">{value as string}</div>
                    </div>
                  ) : null
                )}
              </div>

              {selectedUser.farm_address && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Farm Address</div>
                  <div className="font-medium">{selectedUser.farm_address}</div>
                </div>
              )}

              {selectedUser.bio && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Seller Bio</div>
                  <div className="font-medium whitespace-pre-wrap">{selectedUser.bio}</div>
                </div>
              )}

              {selectedUser.verification_notes && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="text-xs text-amber-700 font-semibold">Admin Notes</div>
                  <div className="font-medium text-amber-900">{selectedUser.verification_notes}</div>
                </div>
              )}

              {selectedUser.verification_document_url && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Verification Document</div>
                  <a
                    href={selectedUser.verification_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition">
                      <div className="text-4xl mb-2 flex justify-center text-gray-400">
                        <FileIcon className="w-12 h-12" />
                      </div>
                      <div className="text-emerald-600 font-medium">
                        Click to View Document
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedUser.verification_document_type || "ID Document"}
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {selectedUser.role === "SELLER" && (
                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-bold text-lg">Seller Verification Actions</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={verifyNotes}
                      onChange={(e) => setVerifyNotes(e.target.value)}
                      placeholder="Add notes about this verification decision..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="success"
                      onClick={() => handleVerifySeller(selectedUser.id, "APPROVED")}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5"
                    >
                      <CheckIcon className="w-4 h-4" /> Approve Verification
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleVerifySeller(selectedUser.id, "REJECTED")}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5"
                    >
                      <XIcon className="w-4 h-4" /> Reject Application
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleVerifySeller(selectedUser.id, "SUSPENDED")}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5"
                    >
                      <BanIcon className="w-4 h-4" /> Suspend Seller
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
