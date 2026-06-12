"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { localStorageDb } from "@/lib/localStorageDb";

interface AuthContainerProps {
  initialMode: "login" | "register";
}

export default function AuthContainer({ initialMode }: AuthContainerProps) {
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
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Role Selection State
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | null>(
    null,
  );

  const handleToggle = (mode: "login" | "register") => {
    setIsLogin(mode === "login");
    window.history.pushState(null, "", `/${mode}`);
    setError("");
  };

  const handleRoleSelect = (role: "buyer" | "seller") => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
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
        router.push("/dashboard");
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

    if (!regName || !regEmail || !regPassword) {
      setError("All fields are required");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(regName, regEmail, regPassword);

      if (!result.ok) {
        setError(result.error || "Registration failed");
        return;
      }

      // Set role based on selection
      const users = localStorageDb.getUsers();
      const user = users.find((u) => u.email === regEmail);

      if (user && selectedRole) {
        localStorageDb.updateUserRole(user.id, selectedRole);
      }

      // Automatically log in after registration, or switch to login mode
      handleToggle("login");
      setLoginEmail(regEmail);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {!selectedRole && (
        <div className="w-full max-w-md">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
            <h1 className="text-3xl font-bold text-gray-100 mb-2 text-center">
              Choose Your Role
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Select how you want to use FarmMart
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect("buyer")}
                className="w-full p-6 border-2 border-gray-800 rounded-xl hover:border-emerald-500 hover:bg-gray-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <svg
                      className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-100">Buyer</h3>
                    <p className="text-sm text-gray-400">
                      Browse and purchase animals
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("seller")}
                className="w-full p-6 border-2 border-gray-800 rounded-xl hover:border-emerald-500 hover:bg-gray-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <svg
                      className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-100">Seller</h3>
                    <p className="text-sm text-gray-400">
                      List and sell your animals
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      {selectedRole && (
        <div className="relative w-full max-w-[850px] h-[550px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
          {/* Back Button */}
          <button
            onClick={handleBackToRoleSelection}
            className="absolute top-4 left-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-gray-400"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Role Badge */}
          <div className="absolute top-4 right-4 z-50">
            <span
              className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-900/30 text-emerald-400"
            >
              {selectedRole === "buyer" ? "Buyer" : "Seller"}
            </span>
          </div>

          {/* Sign Up Form (Left Side conceptually, but absolute positioned) */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
              isLogin
                ? "opacity-0 z-10 translate-x-0"
                : "opacity-100 z-50 translate-x-[100%]"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full px-12 text-center bg-gray-900">
              <h1 className="text-4xl font-bold text-gray-100 mb-4">Sign Up</h1>

              {/* Social Icons */}
              <div className="flex justify-center gap-4 mb-6">
                {[
                  { icon: "f", label: "Facebook" },
                  { icon: "X", label: "Twitter" },
                  { icon: "G", label: "Github" },
                  { icon: "in", label: "LinkedIn" },
                ].map((social, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-semibold">{social.icon}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center w-full mb-6 text-gray-600">
                <div className="flex-1 h-[1px] bg-gray-800"></div>
                <span className="px-3 text-sm">Or</span>
                <div className="flex-1 h-[1px] bg-gray-800"></div>
              </div>

              {error && !isLogin && (
                <div className="w-full bg-red-900/30 border border-red-800 text-red-400 text-sm p-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleRegisterSubmit}
                className="w-full flex flex-col gap-3"
              >
                <input
                  type="text"
                  placeholder="name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 px-4 py-3 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="email"
                  placeholder="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 px-4 py-3 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 px-4 py-3 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />

                <div className="flex items-center mt-2 mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 bg-gray-800 border-gray-700 rounded focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm text-gray-400 cursor-pointer"
                  >
                    I accept terms
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition-colors shadow-lg shadow-emerald-900/20"
                >
                  {isLoading ? "LOADING..." : "REGISTER"}
                </button>
              </form>
            </div>
          </div>

          {/* Sign In Form (Right Side conceptually, now using left-0 base) */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
              isLogin
                ? "opacity-100 z-50 translate-x-0"
                : "opacity-0 z-10 translate-x-[100%]"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full px-12 text-center bg-gray-900">
              <h1 className="text-4xl font-bold text-gray-100 mb-4">Sign In</h1>

              {/* Social Icons */}
              <div className="flex justify-center gap-4 mb-6">
                {[
                  { icon: "f", label: "Facebook" },
                  { icon: "X", label: "Twitter" },
                  { icon: "G", label: "Github" },
                  { icon: "in", label: "LinkedIn" },
                ].map((social, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-semibold">{social.icon}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center w-full mb-6 text-gray-600">
                <div className="flex-1 h-[1px] bg-gray-800"></div>
                <span className="px-3 text-sm">Or</span>
                <div className="flex-1 h-[1px] bg-gray-800"></div>
              </div>

              {error && isLogin && (
                <div className="w-full bg-red-900/30 border border-red-800 text-red-400 text-sm p-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLoginSubmit}
                className="w-full flex flex-col gap-3"
              >
                <input
                  type="email"
                  placeholder="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 px-4 py-3 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 px-4 py-3 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />

                <div className="flex justify-between items-center mt-2 mb-4 px-1">
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-emerald-500"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition-colors shadow-lg shadow-emerald-900/20"
                >
                  {isLoading ? "LOADING..." : "LOG IN"}
                </button>
              </form>
            </div>
          </div>

          {/* Overlay (Conceptual Right/Left side that moves) */}
          <div
            className={`absolute top-0 left-1/2 h-full w-1/2 overflow-hidden transition-all duration-700 ease-in-out z-100 ${
              isLogin ? "translate-x-0" : "translate-x-[-100%]"
            }`}
          >
            <div
              className={`relative h-full w-[200%] translate-x-0 transition-all duration-700 ease-in-out bg-emerald-600 text-white ${
                isLogin ? "translate-x-[-50%]" : "translate-x-0"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-600 to-green-900"></div>

              {/* Overlay Panels */}
              <div className="relative flex h-full">
                {/* Left Panel */}
                <div
                  className={`flex flex-col justify-center items-center h-full w-1/2 px-10 text-center transition-all duration-700 ${
                    isLogin ? "translate-x-0" : "translate-x-[-20%]"
                  }`}
                >
                  <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
                  <p className="mb-8">
                    Register with your personal details to use all of site
                    features
                  </p>
                  <button
                    onClick={() => handleToggle("register")}
                    className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-emerald-600 transition-all"
                  >
                    SIGN UP
                  </button>
                </div>

                {/* Right Panel */}
                <div
                  className={`flex flex-col justify-center items-center h-full w-1/2 px-10 text-center transition-all duration-700 ${
                    isLogin ? "translate-x-[20%]" : "translate-x-0"
                  }`}
                >
                  <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                  <p className="mb-8">
                    To keep connected with us please login with your personal
                    info
                  </p>
                  <button
                    onClick={() => handleToggle("login")}
                    className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-emerald-600 transition-all"
                  >
                    SIGN IN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
