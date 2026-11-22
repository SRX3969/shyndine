"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Search, ArrowRight, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";

export default function MyOrdersPage() {
  const { orders } = useRestaurant();
  const [phoneSearch, setPhoneSearch] = useState("");

  const matchingOrders = phoneSearch.trim()
    ? orders.filter((o) =>
        o.customerPhone.includes(phoneSearch) ||
        o.orderNumber.toLowerCase().includes(phoneSearch.toLowerCase())
      )
    : orders.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Dine-In Orders
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#201E1A]">
            My Dining Orders
          </h1>
          <p className="text-xs text-[#8A8175]">
            Track existing orders placed at your table or look up historical sessions.
          </p>

          <div className="pt-4 max-w-sm mx-auto relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" />
            <input
              type="text"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder="Search by mobile number or SHYN order #"
              className="w-full pl-9 pr-4 py-2 rounded-full border border-[#B39460]/30 text-xs bg-white text-[#201E1A] focus:outline-none focus:border-[#B39460]"
            />
          </div>
        </div>

        <div className="space-y-4">
          {matchingOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#B39460]/30 p-6">
              <p className="text-xs text-[#8A8175]">No matching orders found.</p>
            </div>
          ) : (
            matchingOrders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFEFC] rounded-2xl p-5 border border-[#B39460]/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-lg text-[#201E1A]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#B39460]/10 text-[#917544]">
                      Table {order.tableNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-[#201E1A]">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8175] mt-1">
                    {order.items.map((i) => `${i.dishName} (×${i.quantity})`).join(", ")}
                  </p>
                  <p className="text-[11px] text-[#8A8175] mt-0.5">
                    {formatDateTime(order.createdAt)} • Guest: {order.customerName}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-[#F7F4EE]">
                  <span className="font-sans font-bold text-base text-[#201E1A]">
                    {formatPaise(order.totalPaise)}
                  </span>
                  <Link
                    href={`/order/track/${order.trackingToken}`}
                    className="py-2 px-4 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
                  >
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
