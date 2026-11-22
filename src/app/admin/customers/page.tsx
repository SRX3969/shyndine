"use client";

import { useState } from "react";
import { Users, Phone, Mail, Search, Award, Clock } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";

export default function AdminCustomersPage() {
  const { orders } = useRestaurant();
  const [search, setSearch] = useState("");

  // Aggregate customer records from order data
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    email?: string;
    orderCount: number;
    totalSpendPaise: number;
    lastVisited: number;
  }>();

  orders.forEach((o) => {
    const key = o.customerPhone || o.customerName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpendPaise += o.totalPaise;
      if (o.createdAt > existing.lastVisited) {
        existing.lastVisited = o.createdAt;
      }
    } else {
      customerMap.set(key, {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        orderCount: 1,
        totalSpendPaise: o.totalPaise,
        lastVisited: o.createdAt,
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Patron Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
            Guests & Dining Patrons ({customerList.length})
          </h1>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron by name or mobile..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-[#B39460]/30 text-xs bg-white text-[#201E1A] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#FFFEFC] rounded-3xl border border-[#B39460]/20 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#201E1A] text-[#FFFEFC] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-4 px-6">Guest Name</th>
                <th className="py-4 px-4">Contact Details</th>
                <th className="py-4 px-4">Total Orders</th>
                <th className="py-4 px-4">Lifetime Spend</th>
                <th className="py-4 px-6 text-right">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F4EE]">
              {customerList.map((customer, idx) => (
                <tr key={idx} className="hover:bg-[#F7F4EE]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#B39460]/20 text-[#917544] flex items-center justify-center font-serif font-bold text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-serif font-medium text-sm text-[#201E1A]">
                        {customer.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 space-y-0.5">
                    <p className="text-[#201E1A] font-medium">{customer.phone}</p>
                    {customer.email && (
                      <p className="text-[#8A8175] text-[11px]">{customer.email}</p>
                    )}
                  </td>

                  <td className="py-4 px-4 font-bold text-[#201E1A]">
                    {customer.orderCount} {customer.orderCount === 1 ? "round" : "rounds"}
                  </td>

                  <td className="py-4 px-4 font-bold text-[#B39460]">
                    {formatPaise(customer.totalSpendPaise)}
                  </td>

                  <td className="py-4 px-6 text-right text-[#8A8175]">
                    {formatDateTime(customer.lastVisited)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
