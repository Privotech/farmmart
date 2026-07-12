"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "./Navbar";

export const NavbarWrapper = () => {
  const pathname = usePathname();
  const { data: session } = useSession();


  if (session) {
    if (pathname === "/") {
      return <Navbar />;
    }
    return null;
  }


  return <Navbar />;
};
