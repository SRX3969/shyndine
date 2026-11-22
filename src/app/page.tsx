"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { RestaurantIntroduction } from "@/components/homepage/RestaurantIntroduction";
import { FeaturedDishes } from "@/components/homepage/FeaturedDishes";
import { CategoryGrid } from "@/components/homepage/CategoryGrid";
import { RestaurantGallery } from "@/components/homepage/RestaurantGallery";
import { ChefRecommendations } from "@/components/homepage/ChefRecommendations";
import { Testimonials } from "@/components/homepage/Testimonials";
import { useRestaurant } from "@/hooks/useRestaurant";

export default function HomePage() {
  const { dishes, categories } = useRestaurant();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE]">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel dishes={dishes} />
        <RestaurantIntroduction />
        <FeaturedDishes dishes={dishes} />
        <CategoryGrid categories={categories} />
        <ChefRecommendations />
        <RestaurantGallery />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
