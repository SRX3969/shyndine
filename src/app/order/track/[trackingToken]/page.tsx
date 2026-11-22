"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  CheckCircle,
  Bell,
  RefreshCw,
  Flame,
  ChevronLeft,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatTime, timeAgo } from "@/lib/date";
import { OrderStatus } from "@/types";

interface TrackingPageProps {
  params: Promise<{ trackingToken: string }>;
}

const statusSteps: {
  status: OrderStatus;
  label: string;
  desc: string;
  icon: any;
}[] = [
  {
    status: "new",
    label: "Order Placed",
    desc: "Received by central kitchen terminal",
    icon: Bell,
  },
  {
    status: "accepted",
    label: "Acknowledged",
    desc: "Station head assigned cooking queue",
    icon: CheckCircle,
  },
  {
    status: "preparing",
    label: "In Preparation",
    desc: "Skewers in live tandoor and copper handis",
    icon: Flame,
  },
  {
    status: "ready",
    label: "Plating & Garnish",
    desc: "Artisanal plating & silver foil garnish",
    icon: ChefHat,
  },
  {
    status: "served",
    label: "Served at Table",
    desc: "Dish presented to your dining table",
    icon: UtensilsCrossed,
  },
  {
    status: "completed",
    label: "Feast Concluded",
    desc: "Session settled with staff",
    icon: Sparkles,
  },
];

export default function OrderTrackingPage({ params }: TrackingPageProps) {
  const resolvedParams = use(params);
  const { getOrderByTrackingToken } = useRestaurant();

  const [order, setOrder] = useState<any>(null);
  const [assistanceRequested, setAssistanceRequested] = useState(false);

  useEffect(() => {
    const fetched = getOrderByTrackingToken(resolvedParams.trackingToken);
    if (fetched) setOrder(fetched);
  }, [resolvedParams.trackingToken, getOrderByTrackingToken]);

  // Keep fresh with reactive interval
  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = getOrderByTrackingToken(resolvedParams.trackingToken);
      if (fresh) setOrder({ ...fresh });
    }, 2000);
    return () => clearInterval(interval);
  }, [resolvedParams.trackingToken, getOrderByTrackingToken]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#B39460] border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="font-serif text-2xl text-[#201E1A]">
            Locating Order Status...
          </h2>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#B39460] font-semibold">
                Live Status Tracker
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A] mt-1">
              Order {order.orderNumber}
            </h1>
            <p className="text-xs text-[#8A8175] mt-0.5">
              Table <strong>{order.tableNumber}</strong> • Placed {timeAgo(order.createdAt)} ({formatTime(order.createdAt)})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAssistanceRequested(true);
                setTimeout(() => setAssistanceRequested(false), 4000);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                assistanceRequested
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "border-[#B39460] text-[#201E1A] hover:bg-[#B39460]/10"
              }`}
            >
              {assistanceRequested ? "Attendant Notified ✓" : "Call Table Attendant"}
            </button>
            <Link
              href="/menu"
              className="px-4 py-2 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Add More Dishes
            </Link>
          </div>
        </div>

        {/* Real-Time Stepper Visualizer */}
        <div className="bg-[#FFFEFC] p-6 sm:p-10 rounded-3xl border border-[#B39460]/20 shadow-sm space-y-6">
          <h2 className="font-serif text-xl text-[#201E1A]">
            Kitchen Preparation Progress
          </h2>

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {statusSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div
                    key={step.status}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                      isCurrent
                        ? "bg-[#201E1A] text-[#FFFEFC] border-[#B39460] shadow-md scale-102"
                        : isCompleted
                        ? "bg-[#F7F4EE] text-[#201E1A] border-[#B39460]/30"
                        : "bg-white text-gray-400 border-gray-200 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isCurrent
                          ? "bg-[#B39460] text-[#201E1A]"
                          : isCompleted
                          ? "bg-[#B39460]/20 text-[#B39460]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h4
                        className={`font-serif text-sm font-medium ${
                          isCurrent ? "text-[#B39460]" : ""
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[10px] mt-1 text-inherit opacity-80 leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items Breakdown & Live Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Items In This Order */}
          <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-[#201E1A] border-b border-[#B39460]/20 pb-3">
              Dishes in this Order
            </h3>

            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#F7F4EE]"
                >
                  <div>
                    <span className="font-serif font-medium text-[#201E1A]">
                      {item.dishName}
                    </span>
                    <span className="text-[#8A8175] ml-1.5 font-semibold">
                      × {item.quantity}
                    </span>
                    {item.customizations && item.customizations.length > 0 && (
                      <p className="text-[10px] text-[#917544]">
                        {item.customizations.map((c: any) => c.optionName).join(", ")}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-[10px] text-[#8A8175] italic">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-[#201E1A]">
                    {formatPaise(item.itemTotalPaise)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#B39460]/20 flex justify-between text-sm font-semibold">
              <span className="text-[#201E1A]">Order Total (Incl. Taxes)</span>
              <span className="text-[#B39460]">{formatPaise(order.totalPaise)}</span>
            </div>
          </div>

          {/* Event Timeline */}
          <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-[#201E1A] border-b border-[#B39460]/20 pb-3">
              Live Preparation Timeline
            </h3>

            <div className="space-y-4">
              {order.events?.map((evt: any, idx: number) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#B39460] mt-1.5 shrink-0" />
                  <div>
                    <p className="font-medium text-[#201E1A] capitalize">
                      {evt.status === "new"
                        ? "Order Placed & Transmitted"
                        : evt.status === "accepted"
                        ? "Acknowledged by Head Chef"
                        : evt.status === "preparing"
                        ? "Dishes In Preparation"
                        : evt.status === "ready"
                        ? "Plated & Ready to Serve"
                        : evt.status === "served"
                        ? "Served to Dining Table"
                        : "Completed"}
                    </p>
                    {evt.note && (
                      <p className="text-[11px] text-[#8A8175]">{evt.note}</p>
                    )}
                    <span className="text-[10px] text-[#8A8175]">
                      {formatTime(evt.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
