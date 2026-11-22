"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import {
  UtensilsCrossed,
  ShieldCheck,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Send,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useCart } from "@/hooks/useCart";
import { formatPaise } from "@/lib/currency";
import { checkoutSchema, CheckoutFormData } from "@/lib/validations";
import { OrderItemSnapshot } from "@/types";

interface CheckoutPageProps {
  params: Promise<{ tableToken: string }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getTableByToken, createOrder } = useRestaurant();
  const {
    items,
    totalCount,
    subtotalPaise,
    taxPaise,
    totalPaise,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const table = getTableByToken(resolvedParams.tableToken);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      specialInstructions: "",
    },
  });

  const onSubmit = async (formData: CheckoutFormData) => {
    if (items.length === 0) {
      setErrorMessage("Please select at least one dish for your order.");
      return;
    }

    if (!table) {
      setErrorMessage("Table session unverified. Please re-scan table QR.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Create immutable snapshots of order items
      const orderItems: OrderItemSnapshot[] = items.map((item) => ({
        id: item.id,
        dishId: item.dish._id,
        dishName: item.dish.name,
        pricePaise: item.dish.pricePaise,
        quantity: item.quantity,
        dietary: item.dish.dietary,
        customizations: item.customizations,
        specialInstructions: item.specialInstructions,
        itemTotalPaise: item.unitPricePaise * item.quantity,
      }));

      // Atomically create order
      const newOrder = createOrder({
        table,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        specialInstructions: formData.specialInstructions,
        items: orderItems,
      });

      // Festive confetti trigger
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#B39460", "#201E1A", "#CBB07E"],
        });
      } catch {
        // Ignore in non-browser
      }

      // Clear shopping cart on successful confirmation
      clearCart();

      // Navigate to customer tracking
      router.push(`/order/confirmation/${newOrder.trackingToken}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit order. Please retry.");
      setIsSubmitting(false);
    }
  };

  if (!table) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="font-serif text-2xl text-[#201E1A]">Table Unidentified</h2>
          <p className="text-xs text-[#8A8175]">
            Please scan the QR code located on your table stand to continue.
          </p>
          <Link
            href="/order/tbl_royal_01"
            className="inline-block mt-4 px-6 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] text-xs font-semibold"
          >
            Use Sample Table T-01
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/order/${resolvedParams.tableToken}/menu`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8A8175] hover:text-[#201E1A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Add More Dishes</span>
          </Link>

          <div className="px-3 py-1 rounded-full bg-[#B39460]/10 border border-[#B39460]/30 text-xs font-medium text-[#201E1A]">
            Table {table.tableNumber} • {table.section}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer Information & Billing Instructions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FFFEFC] p-6 sm:p-8 rounded-3xl border border-[#B39460]/20 shadow-sm space-y-6">
              <div className="border-b border-[#B39460]/20 pb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#917544] font-semibold">
                  Step 2 of 2
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#201E1A]">
                  Dine-In Customer Details
                </h1>
                <p className="text-xs text-[#8A8175] mt-1">
                  Required for your table's consolidated bill and live kitchen dispatch.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                      Full Name *
                    </label>
                    <input
                      {...register("fullName")}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      {...register("phone")}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    {...register("email")}
                    placeholder="For digital invoice copy"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                    Special Table Instructions (Optional)
                  </label>
                  <textarea
                    {...register("specialInstructions")}
                    rows={2}
                    placeholder="Serving order preference, extra ice, celebration note..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
                  />
                </div>
              </form>

              {/* Payment Clarification Notice */}
              <div className="p-4 rounded-2xl bg-[#201E1A] text-[#FFFEFC] space-y-2 border border-[#B39460]/40">
                <div className="flex items-center gap-2 text-[#B39460] font-serif text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Manual Payment Notice</span>
                </div>
                <p className="text-xs text-[#8A8175] leading-relaxed">
                  No online payment is collected online. Your order is sent directly to
                  the kitchen. When your meal concludes, your attendant will present
                  your printed bill for settlement via Cash, Card, or UPI POS machine.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items Summary & Final Submission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFEFC] p-6 sm:p-8 rounded-3xl border border-[#B39460]/20 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#B39460]/20 pb-3">
                <h3 className="font-serif text-xl text-[#201E1A]">
                  Order Summary ({totalCount} items)
                </h3>
                <span className="text-xs text-[#8A8175]">
                  Table {table.tableNumber}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-xs text-[#8A8175] text-center py-6">
                    No dishes selected. Please add dishes from the menu.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 text-xs py-2 border-b border-[#F7F4EE]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-medium text-[#201E1A] truncate">
                          {item.dish.name}
                        </p>
                        {item.customizations.length > 0 && (
                          <p className="text-[10px] text-[#917544]">
                            {item.customizations.map((c) => c.optionName).join(", ")}
                          </p>
                        )}
                        <span className="text-[#8A8175]">
                          {formatPaise(item.unitPricePaise)} × {item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#B39460]/30 rounded-md bg-[#F7F4EE]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-[#B39460]/20 text-[#201E1A]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-[#B39460]/20 text-[#201E1A]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-[#201E1A] w-16 text-right">
                          {formatPaise(item.unitPricePaise * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-3 border-t border-[#B39460]/20 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8A8175]">
                  <span>Items Subtotal</span>
                  <span>{formatPaise(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-[#8A8175]">
                  <span>GST (5%)</span>
                  <span>{formatPaise(taxPaise)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#201E1A] pt-2 border-t border-[#B39460]/20">
                  <span>Grand Total</span>
                  <span className="text-[#B39460] font-bold text-lg">
                    {formatPaise(totalPaise)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 px-6 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-serif text-sm uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#B39460] border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Order to Kitchen • {formatPaise(totalPaise)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
