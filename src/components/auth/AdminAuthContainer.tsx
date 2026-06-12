"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { localStorageDb } from "@/lib/localStorageDb";

interface AdminAuthContainerProps {
  initialMode: "login" | "register";
}

export default function AdminAuthContainer({ initialMode }: AdminAuthContainerProps) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [adminSecretKey, setAdminSecretKey] = useState("");

  const handleToggle = (mode: "login" | "register") => {
    setIsLogin(mode === "login");
    setError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error || "Invalid email or password");
      } else {
        // Check if user is admin
        const users = localStorageDb.getUsers();
        const user = users.find((u) => u.email === loginEmail);
        
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          setError("Access denied. Admin only.");
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!regName || !regEmail || !regPassword || !adminSecretKey) {
      setError("All fields are required");
      return;
    }

    // Verify admin secret key
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY || adminSecretKey !== "FARMMART_ADMIN_2024_SECRET") {
      setError("Invalid admin secret key");
      return;
    }

    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(regName, regEmail, regPassword);

      if (!result.ok) {
        setError(result.error || "Registration failed");
        return;
      }

      // Update user role to admin
      const users = localStorageDb.getUsers();
      const user = users.find((u) => u.email === regEmail);
      
      if (user) {
        localStorageDb.updateUserRole(user.id, "admin");
        handleToggle("login");
        setLoginEmail(regEmail);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Admin Login" : "Admin Registration"}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? "Access admin dashboard" : "Create admin account"}
            </p>
          </div>

          {error && (
            <div className="bg-emerald-900/50 text-emerald-200 text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition-colors"
              >
                {isLoading ? "LOADING..." : "LOGIN"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition-colors"
              >
                {isLoading ? "LOADING..." : "REGISTER"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => handleToggle(isLogin ? "register" : "login")}
              className="text-emerald-400 hover:text-emerald-300 text-sm"
            >
              {isLogin ? "Need an admin account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
