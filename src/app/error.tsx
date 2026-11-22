"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F4EE] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-red-100 border border-red-300 text-red-700 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-3xl text-[#201E1A]">
        An Unexpected Hiccup Occurred
      </h1>
      <p className="text-xs text-[#8A8175] max-w-md">
        {error.message || "We encountered a momentary pause. Our attendants are checking the kitchen hearth."}
      </p>
      <div className="pt-2 flex gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] text-xs font-semibold uppercase tracking-wider"
        >
          Retry Service
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full border border-[#B39460] text-[#201E1A] text-xs font-semibold uppercase tracking-wider"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
