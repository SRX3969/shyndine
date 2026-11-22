"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Plus, Trash2, Check, Sparkles } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";

export default function AdminGalleryPage() {
  const { dishes } = useRestaurant();
  const [activeTab, setActiveTab] = useState<"dishes" | "ambiance">("dishes");

  // Collect all photos from all dishes
  const allDishImages = dishes.flatMap((d) =>
    (d.images || []).map((img) => ({
      ...img,
      dishName: d.name,
      dishId: d._id,
    }))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
          Cloudinary & Asset Library
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
          Restaurant Photography Management ({allDishImages.length} images)
        </h1>
        <p className="text-xs text-[#8A8175] mt-1">
          Review, reorganize, and inspect all food and ambiance photography across the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allDishImages.map((img, i) => (
          <div
            key={i}
            className="bg-[#FFFEFC] rounded-2xl overflow-hidden border border-[#B39460]/20 shadow-xs flex flex-col justify-between group"
          >
            <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
              <Image
                src={img.url}
                alt={img.caption || img.dishName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="200px"
              />
              {img.isPrimary && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#B39460] text-[#201E1A] text-[9px] font-bold uppercase">
                  Primary
                </span>
              )}
            </div>

            <div className="p-3 space-y-1">
              <span className="font-serif font-medium text-xs text-[#201E1A] block truncate">
                {img.dishName}
              </span>
              <p className="text-[10px] text-[#8A8175] truncate">
                {img.caption || "Culinary Photograph"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
