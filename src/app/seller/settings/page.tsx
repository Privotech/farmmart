import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SellerSettingsClient from "./SellerSettingsClient";

export default async function SellerSettingsPage() {
  const session = await getSession();

  if (!session?.userId || session.role !== "SELLER") {
    redirect("/login");
  }

  const seller = await prisma.users.findUnique({
    where: { id: session.userId },
  });

  if (!seller) {
    redirect("/login");
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seller Settings</h1>
          <p className="text-gray-600">
            Manage your profile, submit verification documents, and get verified to unlock seller benefits.
          </p>
        </div>
        <SellerSettingsClient seller={JSON.parse(JSON.stringify(seller))} />
      </div>
    </div>
  );
}
