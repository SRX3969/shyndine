"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Printer,
  Receipt,
  CheckCircle2,
  ChefHat,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  QrCode,
  Flame,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatDateTime, timeAgo } from "@/lib/date";
import { OrderStatus } from "@/types";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getOrderById, updateOrderStatus, generateInvoice } = useRestaurant();

  const order = getOrderById(resolvedParams.id);
  const [note, setNote] = useState("");

  if (!order) {
    return notFound();
  }

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus(order._id, status, note || `Status changed to ${status}`);
    setNote("");
  };

  const handlePrintBill = () => {
    const inv = generateInvoice(order._id);
    router.push(`/admin/billing/${inv._id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8A8175] hover:text-[#201E1A]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Kanban Board</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintBill}
            className="px-4 py-2 rounded-full bg-[#B39460] text-[#201E1A] hover:bg-[#201E1A] hover:text-[#B39460] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Generate & Print Bill</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Order Overview & Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#FFFEFC] p-6 sm:p-8 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B39460]/20 pb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
                  Order Management
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#201E1A]">
                  {order.orderNumber}
                </h1>
                <p className="text-xs text-[#8A8175] mt-0.5">
                  Placed {formatDateTime(order.createdAt)} ({timeAgo(order.createdAt)})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B39460]/15 text-[#917544]">
                  Table {order.tableNumber}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Dishes Table */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg text-[#201E1A]">
                Ordered Dishes & Customizations
              </h3>

              <div className="border border-[#B39460]/20 rounded-xl overflow-hidden divide-y divide-[#F7F4EE]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-serif font-medium text-sm text-[#201E1A]">
                        {item.dishName}
                      </p>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-[10px] text-[#917544] mt-0.5">
                          {item.customizations.map((c) => c.optionName).join(", ")}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-[#8A8175] italic mt-0.5">
                          Special Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[#8A8175] block">
                        {formatPaise(item.pricePaise)} × {item.quantity}
                      </span>
                      <span className="font-sans font-bold text-sm text-[#201E1A]">
                        {formatPaise(item.itemTotalPaise)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#B39460]/20 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-[#8A8175]">
                <span>Items Subtotal</span>
                <span>{formatPaise(order.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-[#8A8175]">
                <span>Taxes (5% GST)</span>
                <span>{formatPaise(order.taxPaise)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#201E1A] pt-2 border-t border-[#B39460]/20">
                <span>Grand Total</span>
                <span className="text-[#B39460] font-bold text-lg">
                  {formatPaise(order.totalPaise)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customer & Status Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Metadata */}
          <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-[#201E1A] border-b border-[#B39460]/20 pb-2">
              Guest Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#B39460]" />
                <span className="font-medium text-[#201E1A]">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B39460]" />
                <span className="text-[#8A8175]">{order.customerPhone}</span>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#B39460]" />
                  <span className="text-[#8A8175]">{order.customerEmail}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#B39460]" />
                <span className="text-[#8A8175]">Table {order.tableNumber}</span>
              </div>
            </div>
          </div>

          {/* Status Updater */}
          <div className="bg-[#201E1A] text-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/30 shadow-md space-y-4">
            <h3 className="font-serif text-lg text-[#B39460]">
              Update Order Status
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(["new", "accepted", "preparing", "ready", "served", "completed"] as OrderStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`p-2 rounded-xl text-xs font-semibold uppercase tracking-wider capitalize transition-all ${
                      order.status === st
                        ? "bg-[#B39460] text-[#201E1A]"
                        : "bg-white/10 text-[#FFFEFC] hover:bg-white/20"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <div className="pt-2">
              <label className="text-[10px] text-[#8A8175] uppercase tracking-wider block mb-1">
                Optional Status Log Note:
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Waiter dispatched to table"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-[#B39460]/30 text-xs text-white focus:outline-none focus:border-[#B39460]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
