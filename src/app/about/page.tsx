import Image from "next/image";
import Link from "next/link";
import { Award, Sparkles, Clock, Flame, HeartHandshake, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-[#201E1A] text-[#FFFEFC] overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B39460] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ancestral Heritage</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-tight">
              The Lineage of <br />
              <span className="italic text-[#B39460]">Royal Gastronomy</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#8A8175] font-sans leading-relaxed">
              Preserving sacred Indian culinary techniques across three
              centuries — where fire, patience, and rare botanicals transform
              into dining poetry.
            </p>
          </div>
        </section>

        {/* The Philosophy */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
                Our Foundation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#201E1A]">
                The Three Sacraments of SHYN
              </h2>
              <div className="space-y-4 text-sm text-[#8A8175] leading-relaxed">
                <div className="flex gap-4">
                  <Flame className="w-5 h-5 text-[#B39460] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif font-semibold text-base text-[#201E1A]">
                      Live Charcoal Ember Tandoor
                    </h4>
                    <p className="mt-1">
                      We never use gas or electric tandoors. Our clay ovens are fired
                      exclusively with slow-burning organic acacia and neem charcoal,
                      imparting a pristine woodsmoke perfume that cannot be replicated.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-[#B39460] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif font-semibold text-base text-[#201E1A]">
                      The 18-Hour Purdah Simmer
                    </h4>
                    <p className="mt-1">
                      Our signature Dal Bukhara and Rogan Josh are simmered in heavy
                      tinned copper vessels (degchis) overnight. The slow, uninterrupted
                      heat breaks down the lentils and marrow into silken velvet without
                      ever burning the delicate fats.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Sparkles className="w-5 h-5 text-[#B39460] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif font-semibold text-base text-[#201E1A]">
                      Pampore Saffron & Desi Ghee
                    </h4>
                    <p className="mt-1">
                      We source Grade-A Mongra saffron directly from family farms in
                      Pampore, Kashmir, and churn our cultured white butter and A2 Gir cow
                      ghee in-house every morning.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-[#B39460]/30">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85"
                alt="SHYN Charcoal Tandoor"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Master Chef Section */}
        <section className="py-20 bg-[#FFFEFC] border-y border-[#B39460]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=85"
                  alt="Executive Chef"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
                  Culinary Custodian
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#201E1A]">
                  Executive Chef Ranveer Rathore
                </h3>
                <p className="text-sm text-[#8A8175] leading-relaxed">
                  Trained under the royal khansamas of the Awadh and Rampur palaces,
                  Chef Rathore has dedicated three decades to reviving lost Mughal
                  and Rajput court banquets. His commitment to authenticity has earned
                  SHYN consecutive honors on the national fine-dining landscape.
                </p>

                <div className="pt-4 grid grid-cols-2 gap-4 text-xs font-serif text-[#201E1A]">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#B39460]" />
                    <span>Royal Culinary Guild Laureate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#B39460]" />
                    <span>Top 50 Heritage Dining Asia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#B39460]" />
                    <span>Slow Food Movement Patron</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#B39460]" />
                    <span>Master of Awadhi Purdah Dum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
