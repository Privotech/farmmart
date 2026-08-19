"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-client";
import Link from "next/link";

interface AuthContainerProps {
  initialMode: "login" | "register";
}

export default function AuthContainer({ initialMode }: AuthContainerProps) {
  const { signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [selectedRole, setSelectedRole] = useState<"BUYER" | "SELLER" | null>(null);

  const handleToggle = (mode: "login" | "register") => {
    setIsLogin(mode === "login");
    window.history.pushState(null, "", `/${mode}`);
    setError("");
  };

  const handleRoleSelect = (role: "BUYER" | "SELLER") => {
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
      });

      if (!result?.ok) {
        setError(result?.error || "Invalid email or password");
      } else {
        window.location.href = "/dashboard";
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: selectedRole,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Registration failed");
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn("credentials", {
        email: regEmail,
        password: regPassword,
      });

      if (!signInResult?.ok) {
        setError(signInResult?.error || "Login after registration failed.");
        handleToggle("login");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page h-screen w-screen bg-background flex items-center justify-center overflow-auto">
      {!selectedRole && (
        <div className="w-full max-w-md px-4 py-8">
          <div className="bg-surface rounded-2xl shadow-xl p-8 border border-border text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Choose Your Role
            </h1>
            <p className="text-text-secondary mb-8">
              Select how you want to use FarmMart
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect("BUYER")}
                className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                    <svg
                      className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors"
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
                    <h3 className="font-bold text-foreground">Buyer</h3>
                    <p className="text-sm text-text-secondary">
                      Browse and purchase animals
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("SELLER")}
                className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <svg
                      className="w-6 h-6 text-secondary group-hover:text-secondary-foreground transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-foreground">Seller</h3>
                    <p className="text-sm text-text-secondary">
                      List and sell your animals
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRole && (
        <div className="relative w-full max-w-4xl h-full max-h-[700px] bg-surface shadow-2xl overflow-hidden border border-border rounded-3xl my-8 mx-4">
          <button
            onClick={handleBackToRoleSelection}
            className="absolute top-4 left-4 z-50 p-2 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors text-text-secondary"
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

          <div className="absolute top-4 right-4 z-50">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary-50 text-primary border border-primary-200">
              {selectedRole === "BUYER" ? "Buyer" : "Seller"}
            </span>
          </div>

          {/* Sign Up Form */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
              isLogin
                ? "opacity-0 z-10 translate-x-0"
                : "opacity-100 z-50 translate-x-full"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full px-12 text-center bg-surface">
              <h1 className="text-4xl font-bold text-foreground mb-6">Sign Up</h1>

              <div className="flex items-center w-full mb-6 text-text-secondary">
                <div className="flex-1 h-px bg-border"></div>
                <span className="px-3 text-sm">Create Your Account</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {error && !isLogin && (
                <div className="w-full bg-danger-50 border border-danger-200 text-danger text-sm p-3 rounded-xl mb-4">
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
                  className="w-full bg-surface border-border px-4 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border shadow-sm"
                  required
                />
                <input
                  type="email"
                  placeholder="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-surface border-border px-4 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border shadow-sm"
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-surface border-border px-4 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border shadow-sm"
                  required
                />

                <div className="flex items-center mt-2 mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm text-text-secondary cursor-pointer"
                  >
                    I accept the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-hover underline"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
                >
                  {isLoading ? "LOADING..." : "REGISTER"}
                </button>
              </form>
            </div>
          </div>

          {/* Sign In Form */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
              isLogin
                ? "opacity-100 z-50 translate-x-0"
                : "opacity-0 z-10 translate-x-full"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full px-12 text-center bg-surface">
              <h1 className="text-4xl font-bold text-foreground mb-6">Sign In</h1>

              <div className="flex items-center w-full mb-6 text-text-secondary">
                <div className="flex-1 h-px bg-border"></div>
                <span className="px-3 text-sm">Access Your Account</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {error && isLogin && (
                <div className="w-full bg-danger-50 border border-danger-200 text-danger text-sm p-3 rounded-xl mb-4">
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
                  className="w-full bg-surface border-border px-4 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border shadow-sm"
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-surface border-border px-4 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border shadow-sm"
                  required
                />

                <div className="flex justify-between items-center mt-2 mb-4 px-1">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-text-secondary hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
                >
                  {isLoading ? "LOADING..." : "LOG IN"}
                </button>
              </form>
            </div>
          </div>

          {/* Overlay */}
          <div
            className={`absolute top-0 left-1/2 h-full w-1/2 overflow-hidden transition-all duration-700 ease-in-out z-100 ${
              isLogin ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div
              className={`relative h-full w-[200%] transition-all duration-700 ease-in-out bg-primary text-primary-foreground ${
                isLogin ? "translate-x-[-50%]" : "translate-x-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-700"></div>

              <div className="relative flex h-full">
                <div className="flex flex-col justify-center items-center h-full w-1/2 px-10 text-center">
                  <h1 className="w-full text-center text-4xl font-bold mb-4">Hello, Friend!</h1>
                  <p className="w-full max-w-sm text-center mb-8">
                    Register with your personal details to use all site features
                  </p>
                  <button
                    onClick={() => handleToggle("register")}
                    className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-primary transition-all"
                  >
                    SIGN UP
                  </button>
                </div>

                <div className="flex flex-col justify-center items-center h-full w-1/2 px-10 text-center">
                  <h1 className="w-full text-center text-4xl font-bold mb-4">Welcome Back!</h1>
                  <p className="w-full max-w-sm text-center mb-8">
                    To keep connected with us please login with your personal info
                  </p>
                  <button
                    onClick={() => handleToggle("login")}
                    className="border-2 border-white px-10 py-2 rounded-full font-bold hover:bg-white hover:text-primary transition-all"
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
