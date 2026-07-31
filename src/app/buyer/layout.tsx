"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "BUYER") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-emerald-400">
        Loading...
      </div>
    );
  }

  // Double check that we are indeed a buyer to avoid layout flash
  if (session.user.role !== "BUYER") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
