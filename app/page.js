"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ImagesSlider } from "@/components/ui/images-slider";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { CustomButton } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe-card";
import { CreatorCard } from "@/components/creator-card";
import { CanvasCard } from "@/components/ui/canvas-card";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import {
  NAV_ITEMS,
  CATEGORIES,
  FEATURED_RECIPES,
  CREATORS,
} from "@/lib/constants";
import { motion } from "framer-motion";
import {
  Flame,
  Heart,
  Award,
  ArrowRight,
  Utensils,
  BookOpen,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const heroImages = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1600&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Floating Navbar */}
      <FloatingNav navItems={NAV_ITEMS} />

      {/* Hero Section with Images Slider */}
      <ImagesSlider className="h-[90vh] w-full" images={heroImages}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-50 flex flex-col items-center justify-center px-4 text-center max-w-4xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
            <Utensils className="w-3.5 h-3.5" />
            <span>Community Recipe Sharing</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">SavoryCircle</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-xl text-neutral-200 font-medium max-w-2xl mb-10 leading-relaxed">
            The community-first recipe sharing platform. Discover, cook, and share delicious meals with food lovers around the world.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <CustomButton variant="glow" onClick={() => window.location.href = "#recipes"}>
              <span>Explore Recipes</span>
              <ArrowRight className="w-4 h-4" />
            </CustomButton>
            <CustomButton variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" onClick={() => window.location.href = "/add-recipe"}>
              <span>Share Your Recipe</span>
            </CustomButton>
          </div>
        </motion.div>

        {/* Double-layer Cloud Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[2px] z-50 pointer-events-none">
          {/* Back Layer (Semi-transparent) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-[60px] md:h-[90px] fill-current text-zinc-50/50 dark:text-zinc-950/40"
          >
            <path d="M0,100 C180,30 360,10 500,45 C640,80 780,95 920,55 C1060,15 1200,35 1200,100 L1200,100 L0,100 Z" />
          </svg>
          {/* Front Layer (Solid) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            className="relative block w-full h-[45px] md:h-[65px] fill-current text-zinc-50 dark:text-zinc-950"
          >
            <path d="M0,100 C150,20 300,20 450,60 C600,100 750,100 900,60 C1050,20 1200,20 1200,100 L1200,100 L0,100 Z" />
          </svg>
        </div>
      </ImagesSlider>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        
        {/* Categories Section */}
        <section className="mb-24">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-zinc-50 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-neutral-500 dark:text-zinc-400 mt-2">
              Find exactly what you are craving, tailored to your diet or cooking skill.
            </p>
          </div>
          <HoverEffect items={CATEGORIES} />
        </section>

        {/* Bento Grid & Featured Section */}
        <section id="recipes" className="mb-24 scroll-mt-24">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-zinc-50 tracking-tight">
              Featured & Trending
            </h2>
            <p className="text-neutral-500 dark:text-zinc-400 mt-2">
              The hottest recipes and creators chosen by our cooking community this week.
            </p>
          </div>

          <BentoGrid className="mb-8">
            {/* Grid 1: Recipe of the day (Double width) */}
            <BentoGridItem
              className="md:col-span-2 bg-gradient-to-br from-orange-500/5 to-amber-500/5 md:h-[41.5rem]"
              title="Recipe Spotlight"
              description="Our handpicked top-performing Tuscan Chicken recipe this week."
              icon={<Award className="w-6 h-6" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <RecipeCard {...FEATURED_RECIPES[0]} />
                <div className="flex flex-col justify-center space-y-4">
                  <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
                    Why We Love It
                  </span>
                  <p className="text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed">
                    This recipe combines rich, sun-dried tomatoes, fresh spinach, and tender garlic-infused chicken breasts in a creamy sauce that pairs perfectly with pasta or crusty bread. Simple enough for weeknights, but fancy enough for dinner guests!
                  </p>
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <span className="block text-2xl font-bold text-neutral-900 dark:text-zinc-100">4.9</span>
                      <span className="text-xs text-neutral-500 dark:text-zinc-400">Average Rating</span>
                    </div>
                    <div className="w-px h-8 bg-neutral-200 dark:bg-zinc-800" />
                    <div>
                      <span className="block text-2xl font-bold text-neutral-900 dark:text-zinc-100">12k+</span>
                      <span className="text-xs text-neutral-500 dark:text-zinc-400">Saves this week</span>
                    </div>
                  </div>
                </div>
              </div>
            </BentoGridItem>

            {/* Grid 2: Trending Creators */}
            <BentoGridItem
              className="md:col-span-1 md:h-[41.5rem]"
              title="Top Creators"
              description="Connect with top culinary minds."
              icon={<BookOpen className="w-6 h-6" />}
            >
              <div className="flex flex-col gap-4 mt-6">
                {CREATORS.map((creator, i) => (
                  <CreatorCard key={i} {...creator} />
                ))}
              </div>
            </BentoGridItem>

            {/* Grid 3: Active Cooks Stat */}
            <CanvasCard
              title="24.8k"
              subtitle="Active Cooks"
              icon={<Flame className="text-orange-500" />}
              className="md:col-span-1 rounded-3xl h-[12rem]"
            >
              <CanvasRevealEffect
                animationSpeed={3}
                colors={[[249, 115, 22]]}
                containerClassName="bg-orange-950/20"
              />
            </CanvasCard>

            {/* Grid 4: Saved Recipes Stat */}
            <CanvasCard
              title="105k"
              subtitle="Recipes Shared"
              icon={<BookOpen className="text-amber-500" />}
              className="md:col-span-1 rounded-3xl h-[12rem]"
            >
              <CanvasRevealEffect
                animationSpeed={3}
                colors={[[245, 158, 11]]}
                containerClassName="bg-amber-950/20"
              />
            </CanvasCard>

            {/* Grid 5: Hearts Stat */}
            <CanvasCard
              title="1.2M"
              subtitle="Happy Tummies"
              icon={<Heart className="text-red-500" />}
              className="md:col-span-1 rounded-3xl h-[12rem]"
            >
              <CanvasRevealEffect
                animationSpeed={3}
                colors={[[239, 68, 68]]}
                containerClassName="bg-red-950/20"
              />
            </CanvasCard>

            <BentoGridItem
              className="md:col-span-2 bg-gradient-to-br from-orange-500/8 via-amber-500/4 to-transparent md:h-[16rem]"
              title="Culinary Tip of the Week"
              description="Learn basic cooking techniques that level up any dish."
              icon={<Flame className="w-6 h-6" />}
            >
              <div className="flex flex-col md:flex-row gap-6 items-center mt-3">
                <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-neutral-900 dark:text-zinc-100">
                    The Art of Deglazing
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-zinc-400">
                    After searing meat, do not wash the pan! Pour in a little broth, wine, or vinegar, and scrape those delicious caramelized brown bits (the fond) off the bottom to form the foundation of an incredibly flavorful pan sauce.
                  </p>
                </div>
              </div>
            </BentoGridItem>
          </BentoGrid>

          {/* More Recipes list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            {FEATURED_RECIPES.slice(1).map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>

        {/* Newsletter / Call to Action */}
        <section className="relative rounded-3xl bg-neutral-900 dark:bg-zinc-900 border border-neutral-800 dark:border-zinc-800 p-8 md:p-12 overflow-hidden shadow-xl mb-16">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-3">
              Join Our Newsletter
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Get Fresh Recipes Weekly
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
              Sign up for our newsletter to get handpicked recipes, culinary tips, and exclusive creator updates delivered straight to your inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-neutral-800 dark:bg-zinc-800 border border-neutral-700 dark:border-zinc-700 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <CustomButton variant="glow" type="submit">
                <span>Subscribe</span>
              </CustomButton>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 backdrop-blur-md py-12 text-sm text-neutral-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-base">
              S
            </div>
            <span className="font-extrabold text-neutral-900 dark:text-zinc-100 text-lg tracking-tight">
              SavoryCircle
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <Link href="/recipes" className="hover:text-orange-500 transition-colors">Recipes</Link>
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms</Link>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <Link href="#" className="hover:text-orange-500 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
            <Link href="#" className="hover:text-orange-500 transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="#" className="hover:text-orange-500 transition-colors" aria-label="Github">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-8 border-t border-neutral-100 dark:border-zinc-900/60 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} SavoryCircle. Made with love for good food.
        </div>
      </footer>
    </div>
  );
}
