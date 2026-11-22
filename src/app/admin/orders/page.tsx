"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Clock,
  Sparkles,
  ArrowRight,
  Printer,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Eye,
  Flame,
  Volume2,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatTime, timeAgo } from "@/lib/date";
import { Order, OrderStatus } from "@/types";

const kanbanColumns: {
  status: OrderStatus;
  title: string;
  color: string;
  border: string;
}[] = [
  {
    status: "new",
    title: "New Orders",
    color: "bg-amber-50 text-amber-900",
    border: "border-amber-300",
  },
  {
    status: "accepted",
    title: "Accepted",
    color: "bg-blue-50 text-blue-900",
    border: "border-blue-300",
  },
  {
    status: "preparing",
    title: "In Preparation",
    color: "bg-orange-50 text-orange-900",
    border: "border-orange-300",
  },
  {
    status: "ready",
    title: "Ready to Serve",
    color: "bg-emerald-50 text-emerald-900",
    border: "border-emerald-300",
  },
  {
    status: "served",
    title: "Served at Table",
    color: "bg-purple-50 text-purple-900",
    border: "border-purple-300",
  },
  {
    status: "completed",
    title: "Completed",
    color: "bg-gray-100 text-gray-800",
    border: "border-gray-300",
  },
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, generateInvoice } = useRestaurant();
  const [filterTable, setFilterTable] = useState<string>("all");

  const filteredOrders =
    filterTable === "all"
      ? orders
      : orders.filter((o) => o.tableNumber === filterTable);

  const handleAdvanceStatus = (order: Order) => {
    const transitions: Record<OrderStatus, OrderStatus> = {
      new: "accepted",
      accepted: "preparing",
      preparing: "ready",
      ready: "served",
      served: "completed",
      completed: "completed",
      cancelled: "cancelled",
    };
    const nextStatus = transitions[order.status];
    if (nextStatus && nextStatus !== order.status) {
      updateOrderStatus(order._id, nextStatus, `Updated via Kanban Board`);
    }
  };

  const uniqueTables = Array.from(new Set(orders.map((o) => o.tableNumber)));

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Banner & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Live Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
            Real-Time Kanban Order Board
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter by table */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A8175]">Table Filter:</span>
            <select
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="text-xs bg-white border border-[#B39460]/30 rounded-lg px-3 py-1.5 text-[#201E1A] focus:outline-none"
            >
              <option value="all">All Tables</option>
              {uniqueTables.map((t) => (
                <option key={t} value={t}>
                  Table {t}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/admin/kitchen"
            className="px-4 py-2 rounded-full bg-[#B39460] text-[#201E1A] text-xs font-semibold uppercase tracking-wider hover:bg-[#201E1A] hover:text-[#B39460] transition-all flex items-center gap-1.5"
          >
            <ChefHat className="w-4 h-4" />
            <span>KDS Mode</span>
          </Link>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {kanbanColumns.map((col) => {
          const columnOrders = filteredOrders.filter(
            (o) => o.status === col.status
          );

          return (
            <div
              key={col.status}
              className="w-80 shrink-0 bg-[#FFFEFC] rounded-2xl border border-[#B39460]/20 flex flex-col max-h-[calc(100vh-220px)] shadow-xs"
            >
              {/* Column Header */}
              <div
                className={`p-3.5 border-b flex items-center justify-between rounded-t-2xl ${col.color} ${col.border}`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-semibold text-sm">
                    {col.title}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {columnOrders.length}
                  </span>
                </div>
              </div>

              {/* Order Cards Container */}
              <div className="p-3 overflow-y-auto space-y-3 flex-1 scrollbar-none">
                {columnOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8A8175] italic">
                    No orders in this stage
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-xl bg-white border border-[#B39460]/20 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="font-serif font-bold text-sm text-[#201E1A] hover:text-[#B39460] transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B39460]/15 text-[#917544]">
                          Table {order.tableNumber}
                        </span>
                      </div>

                      {/* Guest & time */}
                      <div className="text-[11px] text-[#8A8175] flex items-center justify-between">
                        <span className="font-medium text-[#201E1A] truncate max-w-[140px]">
                          {order.customerName}
                        </span>
                        <span>{timeAgo(order.createdAt)}</span>
                      </div>

                      {/* Items snapshot */}
                      <div className="space-y-1 bg-[#F7F4EE]/60 p-2.5 rounded-lg text-xs">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-[#201E1A]"
                          >
                            <span className="truncate pr-1">
                              <strong>{item.quantity}×</strong> {item.dishName}
                            </span>
                            <span className="text-[#8A8175] shrink-0">
                              {formatPaise(item.itemTotalPaise)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Special instructions if any */}
                      {order.specialInstructions && (
                        <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 italic">
                          &ldquo;{order.specialInstructions}&rdquo;
                        </p>
                      )}

                      {/* Card Actions */}
                      <div className="pt-2 border-t border-[#F7F4EE] flex items-center justify-between gap-2">
                        <span className="font-sans font-bold text-xs text-[#201E1A]">
                          {formatPaise(order.totalPaise)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="p-1.5 rounded-lg border border-gray-200 text-[#8A8175] hover:text-[#201E1A]"
                            title="Inspect order details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {order.status !== "completed" && (
                            <button
                              onClick={() => handleAdvanceStatus(order)}
                              className="px-2.5 py-1 rounded-lg bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1"
                            >
                              <span>Advance</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
