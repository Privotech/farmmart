"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err: unknown) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">Forgot Password</h1>
        
        {message && (
          <div className="bg-emerald-900/30 border border-emerald-800 text-emerald-400 p-3 rounded mb-6 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border-gray-700 px-4 py-3 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <Button variant="primary" className="w-full py-3" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-emerald-500 hover:text-emerald-400">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
