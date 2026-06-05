"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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


  const handleToggle = (mode: "login" | "register") => {
    setIsLogin(mode === "login");
    window.history.pushState(null, "", `/${mode}`);
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
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="relative w-full max-w-[850px] h-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Sign Up Form (Left Side conceptually, but absolute positioned) */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
            isLogin ? "opacity-0 z-10 translate-x-[100%]" : "opacity-100 z-50 translate-x-0"
          }`}
        >
          <div className="flex flex-col justify-center items-center h-full px-12 text-center bg-white">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Sign Up</h1>
            
            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-6">
              {[ 
                { icon: "f", label: "Facebook" },
                { icon: "X", label: "Twitter" },
                { icon: "G", label: "Github" },
                { icon: "in", label: "LinkedIn" }
              ].map((social, i) => (
                <button key={i} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                  <span className="font-semibold">{social.icon}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center w-full mb-6 text-gray-400">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="px-3 text-sm">Or</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {error && !isLogin && (
              <div className="w-full bg-red-50 text-red-600 text-sm p-2 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col gap-3">
              <input
                type="text"
                placeholder="name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-[#f3f4f6] border-none px-4 py-3 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5F3F]"
                required
              />
              <input
                type="email"
                placeholder="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-[#f3f4f6] border-none px-4 py-3 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5F3F]"
                required
              />
              <input
                type="password"
                placeholder="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-[#f3f4f6] border-none px-4 py-3 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5F3F]"
                required
              />
              
              <div className="flex items-center mt-2 mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-[#FF5F3F] border-gray-300 rounded focus:ring-[#FF5F3F]"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-500 cursor-pointer">
                  I accept terms
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF5F3F] hover:bg-[#E84E2F] text-white font-bold py-3 rounded transition-colors shadow-lg shadow-orange-500/30"
              >
                {isLoading ? "LOADING..." : "REGISTER"}
              </button>
            </form>
          </div>
        </div>

        {/* Sign In Form (Right Side conceptually) */}
        <div
          className={`absolute top-0 right-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
            isLogin ? "opacity-100 z-50 translate-x-0" : "opacity-0 z-10 translate-x-[100%]"
          }`}
        >
          <div className="flex flex-col justify-center items-center h-full px-12 text-center bg-white">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Sign In</h1>
            
            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-6">
              {[ 
                { icon: "f", label: "Facebook" },
                { icon: "X", label: "Twitter" },
                { icon: "G", label: "Github" },
                { icon: "in", label: "LinkedIn" }
              ].map((social, i) => (
                <button key={i} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                  <span className="font-semibold">{social.icon}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center w-full mb-6 text-gray-400">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="px-3 text-sm">Or</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {error && isLogin && (
              <div className="w-full bg-red-50 text-red-600 text-sm p-2 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-3">
              <input
                type="email"
                placeholder="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#f3f4f6] border-none px-4 py-3 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5F3F]"
                required
              />
              <input
                type="password"
                placeholder="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#f3f4f6] border-none px-4 py-3 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5F3F]"
                required
              />
              
              <div className="flex justify-between items-center mt-2 mb-4 px-1">
                <Link href="#" className="text-sm text-gray-500 hover:text-[#FF5F3F]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF5F3F] hover:bg-[#E84E2F] text-white font-bold py-3 rounded transition-colors shadow-lg shadow-orange-500/30"
              >
                {isLoading ? "LOADING..." : "LOG IN"}
              </button>
            </form>
          </div>
        </div>

        {/* Overlay Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${
            isLogin ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Inner Overlay with Gradient */}
          <div
            className={`absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-br from-[#FF8E3C] to-[#FF4B2B] text-white transition-transform duration-700 ease-in-out ${
              isLogin ? "translate-x-0" : "translate-x-1/2"
            }`}
          >
            {/* Left Overlay Panel (Visible when isLogin = false, i.e., Sign Up mode) */}
            <div
              className={`absolute top-0 flex flex-col justify-center items-center w-1/2 h-full px-12 text-center transition-transform duration-700 ease-in-out ${
                isLogin ? "translate-x-[-20%]" : "translate-x-0"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-lg font-light mb-8 opacity-90">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={() => handleToggle("login")}
                className="px-10 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-[#FF4B2B] transition-colors"
              >
                ← LOG IN
              </button>
            </div>

            {/* Right Overlay Panel (Visible when isLogin = true, i.e., Login mode) */}
            <div
              className={`absolute top-0 right-0 flex flex-col justify-center items-center w-1/2 h-full px-12 text-center transition-transform duration-700 ease-in-out ${
                isLogin ? "translate-x-0" : "translate-x-[20%]"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
              <p className="text-lg font-light mb-8 opacity-90">
                Enter your personal details and start your journey with us
              </p>
              <button
                onClick={() => handleToggle("register")}
                className="px-10 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-[#FF4B2B] transition-colors"
              >
                SIGN UP →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
