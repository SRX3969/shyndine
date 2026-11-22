import Image from "next/image";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, HeartHandshake } from "lucide-react";

export function RestaurantIntroduction() {
  return (
    <section className="py-24 bg-[#FFFEFC] border-y border-[#B39460]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Imagery Composition */}
          <div className="relative">
            <div className="relative h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl border border-[#B39460]/30">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
                alt="SHYN Royal Dining Room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201E1A]/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping luxury card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-[#201E1A] text-[#FFFEFC] p-6 rounded-xl border border-[#B39460] shadow-2xl max-w-xs hidden sm:block">
              <Sparkles className="w-5 h-5 text-[#B39460] mb-2" />
              <h4 className="font-serif text-lg font-medium text-[#B39460]">
                Authentic Purdah Dum
              </h4>
              <p className="text-xs text-[#8A8175] mt-1 leading-relaxed">
                Hand-kneaded dough seals our earthen pots, allowing aromatic steam
                to recirculate until the spices melt into the grain.
              </p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
              <Award className="w-4 h-4 text-[#B39460]" />
              <span>A Regal Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#201E1A] leading-tight">
              Culinary Artistry Born From <br />
              <span className="italic text-[#B39460]">Nawabi Sanctuaries</span>
            </h2>

            <p className="text-sm sm:text-base text-[#8A8175] leading-relaxed font-sans">
              Founded on centuries-old parchment recipes preserved in royal kitchens,
              SHYN is a sanctuary for discerning gourmands. We reject modern shortcuts
              in favour of copper handis, stone-ground garam masalas, and the slow,
              meditative rhythm of true charcoal embers.
            </p>

            <p className="text-sm sm:text-base text-[#8A8175] leading-relaxed font-sans">
              From the silken melt of our 32-spice Galouti Kebabs to the deep mahogany
              velvet of our 18-hour Dal Bukhara, every dish honors the sacred balance
              between heat, fragrance, and pure hand-churned ghee.
            </p>

            {/* Metric counters */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#B39460]/20">
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B39460] block">
                  18h
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#8A8175] mt-1 block">
                  Slow Simmered Dal
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B39460] block">
                  32
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#8A8175] mt-1 block">
                  Secret Whole Spices
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B39460] block">
                  100%
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#8A8175] mt-1 block">
                  Desi Ghee & Saffron
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#201E1A] hover:text-[#B39460] transition-colors group"
              >
                <span>Read the complete lineage</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
