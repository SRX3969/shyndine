"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  ChefHat,
  UtensilsCrossed,
  Layers,
  QrCode,
  Receipt,
  BarChart3,
  Users,
  Settings,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";

export function AdminSidebar() {
  const pathname = usePathname();
  const { orders } = useRestaurant();

  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;

  const links = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      label: "Live Kanban Board",
      href: "/admin/orders",
      icon: KanbanSquare,
      badge: newOrdersCount > 0 ? `${newOrdersCount} New` : undefined,
      badgeColor: "bg-amber-500 text-black",
    },
    {
      label: "Kitchen Display (KDS)",
      href: "/admin/kitchen",
      icon: ChefHat,
      badge: preparingCount > 0 ? `${preparingCount} Prep` : undefined,
      badgeColor: "bg-rose-500 text-white",
    },
    { label: "Dishes & Menu", href: "/admin/menu/dishes", icon: UtensilsCrossed },
    { label: "Food Categories", href: "/admin/menu/categories", icon: Layers },
    { label: "Tables & QR Stands", href: "/admin/tables", icon: QrCode },
    { label: "Invoices & Billing", href: "/admin/billing", icon: Receipt },
    { label: "Sales & Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Guests & Customers", href: "/admin/customers", icon: Users },
    { label: "Restaurant Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin" || pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#201E1A] text-[#FFFEFC] flex flex-col border-r border-[#B39460]/20 shrink-0 h-screen sticky top-0">
      {/* Brand & Badge */}
      <div className="p-6 border-b border-[#B39460]/20 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#B39460] text-[#201E1A] flex items-center justify-center font-serif font-bold text-base shadow-sm">
            S
          </div>
          <div>
            <span className="font-serif text-lg tracking-[0.2em] font-medium text-[#FFFEFC] uppercase block leading-none">
              SHYN
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#B39460] block mt-1">
              Command Center
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                active
                  ? "bg-[#B39460] text-[#201E1A] shadow-sm font-semibold"
                  : "text-[#8A8175] hover:text-[#FFFEFC] hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? "text-[#201E1A]" : "text-[#B39460]"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Public Site Link & Attendant Info */}
      <div className="p-4 border-t border-[#B39460]/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#8A8175] hover:text-[#B39460] hover:bg-white/5 transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </span>
          <span className="text-[10px]">Open ↗</span>
        </Link>

        <div className="p-2.5 rounded-lg bg-black/40 border border-[#B39460]/20 text-[11px] text-[#8A8175] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#B39460]" />
          <div>
            <p className="text-[#FFFEFC] font-medium leading-none">Admin Console</p>
            <p className="text-[10px] text-[#8A8175] mt-0.5">Real-time sync enabled</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
