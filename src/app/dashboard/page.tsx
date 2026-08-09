"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      window.location.href = "/login";
      return;
    }

    switch (session.user?.role) {
      case "BUYER":
        window.location.href = "/buyer/dashboard";
        break;
      case "SELLER":
        window.location.href = "/seller/dashboard";
        break;
      case "ADMIN":
        window.location.href = "/admin/dashboard";
        break;
      default:
        window.location.href = "/buyer/listing";
    }
  }, [session, status]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Redirecting to your dashboard...
    </div>
  );
}
