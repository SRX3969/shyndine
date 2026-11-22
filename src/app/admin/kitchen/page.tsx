"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  ExternalLink,
  Volume2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatTime, timeAgo } from "@/lib/date";
import { Order } from "@/types";

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus } = useRestaurant();
  const [filterStation, setFilterStation] = useState<string>("all");

  // Kitchen only cares about new, accepted, preparing, ready orders
  const activeKitchenOrders = orders.filter(
    (o) =>
      o.status === "new" ||
      o.status === "accepted" ||
      o.status === "preparing" ||
      o.status === "ready"
  );

  const handleStartPrep = (orderId: string) => {
    updateOrderStatus(orderId, "preparing", "Kitchen started cooking", "kitchen");
  };

  const handleReadyToServe = (orderId: string) => {
    updateOrderStatus(orderId, "ready", "Plated and hot on dispatch pass", "kitchen");
  };

  const handleMarkServed = (orderId: string) => {
    updateOrderStatus(orderId, "served", "Dish handed to table attendant", "kitchen");
  };

  return (
    <div className="space-y-6">
      {/* KDS Header Banner */}
      <div className="bg-[#201E1A] text-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#B39460] font-semibold">
              Live Kitchen Display System (KDS)
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white mt-1">
            Central Dispatch Pass & Hearth
          </h1>
          <p className="text-xs text-[#8A8175]">
            Optimized for large touch controls and tablet displays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-[#B39460]/40 text-xs text-[#B39460] font-bold">
            {activeKitchenOrders.length} Active Orders
          </div>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-full border border-[#B39460] text-xs text-[#FFFEFC] hover:bg-[#B39460] hover:text-[#201E1A] uppercase tracking-wider font-semibold transition-all"
          >
            Switch to Kanban Board
          </Link>
        </div>
      </div>

      {/* Active Orders Grid */}
      {activeKitchenOrders.length === 0 ? (
        <div className="py-24 text-center bg-[#FFFEFC] rounded-3xl border border-dashed border-[#B39460]/40 p-8 space-y-3">
          <ChefHat className="w-12 h-12 text-[#B39460] mx-auto" />
          <h3 className="font-serif text-2xl text-[#201E1A]">
            Kitchen Queue Clear
          </h3>
          <p className="text-xs text-[#8A8175]">
            All active table dishes have been plated and served.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeKitchenOrders.map((order) => {
            const isNew = order.status === "new" || order.status === "accepted";
            const isPreparing = order.status === "preparing";
            const isReady = order.status === "ready";

            return (
              <div
                key={order._id}
                className={`rounded-3xl p-6 border flex flex-col justify-between transition-all shadow-md ${
                  isNew
                    ? "bg-[#FFFEFC] border-amber-300 ring-2 ring-amber-400/20"
                    : isPreparing
                    ? "bg-[#201E1A] text-[#FFFEFC] border-[#B39460]"
                    : "bg-emerald-50 text-emerald-950 border-emerald-300"
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b pb-3 border-current/20">
                    <div>
                      <span className="font-serif font-bold text-xl block">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs opacity-75">
                        Table {order.tableNumber} • {formatTime(order.createdAt)} ({timeAgo(order.createdAt)})
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isNew
                          ? "bg-amber-100 text-amber-900"
                          : isPreparing
                          ? "bg-[#B39460] text-[#201E1A]"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Dish Checklist */}
                  <div className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-current/15 flex items-start justify-between gap-3 text-sm"
                      >
                        <div>
                          <span className="font-serif font-bold text-base block">
                            {item.quantity} × {item.dishName}
                          </span>
                          {item.customizations && item.customizations.length > 0 && (
                            <p className="text-xs text-[#B39460] font-medium mt-0.5">
                              {item.customizations.map((c) => c.optionName).join(", ")}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-xs italic text-amber-500 mt-0.5">
                              ⚠️ {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                      <strong>Order Note:</strong> {order.specialInstructions}
                    </div>
                  )}
                </div>

                {/* Big Touch Action Controls */}
                <div className="pt-6 border-t border-current/20 mt-4 flex gap-2">
                  {isNew && (
                    <button
                      onClick={() => handleStartPrep(order._id)}
                      className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-sm uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Flame className="w-5 h-5" />
                      <span>Start Preparation</span>
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => handleReadyToServe(order._id)}
                      className="w-full py-4 rounded-2xl bg-[#B39460] hover:bg-white hover:text-[#201E1A] text-[#201E1A] font-serif font-bold text-sm uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ChefHat className="w-5 h-5" />
                      <span>Plated & Ready to Serve</span>
                    </button>
                  )}

                  {isReady && (
                    <button
                      onClick={() => handleMarkServed(order._id)}
                      className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-sm uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Mark Served to Table</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
