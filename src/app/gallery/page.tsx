"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Sparkles, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const allPhotos = [
  {
    id: "p1",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    title: "Grand Dining Chamber",
    category: "ambiance",
    caption: "Understated luxury with antique brass tableware and chandelier glow",
  },
  {
    id: "p2",
    url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85",
    title: "Awadhi Galouti Kebab",
    category: "culinary",
    caption: "Melt-in-mouth smoked lamb patties atop saffron sheermal",
  },
  {
    id: "p3",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85",
    title: "Purdah Dum Biryani",
    category: "culinary",
    caption: "Sealed earthen handi with saffron basmati and golden fried onions",
  },
  {
    id: "p4",
    url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85",
    title: "Dal SHYN Bukhara",
    category: "culinary",
    caption: "18-hour slow-cooked black lentils with white butter swirl",
  },
  {
    id: "p5",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    title: "The Royal Courtyard",
    category: "ambiance",
    caption: "Al-fresco dining under brass lanterns and starlight",
  },
  {
    id: "p6",
    url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85",
    title: "The Master Plating",
    category: "chef",
    caption: "Executive Chef inspecting charcoal-fired skewer glazes",
  },
  {
    id: "p7",
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85",
    title: "Zafrani Phirni in Clay Kasora",
    category: "culinary",
    caption: "Silky saffron rice pudding garnished with silver vark and pistachios",
  },
  {
    id: "p8",
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85",
    title: "Smoked Rose Lassi",
    category: "culinary",
    caption: "Damascus rose infusion presented with cloche clove smoke",
  },
  {
    id: "p9",
    url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=85",
    title: "Paneer Angara Skewers",
    category: "culinary",
    caption: "Volcanic yellow-chilli marinated cottage cheese",
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<(typeof allPhotos)[0] | null>(
    null
  );

  const displayedPhotos =
    filter === "all"
      ? allPhotos
      : allPhotos.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Anthology</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#201E1A]">
            Restaurant & Food Photography
          </h1>
          <p className="text-sm text-[#8A8175]">
            A chronicle of our dining chambers, live charcoal ovens, and artisanal creations.
          </p>

          {/* Filter Pills */}
          <div className="pt-6 flex justify-center gap-2 overflow-x-auto">
            {[
              { label: "All Imagery", value: "all" },
              { label: "Culinary Dishes", value: "culinary" },
              { label: "Sanctuary & Ambiance", value: "ambiance" },
              { label: "Chef & Hearth", value: "chef" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setFilter(p.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  filter === p.value
                    ? "bg-[#201E1A] text-[#B39460] shadow-sm"
                    : "bg-[#FFFEFC] text-[#8A8175] hover:text-[#201E1A] border border-[#B39460]/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightboxImage(photo)}
              className="group relative h-80 rounded-2xl overflow-hidden bg-[#201E1A] border border-[#B39460]/25 shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201E1A]/90 via-[#201E1A]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-[#FFFEFC] transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] uppercase tracking-widest text-[#B39460] font-sans">
                  {photo.category}
                </span>
                <h3 className="font-serif text-lg font-medium text-[#FFFEFC]">
                  {photo.title}
                </h3>
                <p className="text-xs text-[#8A8175] mt-1 line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative max-w-4xl max-h-[85vh] w-full rounded-2xl overflow-hidden bg-[#201E1A] border border-[#B39460]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[65vh] w-full">
                <Image
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 bg-[#201E1A] text-[#FFFEFC] border-t border-[#B39460]/30">
                <h3 className="font-serif text-2xl text-[#B39460]">
                  {lightboxImage.title}
                </h3>
                <p className="text-xs text-[#8A8175] mt-1">
                  {lightboxImage.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
