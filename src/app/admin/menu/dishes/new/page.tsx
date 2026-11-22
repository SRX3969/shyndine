"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Dish, DishImage } from "@/types";
import { rupeesToPaise, paiseToRupees } from "@/lib/currency";

interface DishFormPageProps {
  params?: Promise<{ dishId: string }>;
}

export default function DishFormPage({ params }: DishFormPageProps) {
  const router = useRouter();
  const { categories, getDishById, saveDish } = useRestaurant();

  const [dishId, setDishId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priceRupees, setPriceRupees] = useState(500);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [dietary, setDietary] = useState<"veg" | "non-veg" | "vegan" | "egg">("veg");
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2 | 3>(1);
  const [portionSize, setPortionSize] = useState("Serves 2 (400g)");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [ingredientsText, setIngredientsText] = useState("");
  const [allergensText, setAllergensText] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);

  // Multi-image management state
  const [images, setImages] = useState<DishImage[]>([
    {
      id: "img_init",
      url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85",
      caption: "Primary Presentation",
      isPrimary: true,
    },
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (params) {
      params.then((p) => {
        if (p.dishId && p.dishId !== "new") {
          setDishId(p.dishId);
          const existing = getDishById(p.dishId);
          if (existing) {
            setName(existing.name);
            setSlug(existing.slug);
            setCategoryId(existing.categoryId);
            setPriceRupees(paiseToRupees(existing.pricePaise));
            setDescription(existing.description);
            setShortDescription(existing.shortDescription || "");
            setDietary(existing.dietary as any);
            setSpiceLevel(existing.spiceLevel);
            setPortionSize(existing.portionSize);
            setPrepTimeMinutes(existing.preparationTimeMinutes);
            setIngredientsText(existing.ingredients.join(", "));
            setAllergensText(existing.allergens.join(", "));
            setIsAvailable(existing.isAvailable);
            setIsFeatured(existing.isFeatured);
            setIsChefSpecial(existing.isChefSpecial);
            if (existing.images && existing.images.length > 0) {
              setImages(existing.images);
            }
          }
        } else if (categories.length > 0) {
          setCategoryId(categories[0]._id);
        }
      });
    } else if (categories.length > 0) {
      setCategoryId(categories[0]._id);
    }
  }, [params, getDishById, categories]);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const newImg: DishImage = {
      id: `img_${Date.now()}`,
      url: newImageUrl.trim(),
      caption: newImageCaption.trim() || name,
      isPrimary: images.length === 0,
    };
    setImages([...images, newImg]);
    setNewImageUrl("");
    setNewImageCaption("");
  };

  const handleSetPrimary = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c._id === categoryId);

    saveDish({
      _id: dishId || undefined,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId,
      categoryName: cat?.name,
      pricePaise: rupeesToPaise(Number(priceRupees)),
      description,
      shortDescription,
      dietary,
      spiceLevel,
      portionSize,
      preparationTimeMinutes: Number(prepTimeMinutes),
      ingredients: ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      allergens: allergensText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images,
      isAvailable,
      isFeatured,
      isChefSpecial,
    });

    setIsSaved(true);
    setTimeout(() => {
      router.push("/admin/menu/dishes");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/menu/dishes"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8A8175] hover:text-[#201E1A]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dishes</span>
        </Link>
        <span className="text-xs uppercase tracking-wider text-[#917544] font-semibold">
          {dishId ? "Edit Dish" : "Create New Dish"}
        </span>
      </div>

      <form onSubmit={handleSave} className="bg-[#FFFEFC] p-8 rounded-3xl border border-[#B39460]/20 shadow-xs space-y-8">
        <div className="border-b border-[#B39460]/20 pb-4">
          <h1 className="font-serif text-2xl sm:text-3xl text-[#201E1A]">
            {dishId ? "Update Dish Details" : "Add Royal Creation to Menu"}
          </h1>
          <p className="text-xs text-[#8A8175] mt-1">
            Configure dish photographs, pricing, dietary metrics, and ingredients.
          </p>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-[#201E1A]">Basic Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Dish Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!dishId) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                placeholder="e.g. Shahi Awadhi Galouti Kebab"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Course Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Price in Rupees (₹) *
              </label>
              <input
                required
                type="number"
                min="1"
                value={priceRupees}
                onChange={(e) => setPriceRupees(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Portion Size *
              </label>
              <input
                required
                type="text"
                value={portionSize}
                onChange={(e) => setPortionSize(e.target.value)}
                placeholder="Serves 2 (450g)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Prep Time (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Short Summary Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Finely minced smoked lamb patties, tender enough to dissolve on palate."
              className="w-full px-4 py-2 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
              Full Culinary Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed heritage narrative of the recipe, marination, and cooking..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
            />
          </div>
        </div>

        {/* Dietary & Heat */}
        <div className="pt-4 border-t border-[#B39460]/20 space-y-4">
          <h3 className="font-serif text-lg text-[#201E1A]">
            Dietary & Spice Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Dietary Classification
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              >
                <option value="veg">Vegetarian (🟢 Veg)</option>
                <option value="non-veg">Non-Vegetarian (🔴 Non-Veg)</option>
                <option value="vegan">Vegan (🌱 Plant-Based)</option>
                <option value="egg">Eggitarian (🟡 Contains Egg)</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Spice Level (0 to 3)
              </label>
              <select
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(Number(e.target.value) as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              >
                <option value={0}>0 - Mild & Fragrant</option>
                <option value={1}>1 - Low Warmth</option>
                <option value={2}>2 - Medium Traditional</option>
                <option value={3}>3 - Royal Fiery Heat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Ingredients (Comma-separated)
              </label>
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="e.g. Minced Lamb, Raw Papaya, Desi Ghee, Saffron"
                className="w-full px-4 py-2 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[#201E1A] font-medium block mb-1">
                Allergens (Comma-separated)
              </label>
              <input
                type="text"
                value={allergensText}
                onChange={(e) => setAllergensText(e.target.value)}
                placeholder="e.g. Dairy, Gluten, Nuts"
                className="w-full px-4 py-2 rounded-xl border border-[#B39460]/30 text-xs bg-[#F7F4EE]/50 text-[#201E1A] focus:outline-none focus:border-[#B39460]"
              />
            </div>
          </div>
        </div>

        {/* Multi-Image Management & Cloudinary */}
        <div className="pt-4 border-t border-[#B39460]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg text-[#201E1A]">
                Food Photography Gallery ({images.length} photos)
              </h3>
              <p className="text-xs text-[#8A8175]">
                Upload Cloudinary or Unsplash URLs. Select which image serves as the primary card photo.
              </p>
            </div>
          </div>

          {/* Current Images Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`relative rounded-xl overflow-hidden border-2 bg-gray-100 p-1 flex flex-col justify-between ${
                  img.isPrimary ? "border-[#B39460]" : "border-gray-200"
                }`}
              >
                <div className="relative h-28 w-full rounded-lg overflow-hidden">
                  <Image src={img.url} alt={img.caption || ""} fill className="object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#B39460] text-[#201E1A] text-[9px] font-bold uppercase">
                      Primary
                    </span>
                  )}
                </div>

                <div className="pt-1.5 flex items-center justify-between">
                  {!img.isPrimary ? (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="text-[10px] text-[#B39460] hover:underline font-semibold"
                    >
                      Set Primary
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-medium">Primary</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-red-600 hover:text-red-800 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Image input */}
          <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#B39460]/30 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#201E1A]">
              Add Photo to Gallery
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Cloudinary or Unsplash Image URL (https://...)"
                className="px-3 py-2 rounded-lg border border-[#B39460]/30 text-xs bg-white text-[#201E1A]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  placeholder="Caption / Angle (e.g. Clay oven presentation)"
                  className="flex-1 px-3 py-2 rounded-lg border border-[#B39460]/30 text-xs bg-white text-[#201E1A]"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 rounded-lg bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs font-semibold transition-all shrink-0"
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="pt-4 border-t border-[#B39460]/20 flex flex-wrap gap-6 text-xs text-[#201E1A] font-medium">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="rounded text-[#B39460]"
            />
            <span>Active & Available for Ordering</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-[#B39460]"
            />
            <span>Show on Homepage Featured Grid</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isChefSpecial}
              onChange={(e) => setIsChefSpecial(e.target.checked)}
              className="rounded text-[#B39460]"
            />
            <span>Highlight as Chef's Signature Special</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-[#B39460]/20 flex items-center justify-end gap-4">
          <Link
            href="/admin/menu/dishes"
            className="px-6 py-2.5 rounded-full border border-gray-300 text-xs uppercase tracking-wider font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] font-serif text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Royal Dish</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
