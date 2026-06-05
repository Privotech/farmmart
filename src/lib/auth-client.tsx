"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: "buyer" | "seller" | "admin";
    image?: string;
  };
}

interface AuthContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (provider: string, options: any) => Promise<{ ok: boolean; error?: string }>;
  signOut: (options?: any) => Promise<void>;
  signUp: (name: string, email: string, role?: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const savedSession = localStorage.getItem("farmmart_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession(parsed);
        setStatus("authenticated");
      } catch {
        localStorage.removeItem("farmmart_session");
        setStatus("unauthenticated");
      }
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const signIn = async (provider: string, options: any) => {
    if (provider === "credentials") {
      const { email, password } = options;
      
      const usersStr = localStorage.getItem("farmmart_users") || "[]";
      const users = JSON.parse(usersStr) as (User & { password?: string })[];
      
      const matchedUser = users.find(u => u.email === email && u.password === password);
      
      if (matchedUser) {
        const sessionData: Session = {
          user: {
            id: matchedUser.id,
            email: matchedUser.email,
            name: matchedUser.name,
            role: matchedUser.role,
            image: matchedUser.image
          }
        };
        localStorage.setItem("farmmart_session", JSON.stringify(sessionData));
        setSession(sessionData);
        setStatus("authenticated");
        
        document.cookie = `farmmart_session_email=${matchedUser.email}; path=/; max-age=2592000; SameSite=Lax`;
        
        return { ok: true };
      }
      
      if (email === "test@farmmart.com" && password === "password") {
        const mockUser: Session = {
          user: {
            id: "test-user-id",
            email: "test@farmmart.com",
            name: "John Doe",
            role: "buyer"
          }
        };
        localStorage.setItem("farmmart_session", JSON.stringify(mockUser));
        setSession(mockUser);
        setStatus("authenticated");
        document.cookie = `farmmart_session_email=test@farmmart.com; path=/; max-age=2592000; SameSite=Lax`;
        return { ok: true };
      }

      return { ok: false, error: "Invalid email or password" };
    }
    
    // Social / Google login mock
    if (provider === "google") {
      const mockUser: Session = {
        user: {
          id: "google-user-id",
          email: "google@farmmart.com",
          name: "Google Friend",
          role: "buyer",
          image: "/logo.svg"
        }
      };
      localStorage.setItem("farmmart_session", JSON.stringify(mockUser));
      setSession(mockUser);
      setStatus("authenticated");
      document.cookie = `farmmart_session_email=google@farmmart.com; path=/; max-age=2592000; SameSite=Lax`;
      return { ok: true };
    }

    return { ok: false, error: "Unsupported login method" };
  };

  const signOut = async (options?: any) => {
    localStorage.removeItem("farmmart_session");
    setSession(null);
    setStatus("unauthenticated");
    document.cookie = "farmmart_session_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    
    if (options?.redirect !== false) {
      router.push(options?.callbackUrl || "/");
    }
  };

  const signUp = async (name: string, email: string, password?: string) => {
    const usersStr = localStorage.getItem("farmmart_users") || "[]";
    const users = JSON.parse(usersStr) as (User & { password?: string })[];

    const exists = users.some(u => u.email === email);
    if (exists) {
      return { ok: false, error: "Email already registered" };
    }

    const newUser: User & { password?: string } = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
      role: "buyer",
      password: password || "password",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem("farmmart_users", JSON.stringify(users));
    return { ok: true };
  };

  return (
    <AuthContext.Provider value={{ session, status, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider (from auth-client)");
  }
  return {
    data: context.session,
    status: context.status,
    update: async () => {}
  };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SessionProvider (from auth-client)");
  }
  return context;
}

// Emulating next-auth wrappers
export const signIn = async (provider: string, options: any) => {
  // Direct calls outside useAuth hook context will be tricky,
  // so we delegate to the window/provider system if needed.
  // But inside AuthContainer, we can use useAuth hook!
  if (typeof window !== "undefined") {
    console.warn("Please use useAuth() hook for signIn inside client components.");
  }
  return { ok: true };
};

export const signOut = async (options?: any) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("farmmart_session");
    document.cookie = "farmmart_session_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    if (options?.redirect !== false) {
      window.location.href = options?.callbackUrl || "/";
    }
  }
};
