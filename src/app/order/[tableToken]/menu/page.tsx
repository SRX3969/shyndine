"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  Sparkles,
  Plus,
  Check,
  Flame,
  ShoppingBag,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useCart } from "@/hooks/useCart";
import { formatPaise } from "@/lib/currency";
import { Dish } from "@/types";

interface TableMenuPageProps {
  params: Promise<{ tableToken: string }>;
}

export default function TableMenuPage({ params }: TableMenuPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { dishes, categories, getTableByToken } = useRestaurant();
  const { addItem, totalCount, totalPaise, items } = useCart();

  const table = getTableByToken(resolvedParams.tableToken);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (selectedCategory !== "all") {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && dish.categoryId !== cat._id) return false;
      }
      if (dietaryFilter !== "all" && dish.dietary !== dietaryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchDesc = dish.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [dishes, categories, selectedCategory, dietaryFilter, searchQuery]);

  const handleQuickAdd = (dish: Dish, e: React.MouseEvent) => {
    e.preventDefault();
    addItem(dish, 1, []);
    setAddedId(dish._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] pb-24">
      {/* Sticky Top Dine-In Header */}
      <div className="sticky top-0 z-30 bg-[#201E1A] text-[#FFFEFC] px-4 py-3 border-b border-[#B39460]/30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#B39460] text-[#201E1A] flex items-center justify-center font-bold font-serif text-sm">
              {table?.tableNumber || "T"}
            </div>
            <div>
              <span className="font-serif text-sm font-semibold tracking-wider block">
                Table {table?.tableNumber || "Verified"}
              </span>
              <span className="text-[10px] text-[#8A8175] block -mt-0.5">
                {table?.section || "Main Hall"} • Dine-In Ordering
              </span>
            </div>
          </div>

          <Link
            href={`/order/${resolvedParams.tableToken}/checkout`}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B39460] text-[#201E1A] text-xs font-semibold uppercase tracking-wider hover:bg-white transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Feast ({totalCount})</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search & Categories */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8175]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes or ingredients..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#B39460]/30 text-xs bg-white text-[#201E1A] focus:outline-none focus:border-[#B39460]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all ${
                selectedCategory === "all"
                  ? "bg-[#201E1A] text-[#B39460]"
                  : "bg-white text-[#8A8175] border border-[#B39460]/20"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all ${
                  selectedCategory === c.slug
                    ? "bg-[#201E1A] text-[#B39460]"
                    : "bg-white text-[#8A8175] border border-[#B39460]/20"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Dietary Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { label: "All Dietary", val: "all" },
              { label: "🟢 Veg Only", val: "veg" },
              { label: "🔴 Non-Veg", val: "non-veg" },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setDietaryFilter(p.val)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  dietaryFilter === p.val
                    ? "bg-[#B39460] text-[#201E1A]"
                    : "bg-[#FFFEFC] text-[#8A8175] border border-[#B39460]/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map((dish) => {
            const img =
              dish.images?.find((i) => i.isPrimary)?.url ||
              dish.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";

            const isJustAdded = addedId === dish._id;

            return (
              <div
                key={dish._id}
                className="bg-[#FFFEFC] rounded-2xl p-3.5 border border-[#B39460]/20 shadow-xs flex gap-3.5 hover:shadow-md transition-all"
              >
                <Link
                  href={`/menu/${dish.slug}`}
                  className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-[#201E1A]/10 block"
                >
                  <Image
                    src={img}
                    alt={dish.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span
                      className={`block w-2.5 h-2.5 rounded-full ${
                        dish.dietary === "veg"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    />
                  </div>
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#8A8175]">
                      <span>{dish.categoryName}</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-[#B39460]" />
                        {dish.preparationTimeMinutes}m
                      </span>
                    </div>

                    <Link
                      href={`/menu/${dish.slug}`}
                      className="font-serif font-medium text-base text-[#201E1A] hover:text-[#B39460] transition-colors block line-clamp-1"
                    >
                      {dish.name}
                    </Link>

                    <p className="text-[11px] text-[#8A8175] line-clamp-2">
                      {dish.shortDescription || dish.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#F7F4EE]">
                    <span className="font-sans font-semibold text-sm text-[#201E1A]">
                      {formatPaise(dish.pricePaise)}
                    </span>

                    {dish.customizationGroups &&
                    dish.customizationGroups.length > 0 ? (
                      <Link
                        href={`/menu/${dish.slug}`}
                        className="px-3 py-1 rounded-full bg-[#201E1A] text-[#B39460] text-xs font-semibold uppercase tracking-wider"
                      >
                        Options
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => handleQuickAdd(dish, e)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 ${
                          isJustAdded
                            ? "bg-emerald-700 text-white"
                            : "bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A]"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#201E1A]/95 backdrop-blur-md border-t border-[#B39460]/40 p-4 shadow-2xl">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="text-[#FFFEFC]">
              <span className="text-xs text-[#8A8175] block">
                {totalCount} {totalCount === 1 ? "item" : "items"} selected
              </span>
              <span className="font-sans font-bold text-lg text-[#B39460]">
                {formatPaise(totalPaise)}
              </span>
            </div>

            <Link
              href={`/order/${resolvedParams.tableToken}/checkout`}
              className="py-3 px-6 rounded-full bg-[#B39460] text-[#201E1A] hover:bg-white text-xs uppercase tracking-widest font-semibold font-serif transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Review Order & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
