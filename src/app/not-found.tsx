import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full border border-[#B39460] flex items-center justify-center bg-[#201E1A] text-[#B39460]">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-4xl text-[#201E1A]">404 — Table Not Found</h1>
        <p className="text-xs text-[#8A8175] max-w-sm">
          The sanctuary or dish you are searching for may have been retired to our ancestral recipe archives.
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 rounded-full bg-[#201E1A] text-[#B39460] text-xs uppercase tracking-widest font-semibold hover:bg-[#B39460] hover:text-[#201E1A] transition-all"
        >
          Return to Grand Entrance
        </Link>
      </main>
      <Footer />
    </div>
  );
}
