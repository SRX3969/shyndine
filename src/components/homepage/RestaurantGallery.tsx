import Image from "next/image";
import { Sparkles, Camera } from "lucide-react";
import Link from "next/link";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    title: "The Grand Chandelier Dining Hall",
    subtitle: "Understated luxury with antique brass tableware",
    span: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=85",
    title: "Clay Oven Skewers",
    subtitle: "Smoked over live Acacia charcoal",
    span: "col-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=85",
    title: "Dum Pukht Sealed Pots",
    subtitle: "Saffron basmati steam release",
    span: "col-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85",
    title: "Artisanal Terracotta Phirni",
    subtitle: "Chilled with edible silver foil & rose petals",
    span: "col-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
    title: "Royal Courtyard Cabanas",
    subtitle: "Open-air dining under brass lantern glow",
    span: "col-span-1",
  },
];

export function RestaurantGallery() {
  return (
    <section className="py-24 bg-[#201E1A] text-[#FFFEFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B39460] font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>Sanctuary & Ambiance</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFEFC]">
              The Restaurant Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8175] max-w-md">
              A visual glimpse into our handcrafted interiors, charcoal hearths,
              and culinary presentations.
            </p>
          </div>

          <Link
            href="/gallery"
            className="px-6 py-2.5 rounded-full border border-[#B39460] text-xs text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] uppercase tracking-widest font-semibold transition-all self-start md:self-auto"
          >
            Explore Complete Photography
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl overflow-hidden border border-[#B39460]/20 ${img.span}`}
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201E1A]/90 via-[#201E1A]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-[#FFFEFC] transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h4 className="font-serif text-lg sm:text-xl font-medium text-[#B39460]">
                  {img.title}
                </h4>
                <p className="text-xs text-[#8A8175] mt-1 font-sans">
                  {img.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
