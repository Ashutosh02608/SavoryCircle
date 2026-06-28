"use client";
import React from "react";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { NAV_ITEMS } from "@/lib/constants";
import { Zap, ChefHat, Leaf, Heart, Cake, Sparkles, BookOpen, Utensils } from "lucide-react";

const CATEGORIES_WITH_ICONS = [
  {
    title: "Quick & Easy",
    description: "Tasty meals ready in under 30 minutes for busy weekdays.",
    link: "/recipes?category=Quick%20%26%20Easy",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: "Baking Masterclass",
    description: "From crusty sourdough boules to decadent chocolate cakes.",
    link: "/recipes?category=Baking",
    icon: <ChefHat className="w-5 h-5" />,
  },
  {
    title: "Vegan & Plant-Based",
    description: "Vibrant, nutritious, and purely delicious plant-based food.",
    link: "/recipes?category=Vegan",
    icon: <Leaf className="w-5 h-5" />,
  },
  {
    title: "Healthy Eating",
    description: "Wholesome, macro-friendly recipes to fuel your daily life.",
    link: "/recipes?category=Healthy",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    title: "Desserts & Treats",
    description: "Sweet indulgences, cookies, and pastries to satisfy your cravings.",
    link: "/recipes?category=Desserts",
    icon: <Cake className="w-5 h-5" />,
  },
  {
    title: "Gourmet Dining",
    description: "Restaurant-quality dishes to impress your dinner guests.",
    link: "/recipes?category=Gourmet",
    icon: <Sparkles className="w-5 h-5" />,
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col justify-between">
      {/* Floating Navbar */}
      <FloatingNav navItems={NAV_ITEMS} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 w-full flex-1">
        {/* Header Hero Section */}
        <section className="mb-12 text-center md:text-left relative py-8 px-6 rounded-3xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-neutral-200/40 dark:border-zinc-800/40 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold font-sans">
              <Utensils className="w-3.5 h-3.5" />
              <span>Explore Categories</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-zinc-100 font-sans leading-tight">
              Recipes by Category
            </h1>
            <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Find exactly what you are craving. Choose from our curated culinary categories to view related recipes, cooking instructions, and reviews.
            </p>
          </div>
        </section>

        {/* Hover Grid */}
        <section className="relative">
          <HoverEffect items={CATEGORIES_WITH_ICONS} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-zinc-850 bg-white dark:bg-zinc-950/80 backdrop-blur-md py-12 text-sm text-neutral-500 dark:text-zinc-400 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-base">
              S
            </div>
            <span className="font-extrabold text-neutral-900 dark:text-zinc-100 text-lg tracking-tight font-sans">
              SavoryCircle
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-orange-500 transition-colors font-sans">Home</Link>
            <Link href="/recipes" className="hover:text-orange-500 transition-colors font-sans">Recipes</Link>
            <Link href="/privacy" className="hover:text-orange-500 transition-colors font-sans">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors font-sans">Terms</Link>
          </div>

          <div className="flex items-center gap-4 text-neutral-455">
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-8 border-t border-neutral-100 dark:border-zinc-900/60 text-center text-xs text-neutral-400 font-sans">
          © {new Date().getFullYear()} SavoryCircle. Made with love for good food.
        </div>
      </footer>
    </div>
  );
}
