"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Redirect based on user role
    switch (session.user?.role) {
      case "buyer":
        router.push("/buyer/dashboard");
        break;
      case "seller":
        router.push("/seller/dashboard");
        break;
      case "admin":
        router.push("/admin/dashboard");
        break;
      default:
        router.push("/buyer/listings");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Redirecting to your dashboard...
    </div>
  );
}
