"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Printer,
  ChevronLeft,
  Receipt,
  FileText,
  UtensilsCrossed,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";

interface InvoiceDetailPageProps {
  params: Promise<{ invoiceId: string }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const resolvedParams = use(params);
  const { getInvoiceById, restaurant, settleInvoice } = useRestaurant();

  const invoice = getInvoiceById(resolvedParams.invoiceId);
  const [printMode, setPrintMode] = useState<"a4" | "thermal" | "kot">("a4");

  if (!invoice) {
    return notFound();
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFEFC] p-4 rounded-2xl border border-[#B39460]/20 shadow-xs">
        <Link
          href="/admin/billing"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8A8175] hover:text-[#201E1A]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>

        {/* Print Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPrintMode("a4")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              printMode === "a4"
                ? "bg-[#201E1A] text-[#B39460]"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            A4 Tax Invoice
          </button>
          <button
            onClick={() => setPrintMode("thermal")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              printMode === "thermal"
                ? "bg-[#201E1A] text-[#B39460]"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Thermal 80mm
          </button>
          <button
            onClick={() => setPrintMode("kot")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              printMode === "kot"
                ? "bg-[#201E1A] text-[#B39460]"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            KOT Slip
          </button>
        </div>

        <div className="flex items-center gap-2">
          {invoice.status !== "settled" && (
            <button
              onClick={() => settleInvoice(invoice._id, "Settled at counter in cash/card")}
              className="px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold uppercase tracking-wider"
            >
              Mark Settled
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-full bg-[#B39460] text-[#201E1A] hover:bg-[#201E1A] hover:text-[#B39460] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="bg-[#FFFEFC] p-6 sm:p-10 rounded-3xl border border-[#B39460]/30 shadow-md">
        {/* MODE 1: A4 Tax Invoice */}
        {printMode === "a4" && (
          <div className="space-y-8 text-[#201E1A]">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-[#B39460]/30 pb-6">
              <div>
                <span className="font-serif text-3xl sm:text-4xl tracking-[0.2em] font-medium uppercase block text-[#201E1A]">
                  {restaurant.name}
                </span>
                <span className="text-xs text-[#8A8175] block mt-1">
                  {restaurant.tagline}
                </span>
                <p className="text-xs text-[#8A8175] mt-2 max-w-sm">
                  {restaurant.address.street}, {restaurant.address.city},{" "}
                  {restaurant.address.state} - {restaurant.address.postalCode}
                </p>
                <div className="text-[11px] text-[#8A8175] space-y-0.5 mt-1 font-mono">
                  <p>GSTIN: {restaurant.gstNumber}</p>
                  <p>FSSAI: {restaurant.fssaiLicense}</p>
                  <p>Phone: {restaurant.phone}</p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B39460] block">
                  Tax Invoice
                </span>
                <span className="font-mono font-bold text-lg text-[#201E1A] block">
                  {invoice.invoiceNumber}
                </span>
                <p className="text-xs text-[#8A8175]">
                  Date: {formatDateTime(invoice.issuedAt)}
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-[#B39460]/15 text-[#917544] text-xs font-bold uppercase mt-2">
                  Table {invoice.tableNumber} (Dine-In)
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#F7F4EE] p-4 rounded-xl border border-[#B39460]/20">
              <div>
                <span className="text-[#8A8175] block">Billed To (Guest):</span>
                <strong className="text-sm font-serif text-[#201E1A] block">
                  {invoice.customerName}
                </strong>
                <span className="text-[#8A8175]">{invoice.customerPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-[#8A8175] block">Payment Settlement:</span>
                <span className="font-semibold text-emerald-800 block">
                  {invoice.paymentSettlementNote || "Pending Settlement at Table"}
                </span>
                <span className="text-[11px] text-[#8A8175]">
                  Method: Cash / UPI / Card POS (Manual)
                </span>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs">
              <thead className="border-b border-[#201E1A] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2 text-left">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, i) => (
                  <tr key={i} className="py-3">
                    <td className="py-3 text-left">
                      <strong className="text-sm font-serif">{item.dishName}</strong>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-[10px] text-[#917544]">
                          {item.customizations.map((c) => c.optionName).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right text-[#8A8175]">
                      {formatPaise(item.pricePaise)}
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {formatPaise(item.itemTotalPaise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#201E1A] flex justify-end">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-[#8A8175]">
                  <span>Subtotal</span>
                  <span>{formatPaise(invoice.subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-[#8A8175]">
                  <span>CGST (2.5%)</span>
                  <span>{formatPaise(Math.round(invoice.taxPaise / 2))}</span>
                </div>
                <div className="flex justify-between text-[#8A8175]">
                  <span>SGST (2.5%)</span>
                  <span>{formatPaise(Math.round(invoice.taxPaise / 2))}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#201E1A] pt-2 border-t-2 border-[#201E1A]">
                  <span>Grand Total</span>
                  <span className="text-[#B39460]">
                    {formatPaise(invoice.grandTotalPaise)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="pt-6 border-t border-gray-200 text-center text-[11px] text-[#8A8175] space-y-1">
              <p>Thank you for dining at SHYN. We look forward to welcoming you again.</p>
              <p className="font-mono text-[10px]">
                Computer generated invoice • No signature required • Manual payment settled at table
              </p>
            </div>
          </div>
        )}

        {/* MODE 2: Thermal 80mm Receipt Mode */}
        {printMode === "thermal" && (
          <div className="max-w-[320px] mx-auto bg-white p-4 font-mono text-[12px] text-black border border-dashed border-gray-400 space-y-3 leading-tight">
            <div className="text-center space-y-1 pb-2 border-b border-black border-dashed">
              <h2 className="font-bold text-base tracking-widest uppercase">
                {restaurant.name}
              </h2>
              <p className="text-[10px]">{restaurant.tagline}</p>
              <p className="text-[10px]">{restaurant.address.city} - {restaurant.address.postalCode}</p>
              <p className="text-[10px]">GSTIN: {restaurant.gstNumber}</p>
              <p className="text-[10px]">FSSAI: {restaurant.fssaiLicense}</p>
            </div>

            <div className="flex justify-between text-[11px]">
              <span>Table: <strong>{invoice.tableNumber}</strong></span>
              <span>Inv: {invoice.invoiceNumber}</span>
            </div>
            <div className="text-[10px] text-gray-600">
              {formatDateTime(invoice.issuedAt)} | Guest: {invoice.customerName}
            </div>

            <div className="border-t border-b border-black border-dashed py-2 space-y-1.5">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.dishName}
                  </span>
                  <span>{formatPaise(item.itemTotalPaise)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPaise(invoice.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>{formatPaise(invoice.taxPaise)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-black">
                <span>TOTAL:</span>
                <span>{formatPaise(invoice.grandTotalPaise)}</span>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-black border-dashed text-[10px]">
              <p>*** THANK YOU FOR DINING ***</p>
              <p>Settled manually at table/counter</p>
            </div>
          </div>
        )}

        {/* MODE 3: Kitchen Order Ticket (KOT) */}
        {printMode === "kot" && (
          <div className="max-w-[340px] mx-auto bg-white p-5 font-mono text-[13px] text-black border-2 border-black space-y-3">
            <div className="text-center border-b-2 border-black pb-2 space-y-1">
              <h2 className="font-bold text-xl uppercase tracking-wider">
                KITCHEN ORDER TICKET (KOT)
              </h2>
              <p className="text-lg font-bold">TABLE: {invoice.tableNumber}</p>
              <p className="text-[11px]">{formatDateTime(invoice.issuedAt)}</p>
            </div>

            <div className="py-2 space-y-3">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="border-b pb-2">
                  <div className="flex justify-between font-bold text-base">
                    <span>{item.dishName}</span>
                    <span className="text-lg">[{item.quantity}]</span>
                  </div>
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-xs font-semibold text-gray-700">
                      * {item.customizations.map((c) => c.optionName).join(", ")}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-xs italic bg-gray-100 p-1 mt-1 font-bold">
                      INSTRUCTION: {item.specialInstructions}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center pt-2 border-t-2 border-black font-bold text-xs">
              CENTRAL DISPATCH HEARTH PASS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
