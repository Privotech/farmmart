"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface SidebarLink {
  href: string;
  label: string;
  icon: string;
}

export const Sidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const dashboardLinks: SidebarLink[] = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/animals", label: "My Animals", icon: "🐄" },
    { href: "/dashboard/orders", label: "Orders", icon: "📦" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ];

  if (!session) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-100 h-screen sticky top-0">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">
          {session.user?.name || "Dashboard"}
        </h3>
        <p className="text-sm text-gray-600">{session.user?.email}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {dashboardLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded-lg transition ${
              pathname === link.href
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
