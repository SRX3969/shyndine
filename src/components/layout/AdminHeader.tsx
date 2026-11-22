"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Volume2,
  VolumeX,
  Search,
  Plus,
  UtensilsCrossed,
  ChefHat,
  Menu,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { orders } = useRestaurant();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const pendingOrders = orders.filter(
    (o) => o.status === "new" || o.status === "accepted"
  );

  return (
    <header className="h-16 bg-[#FFFEFC] border-b border-[#B39460]/20 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-[#201E1A] hover:bg-[#F7F4EE] rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-[#201E1A] uppercase tracking-wider">
            Restaurant Live System
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Audio notification toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-full border transition-colors ${
            soundEnabled
              ? "border-[#B39460]/40 text-[#917544] hover:bg-[#B39460]/10"
              : "border-gray-200 text-gray-400 hover:bg-gray-50"
          }`}
          title={soundEnabled ? "Order sound alerts active" : "Order sound alerts muted"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Quick KDS link */}
        <Link
          href="/admin/kitchen"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-medium transition-all"
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>KDS Screen</span>
        </Link>

        {/* Quick add dish link */}
        <Link
          href="/admin/menu/dishes/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#B39460] text-[#201E1A] hover:bg-[#B39460]/10 text-xs font-medium transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-[#B39460]" />
          <span>New Dish</span>
        </Link>

        {/* Incoming Orders Bell Indicator */}
        <Link
          href="/admin/orders"
          className="relative p-2 rounded-full bg-[#F7F4EE] text-[#201E1A] hover:bg-[#B39460]/20 transition-colors"
          title={`${pendingOrders.length} active orders pending`}
        >
          <Bell className="w-4 h-4 text-[#B39460]" />
          {pendingOrders.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingOrders.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
