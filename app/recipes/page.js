"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { RecipeCard } from "@/components/recipe-card";
import { NAV_ITEMS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, X, BookOpen, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Expand recipes list to make catalog feel fully featured
const ALL_RECIPES = [
  {
    id: "r1",
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    category: "Gourmet",
    cookTime: "35 mins",
    rating: 4.9,
    author: "Chef Isabella",
  },
  {
    id: "r2",
    title: "Artisanal Sourdough Bread",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800",
    category: "Baking",
    cookTime: "24 hrs",
    rating: 4.8,
    author: "BakeMaster Sam",
  },
  {
    id: "r3",
    title: "Spicy Peanut Sesame Noodles",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    category: "Quick & Easy",
    cookTime: "15 mins",
    rating: 4.7,
    author: "Elena Rostova",
  },
  {
    id: "r4",
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
    category: "Gourmet",
    cookTime: "25 mins",
    rating: 4.9,
    author: "Chef Isabella",
  },
  {
    id: "r5",
    title: "Decadent Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800",
    category: "Desserts",
    cookTime: "20 mins",
    rating: 4.8,
    author: "Alex Boulud",
  },
  {
    id: "r6",
    title: "Crunchy Avocado Chickpea Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    category: "Vegan",
    cookTime: "10 mins",
    rating: 4.6,
    author: "Sarah Green",
  },
  {
    id: "r7",
    title: "Vibrant Berry Protein Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
    category: "Healthy",
    cookTime: "5 mins",
    rating: 4.7,
    author: "Sarah Green",
  },
  {
    id: "r8",
    title: "Crispy Garlic Baked Salmon",
    image: "https://images.unsplash.com/photo-1485921325814-dae248b761b7?auto=format&fit=crop&q=80&w=800",
    category: "Healthy",
    cookTime: "22 mins",
    rating: 4.9,
    author: "Chef Isabella",
  }
];

const FILTER_CATEGORIES = [
  "All",
  "Quick & Easy",
  "Baking",
  "Vegan",
  "Healthy",
  "Desserts",
  "Gourmet"
];

function RecipesPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const categoryParam = searchParams.get("category");
  const getInitialCategory = () => {
    if (!categoryParam) return "All";
    const lowerCat = categoryParam.toLowerCase();
    if (lowerCat.includes("gourmet")) return "Gourmet";
    if (lowerCat.includes("baking")) return "Baking";
    if (lowerCat.includes("vegan") || lowerCat.includes("plant")) return "Vegan";
    if (lowerCat.includes("healthy")) return "Healthy";
    if (lowerCat.includes("dessert") || lowerCat.includes("treat")) return "Desserts";
    if (lowerCat.includes("quick") || lowerCat.includes("easy")) return "Quick & Easy";
    return "All";
  };

  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory);
  const [prevCategoryParam, setPrevCategoryParam] = useState(categoryParam);
  const [dbRecipes, setDbRecipes] = useState([]);

  if (categoryParam !== prevCategoryParam) {
    setPrevCategoryParam(categoryParam);
    if (categoryParam) {
      const lowerCat = categoryParam.toLowerCase();
      if (lowerCat.includes("gourmet")) setSelectedCategory("Gourmet");
      else if (lowerCat.includes("baking")) setSelectedCategory("Baking");
      else if (lowerCat.includes("vegan") || lowerCat.includes("plant")) setSelectedCategory("Vegan");
      else if (lowerCat.includes("healthy")) setSelectedCategory("Healthy");
      else if (lowerCat.includes("dessert") || lowerCat.includes("treat")) setSelectedCategory("Desserts");
      else if (lowerCat.includes("quick") || lowerCat.includes("easy")) setSelectedCategory("Quick & Easy");
      else setSelectedCategory("All");
    } else {
      setSelectedCategory("All");
    }
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbRecipes(fetched);
      } catch (err) {
        console.error("Error fetching recipes from Firestore:", err);
      }
    };
    fetchRecipes();
  }, []);

  // Combined local & database recipes
  const allCombinedRecipes = useMemo(() => {
    return [...dbRecipes, ...ALL_RECIPES];
  }, [dbRecipes]);

  // Filtering & Sorting Logic
  const filteredRecipes = useMemo(() => {
    // 1. Filter
    const filtered = allCombinedRecipes.filter((recipe) => {
      const matchesCategory =
        selectedCategory === "All" || recipe.category === selectedCategory;
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.author && recipe.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      }
      if (sortBy === "cookTime") {
        const parseCookTime = (timeStr) => {
          if (!timeStr) return 9999;
          const lower = timeStr.toLowerCase();
          const num = parseFloat(lower) || 0;
          if (lower.includes("hour") || lower.includes("hr")) {
            return num * 60;
          }
          return num;
        };
        return parseCookTime(a.cookTime) - parseCookTime(b.cookTime);
      }
      // Default: 'latest'
      const getSortTime = (r) => {
        if (r.createdAt) return new Date(r.createdAt).getTime();
        if (r.id && typeof r.id === "string" && r.id.startsWith("r")) {
          const num = parseInt(r.id.slice(1), 10) || 0;
          return num * 10000;
        }
        return 0;
      };
      return getSortTime(b) - getSortTime(a);
    });
  }, [searchQuery, selectedCategory, allCombinedRecipes, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("latest");
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
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>SavoryCircle Catalog</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-zinc-100 font-sans leading-tight">
              Discover & Filter Recipes
            </h1>
            <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Explore our handpicked collection of delectable meals. Filter by category or search by keywords to find the perfect dish for your kitchen today.
            </p>
          </div>
        </section>

        {/* Filter Controls (Search + Categories) */}
        <section className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md select-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search recipe, author, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 text-neutral-800 dark:text-zinc-100 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-450 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 select-none justify-between md:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-neutral-450 dark:text-zinc-550 uppercase tracking-wider font-sans whitespace-nowrap">
                  Sort By:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 rounded-full pl-4 pr-9 py-2 text-xs font-bold text-neutral-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500 transition-all font-sans cursor-pointer shadow-sm select-none"
                  >
                    <option value="latest">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="cookTime">Prep Time</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-450 dark:text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Total Results */}
              <div className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 font-sans bg-neutral-100 dark:bg-zinc-900/60 border border-neutral-200/30 dark:border-zinc-800/40 px-3.5 py-2 rounded-full shrink-0">
                {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
              </div>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 select-none">
            {FILTER_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10 scale-102"
                      : "bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 text-neutral-600 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* Recipes Catalog Grid */}
        <section className="relative">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.length > 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredRecipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <RecipeCard {...recipe} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* No Results State */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl border border-dashed border-neutral-300 dark:border-zinc-800 max-w-xl mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-6">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-xl text-neutral-900 dark:text-zinc-100 font-sans">
                  No Recipes Found
                </h3>
                <p className="text-sm text-neutral-500 dark:text-zinc-400 mt-2 font-sans leading-relaxed">
                  We couldn&apos;t find any recipes matching your query for <span className="font-bold text-orange-500">&ldquo;{searchQuery || selectedCategory}&rdquo;</span>. Try adjusting your spelling or reset the filter settings.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
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
            <Link href="/recipes" className="text-orange-500 font-semibold font-sans">Recipes</Link>
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

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-neutral-500 dark:text-zinc-400 font-sans">
        Loading catalog...
      </div>
    }>
      <RecipesPageContent />
    </Suspense>
  );
}
