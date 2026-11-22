"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  UtensilsCrossed,
  Sparkles,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPaise } from "@/lib/currency";
import { CartDrawer } from "@/components/ordering/CartDrawer";

export function Navbar() {
  const pathname = usePathname();
  const { totalCount, totalPaise, activeTable } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Royal Menu", href: "/menu" },
    { label: "Heritage", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F7F4EE]/90 backdrop-blur-md border-b border-[#B39460]/20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#B39460] flex items-center justify-center bg-[#201E1A] text-[#B39460] shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif font-bold text-lg tracking-wider">S</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-[0.25em] text-[#201E1A] uppercase block leading-none">
                SHYN
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8A8175] block mt-1 font-sans">
                The Royal Dining Room
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-widest font-medium transition-colors hover:text-[#B39460] ${
                  isActive(link.href)
                    ? "text-[#B39460] border-b border-[#B39460] pb-1"
                    : "text-[#201E1A]/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Table Badge, Cart, Admin button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Active Table indicator if scanned */}
            {activeTable ? (
              <Link
                href={`/order/${activeTable.qrToken}/menu`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B39460]/10 border border-[#B39460]/40 text-xs text-[#201E1A] font-medium"
              >
                <QrCode className="w-3.5 h-3.5 text-[#B39460]" />
                <span>Table {activeTable.tableNumber}</span>
              </Link>
            ) : (
              <Link
                href="/order/tbl_royal_01"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B39460]/30 hover:border-[#B39460] text-xs text-[#8A8175] hover:text-[#201E1A] transition-all"
                title="Dine-in simulation"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#B39460]" />
                <span>Dine-In Mode</span>
              </Link>
            )}

            {/* Shopping Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#201E1A] text-[#F7F4EE] hover:bg-[#B39460] transition-colors flex items-center gap-2 group shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#B39460] group-hover:text-white transition-colors" />
              {totalCount > 0 && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-[#B39460] text-[#201E1A] group-hover:bg-[#201E1A] group-hover:text-[#F7F4EE]">
                  {totalCount}
                </span>
              )}
              {totalCount > 0 && (
                <span className="hidden xl:inline text-xs font-medium pr-1 text-[#F7F4EE]">
                  {formatPaise(totalPaise)}
                </span>
              )}
            </button>

            {/* Staff / Admin link */}
            <Link
              href="/admin"
              className="p-2 rounded-full border border-[#B39460]/30 text-[#8A8175] hover:text-[#201E1A] hover:border-[#B39460] transition-colors"
              title="Staff & Management Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#201E1A] hover:bg-[#B39460]/10"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-[#B39460]/20 bg-[#F7F4EE] px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-serif tracking-wider ${
                  isActive(link.href)
                    ? "text-[#B39460] font-semibold bg-[#B39460]/10 rounded-md"
                    : "text-[#201E1A]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#B39460]/20 flex flex-col gap-2">
              <Link
                href="/order/tbl_royal_01"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-[#201E1A] text-[#B39460] text-sm font-medium"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Dine-In Table Ordering
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-[#B39460] text-xs text-[#201E1A]"
              >
                <ShieldCheck className="w-4 h-4 text-[#B39460]" />
                Staff Administration
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
