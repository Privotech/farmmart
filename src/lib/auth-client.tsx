"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: "BUYER" | "SELLER" | "ADMIN";
    image?: string;
  };
}

interface SignInOptions {
  email?: string;
  password?: string;
  callbackUrl?: string;
}

interface SignOutOptions {
  redirect?: boolean;
  callbackUrl?: string;
}

interface AuthContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (provider: string, options?: SignInOptions) => Promise<{ ok: boolean; error?: string }>;
  signOut: (options?: SignOutOptions) => Promise<void>;
  signUp: (name: string, email: string, password?: string, role?: string) => Promise<{ ok: boolean; error?: string }>;
  updateSession: (userUpdates: Partial<Session['user']>) => Promise<Session | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (response.ok && data.success) {
          setSession({ user: data.user });
          setStatus("authenticated");
        } else {
          setSession(null);
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession(null);
        setStatus("unauthenticated");
      }
    };

    fetchSession();
  }, []);

  const signIn = async (provider: string, options: SignInOptions = {}) => {
    if (provider === "credentials") {
      const { email, password } = options;
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const sessionData: Session = {
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              image: data.user.image,
            },
          };
          setSession(sessionData);
          setStatus("authenticated");
          return { ok: true };
        } else {
          return { ok: false, error: data.error || "Invalid email or password" };
        }
      } catch (error) {
        console.error("SignIn error:", error);
        return { ok: false, error: "An unexpected error occurred during sign-in." };
      }
    }

    return { ok: false, error: "Unsupported login method" };
  };

  const signOut = async (options: SignOutOptions = {}) => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("SignOut error:", error);
    } finally {
      setSession(null);
      setStatus("unauthenticated");
      if (options.redirect !== false) {
        router.push(options.callbackUrl || "/");
      }
    }
  };

  const signUp = async (name: string, email: string, password?: string, role?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { ok: true };
      } else {
        return { ok: false, error: data.error || "An error occurred during registration" };
      }
    } catch (error) {
      console.error("SignUp error:", error);
      return { ok: false, error: "An unexpected error occurred during registration." };
    }
  };

  const updateSession = async (userUpdates: Partial<Session['user']>) => {
    // This function should ideally make a request to the server to update the user's session.
    // For now, we'll just update the local state.
    if (session) {
      const updated = {
        ...session,
        user: {
          ...session.user,
          ...userUpdates
        }
      };
      setSession(updated);
      return updated;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ session, status, signIn, signOut, signUp, updateSession }}>
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
    update: async (userUpdates: Partial<Session['user']>) => {
      return context.updateSession(userUpdates);
    }
  };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SessionProvider (from auth-client)");
  }
  return context;
}
