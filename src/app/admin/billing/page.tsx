"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt, Printer, Eye, CheckCircle2, Clock, Search } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";

export default function AdminBillingPage() {
  const { invoices, orders, generateInvoice, settleInvoice } = useRestaurant();
  const [search, setSearch] = useState("");

  const handleGenerateFromOrder = (orderId: string) => {
    generateInvoice(orderId);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.tableNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Manual Billing & Settlement
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
            Invoices & Guest Receipts ({invoices.length})
          </h1>
        </div>
      </div>

      {/* Orders Ready for Invoicing */}
      <div className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4">
        <h3 className="font-serif text-lg text-[#201E1A]">
          Recent Orders Ready for Bill Generation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {orders.slice(0, 3).map((order) => {
            const hasInvoice = invoices.some((i) => i.orderId === order._id);

            return (
              <div
                key={order._id}
                className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#B39460]/20 flex items-center justify-between"
              >
                <div>
                  <span className="font-serif font-bold text-sm text-[#201E1A] block">
                    {order.orderNumber} (Table {order.tableNumber})
                  </span>
                  <span className="text-xs text-[#8A8175]">
                    {order.customerName} • {formatPaise(order.totalPaise)}
                  </span>
                </div>

                {hasInvoice ? (
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">
                    Billed ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleGenerateFromOrder(order._id)}
                    className="px-3 py-1.5 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-[10px] font-semibold uppercase tracking-wider transition-all"
                  >
                    Generate Bill
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-[#FFFEFC] rounded-3xl border border-[#B39460]/20 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#201E1A] text-[#FFFEFC] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-4 px-6">Invoice #</th>
                <th className="py-4 px-4">Table</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Issued At</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F4EE]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8A8175]">
                    No invoices generated yet. Click &ldquo;Generate Bill&rdquo; on any order above.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-[#F7F4EE]/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#201E1A]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#917544]">
                      Table {inv.tableNumber}
                    </td>
                    <td className="py-4 px-4 text-[#201E1A]">
                      {inv.customerName}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#201E1A]">
                      {formatPaise(inv.grandTotalPaise)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === "settled"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#8A8175]">
                      {formatDateTime(inv.issuedAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status !== "settled" && (
                          <button
                            onClick={() => settleInvoice(inv._id, "Settled in Cash / Card POS")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] uppercase font-semibold"
                          >
                            Mark Settled
                          </button>
                        )}
                        <Link
                          href={`/admin/billing/${inv._id}`}
                          className="p-1.5 rounded-lg border border-[#B39460] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] transition-all"
                          title="Print Invoice / Thermal / KOT"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
