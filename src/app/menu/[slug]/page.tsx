"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Flame,
  Sparkles,
  Award,
  ChevronLeft,
  Plus,
  Minus,
  Check,
  ShieldAlert,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useCart } from "@/hooks/useCart";
import { formatPaise } from "@/lib/currency";
import { OrderItemCustomization } from "@/types";

interface DishDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function DishDetailPage({ params }: DishDetailPageProps) {
  const resolvedParams = use(params);
  const { getDishBySlug, dishes } = useRestaurant();
  const { addItem, activeTable } = useCart();

  const dish = getDishBySlug(resolvedParams.slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    Record<string, string>
  >({});
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  if (!dish) {
    return notFound();
  }

  const images = dish.images && dish.images.length > 0
    ? dish.images
    : [
        {
          id: "def_img",
          url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85",
          caption: dish.name,
          isPrimary: true,
        },
      ];

  const currentImage = images[selectedImageIndex] || images[0];

  // Handle customization selection
  const handleOptionSelect = (groupId: string, optionId: string) => {
    setSelectedCustomizations((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  // Compute calculated unit price with customizations
  const activeCustomizations: OrderItemCustomization[] = [];
  let customizationExtraPaise = 0;

  if (dish.customizationGroups) {
    dish.customizationGroups.forEach((group) => {
      const selectedOptId = selectedCustomizations[group.id];
      if (selectedOptId) {
        const option = group.options.find((o) => o.id === selectedOptId);
        if (option) {
          activeCustomizations.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: option.id,
            optionName: option.name,
            pricePaise: option.pricePaise,
          });
          customizationExtraPaise += option.pricePaise;
        }
      }
    });
  }

  const finalUnitPricePaise = dish.pricePaise + customizationExtraPaise;
  const grandTotalPaise = finalUnitPricePaise * quantity;

  const handleAddToCart = () => {
    addItem(dish, quantity, activeCustomizations, specialInstructions);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Related dishes
  const relatedDishes = dishes
    .filter((d) => d.categoryId === dish.categoryId && d._id !== dish._id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#8A8175] hover:text-[#201E1A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>

          {activeTable && (
            <span className="text-xs px-3 py-1 rounded-full bg-[#B39460]/10 border border-[#B39460]/30 text-[#201E1A] font-medium">
              Table {activeTable.tableNumber}
            </span>
          )}
        </div>

        {/* Two-Column Dish Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#FFFEFC] rounded-3xl p-6 sm:p-10 border border-[#B39460]/20 shadow-sm">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative h-[380px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-[#201E1A]/10 border border-[#B39460]/30 shadow-md">
              <Image
                src={currentImage.url}
                alt={currentImage.caption || dish.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-500"
              />

              {/* Dietary indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201E1A]/85 backdrop-blur-xs border border-[#B39460]/40 text-xs text-[#FFFEFC]">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
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
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#B39460] text-[#201E1A] text-xs uppercase tracking-wider font-bold shadow-md">
                  Chef's Signature
                </div>
              )}
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-[#B39460] scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || ""}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Culinary Specs & Ordering */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#B39460]">
                <span>{dish.categoryName || "Royal Course"}</span>
                <span className="flex items-center gap-1 text-[#8A8175]">
                  <Clock className="w-3.5 h-3.5 text-[#B39460]" />
                  {dish.preparationTimeMinutes} mins prep
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#201E1A]">
                {dish.name}
              </h1>

              {/* Price display */}
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-3xl font-bold text-[#201E1A]">
                  {formatPaise(dish.pricePaise)}
                </span>
                {dish.originalPricePaise && (
                  <span className="text-sm text-[#8A8175] line-through">
                    {formatPaise(dish.originalPricePaise)}
                  </span>
                )}
                <span className="text-xs text-[#8A8175] font-medium ml-2">
                  ({dish.portionSize})
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#8A8175] leading-relaxed font-sans">
                {dish.description}
              </p>

              {/* Spice & Heat Level */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs uppercase tracking-wider text-[#201E1A] font-medium">
                  Spice Level:
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Flame
                      key={i}
                      className={`w-4 h-4 ${
                        i < dish.spiceLevel
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-[#8A8175] ml-1">
                    {dish.spiceLevel === 0
                      ? "Mild & Fragrant"
                      : dish.spiceLevel === 1
                      ? "Gentle Warmth"
                      : dish.spiceLevel === 2
                      ? "Authentic Medium Spice"
                      : "Fiery Royal Heat"}
                  </span>
                </div>
              </div>

              {/* Ingredients tag cloud */}
              {dish.ingredients.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block">
                    Royal Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-[#F7F4EE] text-[#201E1A] border border-[#B39460]/20"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens warning */}
              {dish.allergens.length > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Contains allergens: <strong>{dish.allergens.join(", ")}</strong>. Please alert staff for severe intolerances.
                  </span>
                </div>
              )}

              {/* Customization Groups */}
              {dish.customizationGroups && dish.customizationGroups.length > 0 && (
                <div className="pt-4 border-t border-[#B39460]/20 space-y-4">
                  <h3 className="font-serif text-lg text-[#201E1A]">
                    Accompaniments & Customizations
                  </h3>
                  {dish.customizationGroups.map((group) => (
                    <div key={group.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-[#201E1A]">
                        <span>{group.title}</span>
                        {group.minSelections > 0 && (
                          <span className="text-[#917544] text-[10px] uppercase tracking-wider">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.options.map((option) => {
                          const isSelected =
                            selectedCustomizations[group.id] === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                handleOptionSelect(group.id, option.id)
                              }
                              className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                                isSelected
                                  ? "border-[#B39460] bg-[#B39460]/10 text-[#201E1A] font-medium"
                                  : "border-[#B39460]/20 bg-white text-[#8A8175] hover:border-[#B39460]"
                              }`}
                            >
                              <span>{option.name}</span>
                              {option.pricePaise > 0 && (
                                <span className="text-[#917544] font-semibold">
                                  +{formatPaise(option.pricePaise)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Instructions note */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block">
                  Kitchen Notes & Special Instructions:
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Less ghee, extra mint chutney, serve hot..."
                  className="w-full px-4 py-2 rounded-lg border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 focus:outline-none focus:border-[#B39460] text-[#201E1A]"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-[#B39460]/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8A8175]">
                  Calculated Total
                </span>
                <span className="font-sans text-2xl font-bold text-[#B39460]">
                  {formatPaise(grandTotalPaise)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-[#B39460]/40 rounded-full overflow-hidden bg-[#F7F4EE]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-[#B39460]/20 text-[#201E1A]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-semibold text-sm text-[#201E1A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-[#B39460]/20 text-[#201E1A]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Feast CTA */}
                <button
                  disabled={!dish.isAvailable}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-full font-serif text-sm uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
                    isAdded
                      ? "bg-emerald-700 text-white"
                      : !dish.isAvailable
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Feast</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Feast • {formatPaise(grandTotalPaise)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Dishes */}
        {relatedDishes.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="font-serif text-2xl text-[#201E1A]">
              Recommended Royal Pairings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDishes.map((rel) => {
                const img =
                  rel.images?.find((i) => i.isPrimary)?.url ||
                  rel.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";

                return (
                  <Link
                    key={rel._id}
                    href={`/menu/${rel.slug}`}
                    className="group bg-[#FFFEFC] rounded-2xl overflow-hidden border border-[#B39460]/20 shadow-xs hover:shadow-md transition-all flex gap-4 p-3"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#201E1A]/10">
                      <Image
                        src={img}
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-1">
                      <h4 className="font-serif font-medium text-base text-[#201E1A] group-hover:text-[#B39460] transition-colors line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-[#8A8175] line-clamp-1">
                        {rel.shortDescription}
                      </p>
                      <span className="font-sans font-semibold text-sm text-[#201E1A]">
                        {formatPaise(rel.pricePaise)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
