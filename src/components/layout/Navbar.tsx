"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-gray-100">
            <img src="/logo.svg" alt="FarmMart" className="w-10 h-10" />
            <span className="hidden sm:inline">FarmMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/logistics" className="text-gray-300 hover:text-emerald-500 transition font-medium">
              Logistics
            </Link>
            <Link href="/contact-us" className="text-gray-300 hover:text-emerald-500 transition font-medium">
              Contact Us
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-emerald-500 transition font-medium">
              About The App
            </Link>
            <Link href="/mission" className="text-gray-300 hover:text-emerald-500 transition font-medium">
              Mission
            </Link>
            <Link href="/vision" className="text-gray-300 hover:text-emerald-500 transition font-medium">
              Vision
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-emerald-500 transition font-medium"
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
                  <Button variant="secondary" size="sm">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-400 hover:text-gray-100 p-2 rounded-md hover:bg-gray-800"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 bg-gray-900/60 p-4 rounded-lg shadow">
            <Link href="/logistics" className="block text-gray-300 hover:text-emerald-600 font-medium">
              Logistics
            </Link>
            <Link href="/contact-us" className="block text-gray-300 hover:text-emerald-600 font-medium">
              Contact Us
            </Link>
            <Link href="/about" className="block text-gray-300 hover:text-emerald-600 font-medium">
              About The App
            </Link>
            <Link href="/mission" className="block text-gray-300 hover:text-emerald-600 font-medium">
              Mission
            </Link>
            <Link href="/vision" className="block text-gray-300 hover:text-emerald-600 font-medium">
              Vision
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block text-gray-300 hover:text-emerald-600 font-medium">
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
                  <Button variant="secondary" size="sm" className="w-full">
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
        )}
      </div>
    </nav>
  );
};
