"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
      const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN;

      if (!validEmail || !validPassword || !adminSecret) {
        setError("Admin credentials are not configured. Contact the system administrator.");
        setLoading(false);
        return;
      }

      if (email.trim() === validEmail && password === validPassword) {
        if (typeof window !== "undefined") {
          localStorage.setItem("mahanaim_admin_token", adminSecret);
        }
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Mahanaim NGO Official Logo"
              width={220}
              height={60}
              priority
              className="h-14 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900">NGO Staff Portal</h1>
          <p className="text-xs text-brandTeal-600 font-semibold italic">
            Spread Love.... Spread Peace....
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-cream-100 p-3.5 rounded-2xl border border-cream-300 text-xs text-gray-700 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-brandRed-500">
            <ShieldCheck className="w-4 h-4" /> Authorized Personnel Only
          </div>
          <div className="text-gray-500">
            This portal is restricted to Mahanaim NGO staff. Unauthorized access attempts are logged.
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brandRed-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brandRed-500"
              />
            </div>
          </div>

          {error && <div className="text-xs text-red-600 font-semibold">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brandRed-500 hover:bg-brandRed-600 text-white font-bold py-3.5 rounded-full shadow-md text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
