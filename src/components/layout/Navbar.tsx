"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, useAuth } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { data: session } = useSession();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="bg-surface/95 backdrop-blur-md sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-semibold text-foreground"
          >
            <Image
              src="/logo.svg"
              alt="FarmMart"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="hidden sm:inline">FarmMart</span>
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/listings"
              className="text-gray-700 hover:text-primary transition font-medium"
            >
              Browse
            </Link>
            <Link
              href="/logistics"
              className="text-gray-700 hover:text-primary transition font-medium"
            >
              Logistics
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary transition font-medium"
            >
              About
            </Link>
            <Link
              href="/mission"
              className="text-gray-700 hover:text-primary transition font-medium"
            >
              Mission
            </Link>
            <Link
              href="/contact-us"
              className="text-gray-700 hover:text-primary transition font-medium"
            >
              Contact
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary transition font-medium"
                >
                  Dashboard
                </Link>
                <Button variant="secondary" onClick={handleSignOut} size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-primary p-2 rounded-lg hover:bg-primary-600"
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-1 bg-surface p-4 rounded-xl shadow border border-border">
            <Link
              href="/listings"
              className="block px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 font-medium"
            >
              Browse Animals
            </Link>
            <Link
              href="/logistics"
              className="block px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 font-medium"
            >
              Logistics
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 font-medium"
            >
              About
            </Link>
            <Link
              href="/mission"
              className="block px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 font-medium"
            >
              Mission
            </Link>
            <Link
              href="/vision"
              className="block px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 font-medium"
            >
              Vision
            </Link>
            <Link
              href="/contact-us"
              className="block px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 font-medium"
            >
              Contact
            </Link>
            <div className="pt-3 mt-2 border-t border-border space-y-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={handleSignOut}
                    size="sm"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button variant="primary" size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
