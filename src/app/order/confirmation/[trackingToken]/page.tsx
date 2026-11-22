"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Sparkles, ArrowRight, UtensilsCrossed, FileText } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";

interface ConfirmationPageProps {
  params: Promise<{ trackingToken: string }>;
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const resolvedParams = use(params);
  const { getOrderByTrackingToken } = useRestaurant();

  const order = getOrderByTrackingToken(resolvedParams.trackingToken);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <p className="font-serif text-2xl text-[#201E1A]">Retrieving order...</p>
          <Link
            href="/menu"
            className="inline-block px-6 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] text-xs font-semibold"
          >
            Return to Menu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
        <div className="bg-[#FFFEFC] rounded-3xl p-8 sm:p-12 border border-[#B39460]/30 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#917544] font-semibold">
              Live Kitchen Dispatch Active
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#201E1A]">
              Feast Order Confirmed
            </h1>
            <p className="text-xs text-[#8A8175]">
              Order <strong className="text-[#201E1A]">{order.orderNumber}</strong> has been transmitted directly to our kitchen staff.
            </p>
          </div>

          {/* Table & Order Details Badge */}
          <div className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#B39460]/20 text-xs text-left grid grid-cols-2 gap-4">
            <div>
              <span className="text-[#8A8175] block">Table Assigned:</span>
              <span className="font-serif font-bold text-base text-[#201E1A]">
                Table {order.tableNumber}
              </span>
            </div>
            <div>
              <span className="text-[#8A8175] block">Customer Name:</span>
              <span className="font-medium text-[#201E1A] truncate block">
                {order.customerName}
              </span>
            </div>
            <div>
              <span className="text-[#8A8175] block">Ordered Items:</span>
              <span className="font-medium text-[#201E1A]">
                {order.items.reduce((s, i) => s + i.quantity, 0)} items ({formatPaise(order.totalPaise)})
              </span>
            </div>
            <div>
              <span className="text-[#8A8175] block">Order Timestamp:</span>
              <span className="font-medium text-[#201E1A]">
                {formatDateTime(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/order/track/${order.trackingToken}`}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-serif text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Track Live Preparation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/menu"
              className="py-3.5 px-6 rounded-full border border-[#B39460] text-[#201E1A] hover:bg-[#B39460]/10 text-xs uppercase tracking-widest font-medium transition-all"
            >
              Order More Items
            </Link>
          </div>

          <p className="text-[11px] text-[#8A8175] pt-2">
            Settlement reminder: Cash, UPI, or Card POS payment will be handled manually at your table.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
