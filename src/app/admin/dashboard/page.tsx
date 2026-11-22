"use client";

import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  QrCode,
  Flame,
  ArrowRight,
  Sparkles,
  Receipt,
  ChefHat,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatTime } from "@/lib/date";

export default function AdminDashboardPage() {
  const { orders, tables, dishes } = useRestaurant();

  // Metrics
  const totalOrdersCount = orders.length;
  const totalRevenuePaise = orders.reduce((sum, o) => sum + o.totalPaise, 0);

  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const completedCount = orders.filter((o) => o.status === "completed" || o.status === "served").length;

  const occupiedTables = tables.filter((t) => t.isOccupied).length;
  const totalTables = tables.length;

  // Chart data for service hours
  const hourlySalesData = [
    { time: "12 PM", sales: 12400, orders: 4 },
    { time: "1 PM", sales: 28500, orders: 9 },
    { time: "2 PM", sales: 34200, orders: 11 },
    { time: "3 PM", sales: 18100, orders: 5 },
    { time: "7 PM", sales: 42000, orders: 14 },
    { time: "8 PM", sales: 68500, orders: 21 },
    { time: "9 PM", sales: 79000, orders: 24 },
    { time: "10 PM", sales: 45000, orders: 13 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Overview & Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
            Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Open Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/kitchen"
            className="px-4 py-2 rounded-full bg-[#B39460] text-[#201E1A] hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>KDS Terminal</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#FFFEFC] border border-[#B39460]/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8A8175]">
            <span className="text-xs font-medium uppercase tracking-wider">Total Revenue</span>
            <Receipt className="w-4 h-4 text-[#B39460]" />
          </div>
          <span className="font-sans font-bold text-xl sm:text-2xl text-[#201E1A] block">
            {formatPaise(totalRevenuePaise)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            ↑ 18.4% from yesterday
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFEFC] border border-[#B39460]/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8A8175]">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#B39460]" />
          </div>
          <span className="font-sans font-bold text-xl sm:text-2xl text-[#201E1A] block">
            {totalOrdersCount}
          </span>
          <span className="text-[11px] text-[#8A8175]">
            {completedCount} concluded feasts
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFEFC] border border-[#B39460]/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8A8175]">
            <span className="text-xs font-medium uppercase tracking-wider">Kitchen Queue</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-sans font-bold text-xl sm:text-2xl text-[#201E1A] block">
            {newOrdersCount + preparingCount} active
          </span>
          <span className="text-[11px] text-amber-700 font-medium">
            {newOrdersCount} new • {preparingCount} in prep
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFEFC] border border-[#B39460]/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8A8175]">
            <span className="text-xs font-medium uppercase tracking-wider">Table Occupancy</span>
            <QrCode className="w-4 h-4 text-[#B39460]" />
          </div>
          <span className="font-sans font-bold text-xl sm:text-2xl text-[#201E1A] block">
            {occupiedTables} / {totalTables}
          </span>
          <span className="text-[11px] text-[#8A8175]">
            {Math.round((occupiedTables / totalTables) * 100)}% tables seated
          </span>
        </div>
      </div>

      {/* Analytics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hourly Sales Trend */}
        <div className="lg:col-span-8 bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#B39460]/20 pb-3">
            <div>
              <h3 className="font-serif text-lg text-[#201E1A]">
                Service Volume & Sales Distribution
              </h3>
              <p className="text-xs text-[#8A8175]">
                Hourly dine-in revenue across Lunch & Royal Dinner services
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B39460]/15 text-[#917544]">
              Today
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlySalesData}>
                <XAxis dataKey="time" stroke="#8A8175" fontSize={11} />
                <YAxis
                  stroke="#8A8175"
                  fontSize={11}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#201E1A",
                    borderColor: "#B39460",
                    color: "#FFFEFC",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="sales" fill="#B39460" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Active Orders Feed */}
        <div className="lg:col-span-4 bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#B39460]/20 pb-3">
              <h3 className="font-serif text-lg text-[#201E1A]">Live Orders</h3>
              <Link
                href="/admin/orders"
                className="text-xs text-[#B39460] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {orders.slice(0, 4).map((order) => (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order._id}`}
                  className="block p-3 rounded-xl border border-[#B39460]/15 hover:border-[#B39460] transition-colors bg-[#F7F4EE]/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-sm text-[#201E1A]">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        order.status === "new"
                          ? "bg-amber-100 text-amber-800"
                          : order.status === "preparing"
                          ? "bg-rose-100 text-rose-800"
                          : order.status === "ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#8A8175] mt-1">
                    <span>
                      Table {order.tableNumber} • {order.items.length} items
                    </span>
                    <span className="font-semibold text-[#201E1A]">
                      {formatPaise(order.totalPaise)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#B39460]/20">
            <Link
              href="/admin/kitchen"
              className="w-full py-2.5 px-4 rounded-xl bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold uppercase tracking-wider text-center block transition-all"
            >
              Open Kitchen Display Screen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
