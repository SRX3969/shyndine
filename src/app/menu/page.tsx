"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Clock,
  Sparkles,
  Plus,
  Check,
  Flame,
  Award,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useCart } from "@/hooks/useCart";
import { formatPaise } from "@/lib/currency";
import { Dish, DietaryClassification } from "@/types";

function MenuContent() {
  const { dishes, categories } = useRestaurant();
  const { addItem, activeTable } = useCart();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );
  const [addedId, setAddedId] = useState<string | null>(null);

  // Filter & sort dishes
  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => {
        // Category filter
        if (selectedCategory !== "all") {
          const cat = categories.find((c) => c.slug === selectedCategory);
          if (cat && dish.categoryId !== cat._id) return false;
        }

        // Dietary filter
        if (dietaryFilter !== "all" && dish.dietary !== dietaryFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = dish.name.toLowerCase().includes(query);
          const matchDesc = dish.description.toLowerCase().includes(query);
          const matchIng = dish.ingredients.some((ing) =>
            ing.toLowerCase().includes(query)
          );
          if (!matchName && !matchDesc && !matchIng) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.pricePaise - b.pricePaise;
        if (sortBy === "price-desc") return b.pricePaise - a.pricePaise;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.displayOrder - b.displayOrder;
      });
  }, [dishes, categories, selectedCategory, dietaryFilter, searchQuery, sortBy]);

  const handleQuickAdd = (dish: Dish, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(dish, 1, []);
    setAddedId(dish._id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B39460]" />
            <span>The Culinary Anthology</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#201E1A]">
            The Royal Menu
          </h1>
          <p className="text-sm text-[#8A8175] font-sans">
            Every dish is prepared upon order using charcoal clay tandoors,
            traditional copper handis, and artisanal ingredients.
          </p>

          {activeTable && (
            <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-[#B39460]/15 border border-[#B39460]/40 text-xs text-[#201E1A] font-medium">
              Ordering for <strong>Table {activeTable.tableNumber}</strong> ({activeTable.section})
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#FFFEFC] p-4 rounded-2xl border border-[#B39460]/20 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#B39460]/30 focus:outline-none focus:border-[#B39460] text-xs bg-[#F7F4EE]/60 text-[#201E1A]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8175] hover:text-[#201E1A]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { label: "All Dietary", value: "all" },
                { label: "🟢 Veg Only", value: "veg" },
                { label: "🔴 Non-Veg", value: "non-veg" },
                { label: "🌱 Vegan", value: "vegan" },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setDietaryFilter(pill.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    dietaryFilter === pill.value
                      ? "bg-[#201E1A] text-[#B39460] shadow-xs"
                      : "bg-[#F7F4EE] text-[#8A8175] hover:text-[#201E1A] border border-[#B39460]/20"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Price / Featured Sort */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#B39460]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-[#F7F4EE] border border-[#B39460]/30 rounded-full px-3 py-1.5 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="pt-2 border-t border-[#B39460]/15 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-[#B39460] text-[#201E1A] shadow-xs"
                  : "bg-transparent text-[#8A8175] hover:text-[#201E1A] hover:bg-[#F7F4EE]"
              }`}
            >
              All Courses ({dishes.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-[#B39460] text-[#201E1A] shadow-xs"
                    : "bg-transparent text-[#8A8175] hover:text-[#201E1A] hover:bg-[#F7F4EE]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Grid */}
        <div className="mb-4 flex items-center justify-between text-xs text-[#8A8175]">
          <span>Showing {filteredDishes.length} dishes</span>
          {dietaryFilter !== "all" && (
            <span className="text-[#B39460] font-medium capitalize">
              Filtered: {dietaryFilter}
            </span>
          )}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFEFC] rounded-2xl border border-dashed border-[#B39460]/40 p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-[#B39460] mx-auto" />
            <h3 className="font-serif text-xl text-[#201E1A]">No royal dishes found</h3>
            <p className="text-xs text-[#8A8175]">
              Try adjusting your search criteria or dietary filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setDietaryFilter("all");
              }}
              className="mt-2 px-5 py-2 rounded-full bg-[#201E1A] text-[#B39460] text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => {
              const primaryImage =
                dish.images?.find((i) => i.isPrimary)?.url ||
                dish.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";

              const isJustAdded = addedId === dish._id;

              return (
                <div
                  key={dish._id}
                  className="group bg-[#FFFEFC] rounded-2xl overflow-hidden border border-[#B39460]/20 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Dish Image */}
                    <Link
                      href={`/menu/${dish.slug}`}
                      className="relative h-52 w-full block overflow-hidden bg-[#201E1A]/10"
                    >
                      <Image
                        src={primaryImage}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Dietary pill */}
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

                      {/* Spice indicator */}
                      {dish.spiceLevel > 0 && (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-1 rounded-full bg-[#201E1A]/85 backdrop-blur-xs border border-[#B39460]/40">
                          {[...Array(dish.spiceLevel)].map((_, i) => (
                            <Flame key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                      )}

                      {!dish.isAvailable && (
                        <div className="absolute inset-0 bg-[#201E1A]/75 backdrop-blur-xs flex items-center justify-center">
                          <span className="px-4 py-1.5 rounded-full bg-red-900/90 text-white text-xs font-semibold tracking-wider uppercase border border-red-500">
                            Currently Unavailable
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#B39460]">
                        <span>{dish.categoryName || "Specialty"}</span>
                        <span className="flex items-center gap-1 text-[#8A8175]">
                          <Clock className="w-3 h-3 text-[#B39460]" />
                          {dish.preparationTimeMinutes}m
                        </span>
                      </div>

                      <Link
                        href={`/menu/${dish.slug}`}
                        className="font-serif text-lg font-medium text-[#201E1A] hover:text-[#B39460] transition-colors block line-clamp-1"
                      >
                        {dish.name}
                      </Link>

                      <p className="text-xs text-[#8A8175] line-clamp-2 leading-relaxed">
                        {dish.shortDescription || dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-[#B39460]/15 flex items-center justify-between">
                      <div>
                        <span className="font-sans text-base font-semibold text-[#201E1A]">
                          {formatPaise(dish.pricePaise)}
                        </span>
                        <span className="text-[10px] text-[#8A8175] block">
                          {dish.portionSize}
                        </span>
                      </div>

                      {dish.customizationGroups &&
                      dish.customizationGroups.length > 0 ? (
                        <Link
                          href={`/menu/${dish.slug}`}
                          className="px-3.5 py-1.5 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold tracking-wider uppercase transition-all"
                        >
                          Customize
                        </Link>
                      ) : (
                        <button
                          disabled={!dish.isAvailable}
                          onClick={(e) => handleQuickAdd(dish, e)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1 ${
                            isJustAdded
                              ? "bg-emerald-700 text-white"
                              : !dish.isAvailable
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE]">
          <div className="w-10 h-10 border-2 border-[#B39460] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
