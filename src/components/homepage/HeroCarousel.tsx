"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, UtensilsCrossed, ArrowRight, Flame, Award, Clock } from "lucide-react";
import { formatPaise } from "@/lib/currency";
import { Dish } from "@/types";

interface HeroCarouselProps {
  dishes: Dish[];
}

export function HeroCarousel({ dishes }: HeroCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);

  // Dragging and momentum refs
  const dragStartRef = useRef<{ x: number; time: number; startOffset: number }>({
    x: 0,
    time: 0,
    startOffset: 0,
  });
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const autoScrollSpeed = 0.0006; // Continuous right-to-left scroll

  // Responsive radius & dimensions
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setViewportWidth(window.innerWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalCards = Math.max(10, dishes.length);
  // Ensure we display at least 10 cards
  const carouselDishes = dishes.slice(0, 10);
  const cardSpacing = (2 * Math.PI) / carouselDishes.length;

  // Animation loop with inertia & continuous auto-scroll
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = Math.min(32, currentTime - lastTimeRef.current);
      lastTimeRef.current = currentTime;

      if (!isDragging) {
        // Apply momentum decay if any velocity remaining
        if (Math.abs(velocityRef.current) > 0.00005) {
          setOffset((prev) => prev + velocityRef.current * (deltaTime / 16));
          velocityRef.current *= 0.94; // Friction
        } else {
          // Normal continuous auto-scroll
          setOffset((prev) => prev - autoScrollSpeed * (deltaTime / 16));
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging]);

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      time: Date.now(),
      startOffset: offset,
    };
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const now = Date.now();
    const timeDelta = Math.max(1, now - dragStartRef.current.time);

    // Convert pixel delta to angle radians
    const angleDelta = (deltaX / viewportWidth) * Math.PI * 1.3;
    setOffset(dragStartRef.current.startOffset + angleDelta);

    // Compute velocity for release momentum
    velocityRef.current = angleDelta / timeDelta;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  // Cylinder geometry constants
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const radius = isMobile ? 380 : isTablet ? 620 : 880;
  const cardWidth = isMobile ? 180 : isTablet ? 240 : 280;
  const baseCardHeight = isMobile ? 260 : isTablet ? 340 : 400;

  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#F7F4EE] via-[#FFFEFC] to-[#F7F4EE] select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#B39460]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Hero Headline & Entrance */}
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-5">
        {/* Badge pop-in */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B39460]/40 bg-[#B39460]/10 text-[#917544] text-xs uppercase tracking-[0.25em] font-medium shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#B39460]" />
          <span>Royal Indian Fine Dining • Since 1892</span>
        </div>

        {/* Headline rise & blur removal */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#201E1A] tracking-tight leading-[1.08]">
          Where Ancient Spices <br className="hidden sm:inline" />
          <span className="italic text-[#B39460] font-light">
            Become Masterpieces
          </span>
        </h1>

        {/* Subtitle fade-in */}
        <p className="max-w-2xl mx-auto text-[#8A8175] text-sm sm:text-base md:text-lg font-sans leading-relaxed">
          Indulge in 18-hour slow-cooked Dal Bukhara, melt-in-mouth Galouti
          kebabs, and fragrant Awadhi Dum Biryani. Crafted with regal heritage,
          served directly to your table.
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/menu"
            className="px-8 py-3.5 rounded-full bg-[#201E1A] text-[#B39460] hover:bg-[#B39460] hover:text-[#201E1A] text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center gap-2 group"
          >
            <span>Explore Royal Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/order/tbl_royal_01"
            className="px-8 py-3.5 rounded-full border border-[#B39460] text-[#201E1A] hover:bg-[#B39460]/10 text-xs uppercase tracking-widest font-medium transition-all flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#B39460]" />
            <span>Table Dine-In Order</span>
          </Link>
        </div>

        {/* Handwritten Annotation with doodle arrow */}
        <div className="relative inline-block mt-4 text-[#917544] font-handwriting text-xl sm:text-2xl transform -rotate-2">
          <span>✨ Swipe or drag the carousel to explore signature creations</span>
          <svg
            className="w-12 h-6 mx-auto mt-1 text-[#B39460] opacity-80"
            viewBox="0 0 60 25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M5 5 C 25 20, 35 5, 55 18 M 48 20 L 55 18 L 53 12" />
          </svg>
        </div>
      </div>

      {/* Reelmark-Inspired Curved Cylindrical Carousel */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative mt-12 h-[340px] sm:h-[420px] lg:h-[480px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible perspective-[1200px]"
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {carouselDishes.map((dish, index) => {
            // Cylindrical angular position
            const angle = (index * cardSpacing + offset) % (2 * Math.PI);
            // Normalize angle between -PI and +PI
            const normalizedAngle =
              angle > Math.PI ? angle - 2 * Math.PI : angle < -Math.PI ? angle + 2 * Math.PI : angle;

            // Only render cards visible in the front arc (-PI/2 to +PI/2 plus slight margin)
            const isVisible = Math.abs(normalizedAngle) < Math.PI * 0.65;
            if (!isVisible) return null;

            // Cylindrical 3D coordinate math
            const x = Math.sin(normalizedAngle) * radius;
            const z = Math.cos(normalizedAngle) * radius - radius;
            const rotationY = -(normalizedAngle * 180) / Math.PI * 0.7;

            // Progressive scaling & edge height variation
            const distanceRatio = Math.abs(normalizedAngle) / (Math.PI * 0.65);
            // Center cards upright, outer cards slightly scaled and positioned
            const scale = Math.max(0.78, 1 - distanceRatio * 0.22);
            // Opacity smoothly drops towards periphery
            const opacity = Math.max(0.25, 1 - Math.pow(distanceRatio, 1.8));
            // Edge cards slightly taller geometry variation
            const cardHeight = baseCardHeight * (1 + distanceRatio * 0.08);

            const primaryImage =
              dish.images?.find((img) => img.isPrimary)?.url ||
              dish.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={dish._id}
                className="absolute top-1/2 left-1/2 transition-opacity will-change-transform"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${Math.abs(x) * 0.03}px, ${z}px) rotateY(${rotationY}deg) scale(${scale})`,
                  opacity,
                  zIndex: Math.round(1000 + z),
                  backfaceVisibility: "hidden",
                }}
              >
                <Link
                  href={`/menu/${dish.slug}`}
                  className="block w-full h-full rounded-2xl overflow-hidden bg-[#201E1A] border border-[#B39460]/40 shadow-xl group hover:border-[#B39460] transition-all relative"
                  style={{ position: "relative", overflow: "hidden", display: "block", width: "100%", height: "100%", borderRadius: "1rem" }}
                >
                  {/* Dish Image */}
                  <Image
                    src={primaryImage}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 200px, 320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority={index < 3}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201E1A] via-[#201E1A]/40 to-transparent" />

                  {/* Dietary badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#201E1A]/80 backdrop-blur-xs border border-[#B39460]/40 text-[10px] text-[#FFFEFC]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dish.dietary === "veg"
                          ? "bg-emerald-500"
                          : dish.dietary === "non-veg"
                          ? "bg-rose-500"
                          : "bg-amber-400"
                      }`}
                    />
                    <span className="uppercase tracking-wider font-semibold">
                      {dish.dietary}
                    </span>
                  </div>

                  {/* Chef special badge */}
                  {dish.isChefSpecial && (
                    <div className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[#B39460] text-[#201E1A] shadow-md">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Card Bottom Meta */}
                  <div className="absolute bottom-0 inset-x-0 p-4 text-[#FFFEFC] space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-[#B39460] font-sans">
                      {dish.categoryName || "Signature Dish"}
                    </p>
                    <h3 className="font-serif text-base sm:text-lg font-medium leading-tight group-hover:text-[#B39460] transition-colors line-clamp-1">
                      {dish.name}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-sans font-semibold text-sm sm:text-base text-[#FFFEFC]">
                        {formatPaise(dish.pricePaise)}
                      </span>
                      <span className="text-[11px] text-[#8A8175] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B39460]" />
                        {dish.preparationTimeMinutes}m
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Golden Divider */}
      <div className="max-w-xs mx-auto mt-6 flex items-center justify-center gap-3 text-[#B39460]">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B39460]" />
        <Sparkles className="w-4 h-4" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B39460]" />
      </div>
    </section>
  );
}
