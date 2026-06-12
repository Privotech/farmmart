"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "./Navbar";

export const NavbarWrapper = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If user is logged in, only show navbar on the landing page ("/")
  if (session) {
    if (pathname === "/") {
      return <Navbar />;
    }
    return null;
  }

  // If user is not logged in, show navbar everywhere so they can navigate and login/register
  return <Navbar />;
};
