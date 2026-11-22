import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-24 bg-[#FFFEFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#917544] font-semibold">
            Culinary Chapters
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#201E1A]">
            Explore by Course
          </h2>
          <p className="text-sm text-[#8A8175]">
            Each chapter represents a distinct facet of royal culinary preparation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/menu?category=${category.slug}`}
              className="group relative h-64 rounded-2xl overflow-hidden border border-[#B39460]/20 shadow-sm hover:shadow-xl transition-all"
            >
              <Image
                src={
                  category.imageUrl ||
                  "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80"
                }
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201E1A] via-[#201E1A]/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-[#FFFEFC]">
                <h3 className="font-serif text-lg sm:text-xl font-medium group-hover:text-[#B39460] transition-colors leading-snug">
                  {category.name}
                </h3>
                <p className="text-[11px] text-[#8A8175] mt-1 line-clamp-1">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
