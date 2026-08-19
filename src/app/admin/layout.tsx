
import { ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
    
    