"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Layers, Check, Sparkles } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { categories, saveCategory, deleteCategory } = useRestaurant();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImageUrl(cat.imageUrl || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveCategory({
      _id: editingId || undefined,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      imageUrl: imageUrl.trim() || undefined,
    });

    handleCancel();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
          Menu Organization
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#201E1A]">
          Food Categories & Courses ({categories.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#FFFEFC] rounded-3xl border border-[#B39460]/20 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#B39460]/20 bg-[#201E1A] text-[#FFFEFC] flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span>Active Categories</span>
              <span>Course Order</span>
            </div>

            <div className="divide-y divide-[#F7F4EE]">
              {categories.map((cat, idx) => (
                <div
                  key={cat._id}
                  className="p-4 flex items-center justify-between hover:bg-[#F7F4EE]/50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={
                          cat.imageUrl ||
                          "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80"
                        }
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-base text-[#201E1A]">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-[#8A8175] line-clamp-1">
                        {cat.description}
                      </p>
                      <span className="text-[10px] text-[#B39460] font-mono">
                        /{cat.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 rounded-lg border border-gray-200 text-[#8A8175] hover:text-[#201E1A]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category ${cat.name}?`)) {
                          deleteCategory(cat._id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFEFC] p-6 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-4"
          >
            <h3 className="font-serif text-xl text-[#201E1A]">
              {editingId ? "Edit Category" : "Add New Category"}
            </h3>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Category Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                placeholder="e.g. Royal Kebabs & Tandoor"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Slug (URL Path)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. tandoor"
                className="w-full px-4 py-2 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief narrative of the course..."
                className="w-full px-4 py-2 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Banner Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs text-gray-700"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
              >
                {editingId ? "Update Category" : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
