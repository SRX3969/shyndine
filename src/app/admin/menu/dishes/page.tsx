"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatPaise } from "@/lib/currency";

export default function AdminDishesPage() {
  const { dishes, categories, toggleDishAvailability, deleteDish } =
    useRestaurant();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredDishes = dishes.filter((dish) => {
    if (selectedCategory !== "all" && dish.categoryId !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Catalogue Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
            Dishes & Food Menu ({dishes.length})
          </h1>
        </div>

        <Link
          href="/admin/menu/dishes/new"
          className="px-5 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </Link>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-[#FFFEFC] p-4 rounded-2xl border border-[#B39460]/20 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by dish name..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#8A8175]">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-[#F7F4EE] border border-[#B39460]/30 rounded-lg px-3 py-1.5 text-[#201E1A] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-[#FFFEFC] rounded-3xl border border-[#B39460]/20 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#201E1A] text-[#FFFEFC] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-4 px-6">Dish</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Dietary</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Prep Time</th>
                <th className="py-4 px-4">Availability</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F4EE]">
              {filteredDishes.map((dish) => {
                const primaryImg =
                  dish.images?.find((i) => i.isPrimary)?.url ||
                  dish.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80";

                return (
                  <tr key={dish._id} className="hover:bg-[#F7F4EE]/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={primaryImg}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-medium text-sm text-[#201E1A] block">
                            {dish.name}
                          </span>
                          <span className="text-[10px] text-[#8A8175] block">
                            {dish.portionSize}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#8A8175]">
                      {dish.categoryName || "Special"}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          dish.dietary === "veg"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dish.dietary === "veg" ? "bg-emerald-600" : "bg-rose-600"
                          }`}
                        />
                        {dish.dietary}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#201E1A]">
                      {formatPaise(dish.pricePaise)}
                    </td>

                    <td className="py-4 px-4 text-[#8A8175]">
                      {dish.preparationTimeMinutes} mins
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleDishAvailability(dish._id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${
                          dish.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {dish.isAvailable ? "Active" : "Disabled"}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/menu/dishes/${dish._id}`}
                          className="p-1.5 rounded-lg border border-gray-200 hover:border-[#B39460] text-[#8A8175] hover:text-[#201E1A] transition-colors"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${dish.name}?`)) {
                              deleteDish(dish._id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
