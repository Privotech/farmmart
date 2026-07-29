"use client";

import Link from "next/link";
import { useSession, useAuth } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
}

const OverviewIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM1 9h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const InventoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826 2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826 2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuyerLiveBidsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const BuyerSupplyChainIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const BuyerPriceIndexIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const BuyerReportsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const Sidebar = () => {
  const { data: session } = useSession();
  const { signOut } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const buyerLinks: SidebarLink[] = [
    { href: "/buyer/dashboard", label: "DASHBOARD", icon: <OverviewIcon /> },
    { href: "/buyer/live-bids", label: "LIVE BIDS", icon: <BuyerLiveBidsIcon /> },
    { href: "/buyer/supply-chain", label: "SUPPLY CHAIN", icon: <BuyerSupplyChainIcon /> },
    { href: "/buyer/price-index", label: "PRICE INDEX", icon: <BuyerPriceIndexIcon /> },
    { href: "/buyer/reports", label: "REPORTS", icon: <BuyerReportsIcon /> },
  ];

  const sellerLinks: SidebarLink[] = [
    { href: "/seller/dashboard", label: "Seller Dashboard", icon: <OverviewIcon /> },
    { href: "/seller/orders", label: "Buyer Orders", icon: <OrdersIcon /> },
    { href: "/seller/animals", label: "Inventory Track", icon: <InventoryIcon /> },
    { href: "/seller/analytics", label: "Seller Analytics", icon: <AnalyticsIcon /> },
    { href: "/seller/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const dashboardLinks = session?.user?.role === "SELLER" ? sellerLinks : buyerLinks;

  if (!session) return null;

  const isSeller = session.user?.role === "SELLER";

  return (
    <aside className={`hidden md:flex flex-col w-64 ${isSeller ? "bg-emerald-950" : "bg-emerald-950"} h-screen sticky top-0 border-r border-emerald-800`}>
      <div className="p-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          {isSeller && (
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">🐄</span>
            </div>
          )}
          <h3 className={`text-xl font-bold tracking-tight ${isSeller ? "text-emerald-100" : "text-emerald-100"}`}>
            {isSeller ? "Livestock Seller Portal" : "Digital Harvest"}
          </h3>
        </div>
        {!isSeller && (
          <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Global Logistics</p>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {dashboardLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-bold ${
              pathname === link.href
                ? (isSeller ? "bg-emerald-900 text-emerald-100 shadow-sm" : "bg-emerald-900 text-emerald-400 shadow-sm border-l-4 border-emerald-500 rounded-l-none -ml-4 pl-8")
                : (isSeller ? "text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900" : "text-emerald-400 hover:text-emerald-500")
            }`}
          >
            <span className="flex-shrink-0">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-6 space-y-4">
        <Link href={isSeller ? "/seller/animals/new" : "/buyer/listings"}>
          <button className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
            isSeller 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {isSeller ? "New Livestock Listing" : "New Procurement"}
          </button>
        </Link>
        
        <div className="pt-4 border-t border-emerald-800 space-y-1">
          <Link href="/help" className={`flex items-center gap-3 px-4 py-2 text-sm font-bold ${
            isSeller ? "text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900" : "text-emerald-400 hover:text-emerald-500"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isSeller ? "Help Center" : "SUPPORT"}
          </Link>
          <button 
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-bold ${
            isSeller ? "text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900" : "text-emerald-400 hover:text-emerald-500"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
