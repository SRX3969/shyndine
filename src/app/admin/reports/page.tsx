"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, DollarSign, UtensilsCrossed, Award } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";

export default function AdminReportsPage() {
  const { orders, dishes, categories } = useRestaurant();

  const totalSalesPaise = orders.reduce((s, o) => s + o.totalPaise, 0);
  const avgOrderValuePaise = orders.length > 0 ? Math.round(totalSalesPaise / orders.length) : 0;

  // Category revenue split
  const categorySplit = [
    { name: "Royal Kebabs", value: 38, color: "#B39460" },
    { name: "Dum Biryani", value: 26, color: "#917544" },
    { name: "Main Course Curries", value: 22, color: "#CBB07E" },
    { name: "Desserts & Elixirs", value: 14, color: "#201E1A" },
  ];

  const dailyWeeklyData = [
    { day: "Mon", revenue: 84000, orders: 18 },
    { day: "Tue", revenue: 92000, orders: 20 },
    { day: "Wed", revenue: 110000, orders: 24 },
    { day: "Thu", revenue: 125000, orders: 28 },
    { day: "Fri", revenue: 198000, orders: 42 },
    { day: "Sat", revenue: 265000, orders: 58 },
    { day: "Sun", revenue: 240000, orders: 54 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
          Business Intelligence
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
          Sales & Dining Analytics
        </h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-2">
          <span className="text-xs text-[#8A8175] uppercase tracking-wider font-medium">
            Cumulative Revenue
          </span>
          <span className="font-sans font-bold text-2xl sm:text-3xl text-[#201E1A] block">
            {formatPaise(totalSalesPaise)}
          </span>
          <span className="text-xs text-emerald-700 font-medium">
            Active dine-in table orders
          </span>
        </div>

        <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-2">
          <span className="text-xs text-[#8A8175] uppercase tracking-wider font-medium">
            Average Table Spend (ATV)
          </span>
          <span className="font-sans font-bold text-2xl sm:text-3xl text-[#201E1A] block">
            {formatPaise(avgOrderValuePaise)}
          </span>
          <span className="text-xs text-[#8A8175]">
            Average spend per guest party
          </span>
        </div>

        <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-2">
          <span className="text-xs text-[#8A8175] uppercase tracking-wider font-medium">
            Total Orders Logged
          </span>
          <span className="font-sans font-bold text-2xl sm:text-3xl text-[#201E1A] block">
            {orders.length} Feasts
          </span>
          <span className="text-xs text-[#8A8175]">
            Across all restaurant tables
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-8 bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#B39460]/20 pb-3">
            <div>
              <h3 className="font-serif text-lg text-[#201E1A]">
                Weekly Revenue Cadence
              </h3>
              <p className="text-xs text-[#8A8175]">
                Dine-in totals across lunch & dinner services
              </p>
            </div>
            <span className="text-xs text-[#B39460] font-semibold">Weekly View</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyWeeklyData}>
                <XAxis dataKey="day" stroke="#8A8175" fontSize={12} />
                <YAxis
                  stroke="#8A8175"
                  fontSize={12}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#201E1A",
                    borderColor: "#B39460",
                    color: "#FFFEFC",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="revenue" fill="#B39460" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Pie Chart */}
        <div className="lg:col-span-4 bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4">
          <div className="border-b border-[#B39460]/20 pb-3">
            <h3 className="font-serif text-lg text-[#201E1A]">Course Contribution</h3>
            <p className="text-xs text-[#8A8175]">Share of overall sales volume</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySplit}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Contribution"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs pt-2">
            {categorySplit.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name}</span>
                </div>
                <span className="font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
