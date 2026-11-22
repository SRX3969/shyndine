"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Clock, Sparkles, Check } from "lucide-react";
import { Dish } from "@/types";
import { formatPaise } from "@/lib/currency";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface FeaturedDishesProps {
  dishes: Dish[];
}

export function FeaturedDishes({ dishes }: FeaturedDishesProps) {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const featured = dishes.filter((d) => d.isFeatured).slice(0, 6);

  const handleQuickAdd = (dish: Dish, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(dish, 1, []);
    setAddedId(dish._id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="py-24 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B39460]" />
            <span>Chef's Masterpieces</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#201E1A]">
            Signature Royal Creations
          </h2>
          <p className="text-sm text-[#8A8175] font-sans">
            Curated icons of Indian royal cuisine, perfected through decades of
            tandoori craftsmanship and slow-braised indulgence.
          </p>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((dish) => {
            const primaryImage =
              dish.images?.find((i) => i.isPrimary)?.url ||
              dish.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";

            const isJustAdded = addedId === dish._id;

            return (
              <div
                key={dish._id}
                className="group bg-[#FFFEFC] rounded-2xl overflow-hidden border border-[#B39460]/25 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <Link
                  href={`/menu/${dish.slug}`}
                  className="relative h-60 w-full overflow-hidden block bg-[#201E1A]/10"
                >
                  <Image
                    src={primaryImage}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dietary badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#201E1A]/85 backdrop-blur-xs border border-[#B39460]/40 text-[10px] text-[#FFFEFC]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dish.dietary === "veg"
                          ? "bg-emerald-500"
                          : dish.dietary === "non-veg"
                          ? "bg-rose-500"
                          : "bg-amber-400"
                      }`}
                    />
                    <span className="uppercase tracking-wider font-semibold">
                      {dish.dietary}
                    </span>
                  </div>

                  {dish.isChefSpecial && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#B39460] text-[#201E1A] text-[10px] uppercase tracking-wider font-bold">
                      Chef's Special
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#B39460] font-sans">
                      {dish.categoryName || "Royal Selection"}
                    </p>
                    <Link
                      href={`/menu/${dish.slug}`}
                      className="font-serif text-xl font-medium text-[#201E1A] hover:text-[#B39460] transition-colors block leading-snug line-clamp-1"
                    >
                      {dish.name}
                    </Link>
                    <p className="text-xs text-[#8A8175] line-clamp-2 leading-relaxed">
                      {dish.shortDescription || dish.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-[#B39460]/20 flex items-center justify-between">
                    <div>
                      <span className="font-sans text-lg font-semibold text-[#201E1A]">
                        {formatPaise(dish.pricePaise)}
                      </span>
                      <span className="text-[11px] text-[#8A8175] block">
                        {dish.portionSize}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(dish, e)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                        isJustAdded
                          ? "bg-emerald-700 text-white"
                          : "bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A]"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Feast</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View full menu CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#B39460] text-[#201E1A] hover:bg-[#201E1A] hover:text-[#B39460] text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
          >
            <span>View Full Categorized Menu</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
