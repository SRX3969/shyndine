"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@shynrestaurant.com");
  const [pin, setPin] = useState("1892");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#201E1A] p-4 text-[#FFFEFC]">
      <div className="max-w-md w-full bg-[#FFFEFC] text-[#201E1A] p-8 sm:p-10 rounded-3xl border border-[#B39460] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#201E1A] text-[#B39460] border border-[#B39460] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wider uppercase text-[#201E1A]">
            SHYN Console
          </h1>
          <p className="text-xs text-[#8A8175]">
            Restaurant Management & Staff Access Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Staff Email / ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Station PIN / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" />
              <input
                required
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-serif text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>Authorize & Open Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-[#8A8175] hover:text-[#201E1A] transition-colors"
          >
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
