"use client";

import { useCart } from "@/hooks/useCart";
import { formatPaise } from "@/lib/currency";
import {
  X,
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    totalCount,
    subtotalPaise,
    taxPaise,
    totalPaise,
    updateQuantity,
    removeItem,
    clearCart,
    activeTable,
  } = useCart();

  if (!isOpen) return null;

  const checkoutUrl = activeTable
    ? `/order/${activeTable.qrToken}/checkout`
    : "/order/tbl_royal_01/checkout";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F4EE] shadow-2xl flex flex-col border-l border-[#B39460]/30 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#B39460]/20 flex items-center justify-between bg-[#201E1A] text-[#FFFEFC]">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#B39460]" />
              <h2 className="font-serif text-xl tracking-wider uppercase">
                Your Table Feast
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#8A8175] hover:text-[#FFFEFC] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Table Banner */}
          {activeTable && (
            <div className="px-5 py-2.5 bg-[#B39460]/15 border-b border-[#B39460]/30 flex items-center justify-between text-xs">
              <span className="font-medium text-[#201E1A]">
                Ordering for Table: <strong className="text-[#917544]">{activeTable.tableNumber}</strong> ({activeTable.section})
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#8A8175] bg-white px-2 py-0.5 rounded-full border border-[#B39460]/30">
                Dine-In
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8A8175]">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#B39460] flex items-center justify-center mb-4">
                  <UtensilsCrossed className="w-8 h-8 text-[#B39460]/60" />
                </div>
                <p className="font-serif text-lg text-[#201E1A]">Your feast is empty</p>
                <p className="text-xs mt-1 max-w-xs">
                  Select from our signature royal tandoor, Dum Pukht biryanis, or curries.
                </p>
                <Link
                  href="/menu"
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] text-xs font-semibold tracking-widest uppercase hover:bg-[#B39460] hover:text-[#201E1A] transition-all"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const primaryImage =
                  item.dish.images?.find((img) => img.isPrimary)?.url ||
                  item.dish.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80";

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-[#FFFEFC] rounded-lg border border-[#B39460]/20 shadow-xs"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-[#201E1A]/5">
                      <Image
                        src={primaryImage}
                        alt={item.dish.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-medium text-sm text-[#201E1A] truncate">
                          {item.dish.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#8A8175] hover:text-red-700 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customizations tags */}
                      {item.customizations.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.customizations.map((c) => (
                            <span
                              key={c.optionId}
                              className="text-[10px] bg-[#B39460]/10 text-[#917544] px-1.5 py-0.2 rounded"
                            >
                              {c.optionName} {c.pricePaise > 0 && `(+${formatPaise(c.pricePaise)})`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special instructions */}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-[#8A8175] italic mt-0.5">
                          Note: {item.specialInstructions}
                        </p>
                      )}

                      {/* Quantity & Unit Total */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F7F4EE]">
                        <div className="flex items-center border border-[#B39460]/30 rounded-md overflow-hidden bg-[#F7F4EE]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-[#B39460]/20 text-[#201E1A]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#201E1A]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-[#B39460]/20 text-[#201E1A]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-[#201E1A]">
                          {formatPaise(item.unitPricePaise * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Total */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#B39460]/30 bg-[#FFFEFC] space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#8A8175]">
                  <span>Subtotal</span>
                  <span>{formatPaise(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-[#8A8175]">
                  <span>Taxes (5% GST)</span>
                  <span>{formatPaise(taxPaise)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#201E1A] pt-2 border-t border-[#B39460]/20">
                  <span>Grand Total</span>
                  <span className="text-[#B39460] font-bold text-base">
                    {formatPaise(totalPaise)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-2.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs transition-colors"
                  title="Clear all items"
                >
                  Clear
                </button>
                <Link
                  href={checkoutUrl}
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-medium text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-sm font-serif"
                >
                  <span>Review & Send to Kitchen</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-[#8A8175]">
                Manual billing: settled at your table after dining.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
