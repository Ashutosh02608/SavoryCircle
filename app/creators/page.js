"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { NAV_ITEMS } from "@/lib/constants";
import { motion } from "framer-motion";
import { Users, BookOpen, Flame, ArrowRight, Heart, Award } from "lucide-react";

const CREATORS_LIST = [
  {
    id: "c1",
    name: "Chef Isabella",
    specialty: "Gourmet Specialist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    banner: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400",
    recipesCount: 48,
    rawFollowers: 15400,
    bio: "Passionate about creating modern twists on classic European dishes. Fine dining should be accessible to all home cooks.",
    signatureRecipe: {
      id: "r1",
      title: "Creamy Tuscan Garlic Chicken",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300"
    }
  },
  {
    id: "c2",
    name: "BakeMaster Sam",
    specialty: "Sourdough Artisan",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    banner: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    recipesCount: 35,
    rawFollowers: 12100,
    bio: "Baking sourdough starter is therapeutic. Let me guide you to the perfect golden crust, airy crumb, and crunchy ear.",
    signatureRecipe: {
      id: "r2",
      title: "Artisanal Sourdough Bread",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=300"
    }
  },
  {
    id: "c3",
    name: "Elena Rostova",
    specialty: "Quick Meals Specialist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    banner: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400",
    recipesCount: 62,
    rawFollowers: 18900,
    bio: "Creating high-flavor, low-stress dishes in 30 minutes or less. Busy lifestyles shouldn't compromise healthy, tasty eating.",
    signatureRecipe: {
      id: "r3",
      title: "Spicy Peanut Sesame Noodles",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300"
    }
  },
  {
    id: "c4",
    name: "Chef Marcus",
    specialty: "Italian Cuisine Specialist",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150",
    banner: "https://images.unsplash.com/photo-1534080391025-4f3da8341a3f?auto=format&fit=crop&q=80&w=400",
    recipesCount: 142,
    rawFollowers: 25200,
    bio: "Tracing traditional Italian recipes from Rome to Florence. Heavy focus on homemade pasta, raw sauces, and wood-fired ovens.",
    signatureRecipe: {
      id: "r4",
      title: "Classic Margherita Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300"
    }
  },
  {
    id: "c5",
    name: "Sarah Green",
    specialty: "Plant-Based Innovator",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    banner: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    recipesCount: 89,
    rawFollowers: 14600,
    bio: "Unleashing the magic of fresh vegetables. Dedicated to vibrant, satisfying, and completely plant-based nutrition for all.",
    signatureRecipe: {
      id: "r6",
      title: "Avocado Chickpea Salad",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300"
    }
  },
  {
    id: "c6",
    name: "Alex Boulud",
    specialty: "French Pastry Specialist",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    banner: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
    recipesCount: 65,
    rawFollowers: 9800,
    bio: "Trained in classical Parisian pastry techniques. Crafting soufflés, tarts, and molten hot cakes with precise formulas.",
    signatureRecipe: {
      id: "r5",
      title: "Decadent Chocolate Lava Cake",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=300"
    }
  }
];

export default function CreatorsPage() {
  const [followingState, setFollowingState] = useState({});

  const toggleFollow = (creatorId) => {
    setFollowingState((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId]
    }));
  };

  const formatFollowers = (rawCount, isFollowing) => {
    const finalCount = isFollowing ? rawCount + 1 : rawCount;
    return (finalCount / 1000).toFixed(1) + "k";
  };

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
              <Award className="w-3.5 h-3.5" />
              <span>SavoryCircle Masters</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-zinc-100 font-sans leading-tight">
              Meet Our Culinary Creators
            </h1>
            <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Connect with talented home cooks, pastry chefs, sourdough masters, and vegetarian innovators sharing their signature recipes and kitchen secrets.
            </p>
          </div>
        </section>

        {/* Creators Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {CREATORS_LIST.map((creator) => {
            const isFollowing = !!followingState[creator.id];
            return (
              <div
                key={creator.id}
                className="rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Banner & Avatar Container */}
                <div className="relative h-28 w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800 select-none">
                  <img
                    src={creator.banner}
                    alt={`${creator.name} banner`}
                    className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900 shadow-md">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 pt-10 flex flex-col flex-1 gap-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-neutral-900 dark:text-zinc-50 font-sans">
                      {creator.name}
                    </h3>
                    <span className="text-xs font-semibold text-orange-500 font-sans">
                      {creator.specialty}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed font-sans flex-1">
                    &ldquo;{creator.bio}&rdquo;
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-neutral-100 dark:border-zinc-800/80 my-1 select-none">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-neutral-400 dark:text-zinc-550" />
                      <div>
                        <span className="block text-[10px] text-neutral-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-sans">
                          Recipes
                        </span>
                        <span className="text-sm font-black text-neutral-800 dark:text-zinc-200 font-sans">
                          {creator.recipesCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-400 dark:text-zinc-550" />
                      <div>
                        <span className="block text-[10px] text-neutral-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-sans">
                          Followers
                        </span>
                        <span className="text-sm font-black text-neutral-850 dark:text-zinc-200 font-sans">
                          {formatFollowers(creator.rawFollowers, isFollowing)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nested Signature Recipe Link */}
                  <div className="bg-neutral-50 dark:bg-zinc-850/30 rounded-2xl p-3 border border-neutral-150/15 dark:border-zinc-800/40 select-none">
                    <span className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-sans">
                      Signature Recipe
                    </span>
                    <Link
                      href={`/recipes/${creator.signatureRecipe.id}`}
                      className="flex items-center gap-3 group/recipe cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-neutral-150">
                        <img
                          src={creator.signatureRecipe.image}
                          alt={creator.signatureRecipe.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-neutral-800 dark:text-zinc-250 truncate group-hover/recipe:text-orange-500 transition-colors font-sans">
                          {creator.signatureRecipe.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 dark:text-zinc-550 flex items-center gap-1 font-sans">
                          View details <ArrowRight className="w-2.5 h-2.5 group-hover/recipe:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`w-full py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.97] font-sans ${
                      isFollowing
                        ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-orange-500/10"
                        : "bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-300"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow Chef"}
                  </button>
                </div>
              </div>
            );
          })}
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
