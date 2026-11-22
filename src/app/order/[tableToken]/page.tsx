"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QrCode, UtensilsCrossed, Sparkles, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useCart } from "@/hooks/useCart";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface TableEntryPageProps {
  params: Promise<{ tableToken: string }>;
}

export default function TableEntryPage({ params }: TableEntryPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getTableByToken, tables } = useRestaurant();
  const { setActiveTable } = useCart();

  const [table, setTable] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const foundTable = getTableByToken(resolvedParams.tableToken);
    if (foundTable && foundTable.isActive) {
      setTable(foundTable);
      setActiveTable(foundTable);
      setIsValidating(false);
    } else {
      // Fallback: check if tableToken matches tableNumber or id
      const byNumber = tables.find(
        (t) =>
          t.tableNumber.toLowerCase() === resolvedParams.tableToken.toLowerCase() ||
          t._id === resolvedParams.tableToken
      );
      if (byNumber) {
        setTable(byNumber);
        setActiveTable(byNumber);
        setIsValidating(false);
      } else {
        setError("Invalid or inactive table QR code. Please ask your dining attendant.");
        setIsValidating(false);
      }
    }
  }, [resolvedParams.tableToken, getTableByToken, tables, setActiveTable]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#B39460] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-[#201E1A]">
            Authenticating Table QR Session...
          </p>
        </div>
      </div>
    );
  }

  if (error || !table) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-100 border border-red-300 flex items-center justify-center mx-auto text-red-700">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl text-[#201E1A]">
            Table QR Token Unverified
          </h1>
          <p className="text-xs text-[#8A8175] leading-relaxed">
            {error || "We could not find an active table session for this QR link."}
          </p>
          <div className="pt-4">
            <Link
              href="/menu"
              className="px-6 py-3 rounded-full bg-[#201E1A] text-[#B39460] text-xs uppercase tracking-widest font-semibold"
            >
              Browse General Menu
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-[#FFFEFC] rounded-3xl p-8 sm:p-12 border border-[#B39460]/30 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#B39460] via-[#CBB07E] to-[#B39460]" />

          {/* Badge */}
          <div className="w-16 h-16 rounded-full bg-[#201E1A] text-[#B39460] border border-[#B39460] flex items-center justify-center mx-auto shadow-md">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Table Identified & Verified</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#201E1A]">
              Welcome to Table {table.tableNumber}
            </h1>
            <p className="text-xs text-[#8A8175] font-sans">
              Seating in <strong>{table.section}</strong> (Capacity: {table.capacity} Guests)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#B39460]/20 text-xs text-[#8A8175] space-y-1.5">
            <p className="text-[#201E1A] font-semibold">
              👑 Dine-In Digital Ordering Enabled
            </p>
            <p>
              Browse our royal selection, customize dishes, and submit your order.
              Orders go directly to our charcoal tandoor and master chefs.
            </p>
            <p className="text-[11px] text-[#917544] pt-1">
              • Multiple order rounds supported at this table <br />
              • Manual bill settlement at your table after dining
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => router.push(`/order/${resolvedParams.tableToken}/menu`)}
              className="w-full py-4 px-6 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-serif text-sm uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Explore Menu & Begin Feast</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/gallery"
              className="text-xs text-[#8A8175] hover:text-[#201E1A] py-1"
            >
              View Restaurant Photography
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
