import Image from "next/image";
import Link from "next/link";
import { Award, Sparkles, Quote, ArrowRight } from "lucide-react";

export function ChefRecommendations() {
  return (
    <section className="py-24 bg-[#FFFEFC] border-b border-[#B39460]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#201E1A] rounded-3xl overflow-hidden border border-[#B39460]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Chef Portrait */}
            <div className="lg:col-span-5 relative h-[380px] sm:h-[460px] lg:h-full min-h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=85"
                alt="Executive Chef Ranveer Rathore"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201E1A] via-transparent to-transparent lg:hidden" />
            </div>

            {/* Content */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 text-[#FFFEFC] space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B39460] font-semibold">
                <Award className="w-4 h-4" />
                <span>Executive Chef Selection</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[#FFFEFC]">
                Ranveer Rathore's <br />
                <span className="italic text-[#B39460]">
                  Personal Recommendation
                </span>
              </h2>

              <div className="relative pl-6 border-l-2 border-[#B39460]/60 italic font-serif text-lg sm:text-xl text-[#F7F4EE]/90">
                <Quote className="w-8 h-8 text-[#B39460]/20 absolute -top-4 -left-3 -z-10" />
                &ldquo;True royal cooking requires unhurried patience. When you taste
                our Dal Bukhara with freshly blistered Truffle Naan, you are
                experiencing 18 hours of simmering devotion.&rdquo;
              </div>

              <p className="text-xs sm:text-sm text-[#8A8175] leading-relaxed font-sans">
                Chef Rathore was inducted into the Royal Culinary Guild after
                spending twenty years researching ancestral recipes from Lucknow,
                Hyderabad, and Rampur. Every spice blend at SHYN is roasted and
                milled under his direct supervision each dawn.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/menu/dal-shyn-bukhara"
                  className="px-6 py-3 rounded-full bg-[#B39460] text-[#201E1A] hover:bg-[#FFFEFC] hover:text-[#201E1A] text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2"
                >
                  <span>Order Dal Bukhara</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 rounded-full border border-[#8A8175]/40 text-xs text-[#FFFEFC] hover:border-[#B39460] hover:text-[#B39460] uppercase tracking-widest transition-all"
                >
                  Meet the Culinary Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
