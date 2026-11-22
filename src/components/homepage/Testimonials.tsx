import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The Awadhi Galouti Kebabs at SHYN defy description. They do not merely melt in your mouth; they dissolve into pure fragrant ecstasy. An absolute benchmark for Indian gastronomy.",
    author: "Vir Sanghvi",
    role: "Culinary Historian & Food Critic",
    rating: 5,
  },
  {
    quote:
      "A rare sanctuary that refuses to dilute its heritage. The 18-hour simmer of their Dal Bukhara possesses a velvety depth that outshines the legendary hotels of Delhi.",
    author: "Condé Nast Traveller",
    role: "Gold List Dining Review",
    rating: 5,
  },
  {
    quote:
      "Seamless QR ordering right at the table while retaining the poise of white-glove royal service. The Purdah Dum Biryani table unsealing was the highlight of our anniversary.",
    author: "Vikram & Radhika Seth",
    role: "Patrons of SHYN",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Patron Impressions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#201E1A]">
            Words From the Table
          </h2>
          <p className="text-sm text-[#8A8175]">
            Celebrated by critics and cherished by generations of diners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#FFFEFC] border border-[#B39460]/25 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex gap-1 text-[#B39460]">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#B39460]" />
                  ))}
                </div>
                <p className="font-serif text-base sm:text-lg text-[#201E1A] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#B39460]/20">
                <h4 className="font-serif font-semibold text-base text-[#201E1A]">
                  {t.author}
                </h4>
                <p className="text-xs text-[#8A8175]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
