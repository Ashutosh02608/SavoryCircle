"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { RecipeCard } from "@/components/recipe-card";
import { CustomButton } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { NAV_ITEMS } from "@/lib/constants";
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Bookmark, 
  Plus, 
  ArrowLeft,
  ChevronRight,
  Flame,
  ChefHat
} from "lucide-react";

// Local catalog items copy to resolve mock bookmarks
const MOCK_RECIPES = [
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

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get("tab") : null;

  // Auth states
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [memberSince, setMemberSince] = useState("");

  // Data states
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState(tabParam === "saved-recipes" ? "saved-recipes" : "my-recipes");
  const [prevTabParam, setPrevTabParam] = useState(tabParam);

  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (tabParam === "saved-recipes" || tabParam === "my-recipes") {
      setActiveTab(tabParam);
    }
  }

  async function fetchUserData(userId) {
    setLoadingData(true);
    try {
      // 1. Fetch user published recipes
      const q = query(collection(db, "recipes"), where("userId", "==", userId));
      const mySnap = await getDocs(q);
      const myFetched = mySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyRecipes(myFetched);

      // 2. Fetch user saved recipes
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const savedIds = userData.savedRecipes || [];
        
        // Resolve bookmarks (merge custom and mock)
        const resolvedSaved = [];
        
        for (const id of savedIds) {
          // Check if mock item
          const mockItem = MOCK_RECIPES.find(item => item.id === id);
          if (mockItem) {
            resolvedSaved.push(mockItem);
          } else {
            // Fetch custom item from Firestore
            try {
              const recipeDocRef = doc(db, "recipes", id);
              const recipeDocSnap = await getDoc(recipeDocRef);
              if (recipeDocSnap.exists()) {
                resolvedSaved.push({
                  id: recipeDocSnap.id,
                  ...recipeDocSnap.data()
                });
              }
            } catch (err) {
              console.error(`Error resolving saved recipe ${id}:`, err);
            }
          }
        }
        setSavedRecipes(resolvedSaved);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
      
      if (currentUser) {
        // Fetch user metadata (e.g. member since)
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.createdAt) {
              const date = new Date(data.createdAt);
              setMemberSince(date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
              }));
            } else {
              setMemberSince("Home Cook");
            }
          }
        } catch (err) {
          console.error("Error fetching user document details:", err);
          setMemberSince("Home Cook");
        }

        // Fetch user data grids
        await fetchUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login");
    }
  }, [user, loadingUser]);

  if (loadingUser || (!user && loadingUser)) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-sm font-semibold text-neutral-500 dark:text-zinc-400">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col justify-between">
      <FloatingNav navItems={NAV_ITEMS} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 w-full flex-1">
        
        {/* Profile Card Header */}
        <section className="relative rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800 p-6 md:p-8 shadow-sm overflow-hidden mb-10 select-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* User Initials Badge */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-md border-2 border-white dark:border-zinc-800">
              {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight font-sans">
                {user.displayName || user.email.split("@")[0]}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-neutral-500 dark:text-zinc-400 font-sans">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </div>
                
                {memberSince && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Member since {memberSince}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                  <span>Home Cook</span>
                </div>
              </div>
            </div>

            {/* CTA action */}
            <CustomButton
              variant="glow"
              onClick={() => router.push("/add-recipe")}
              className="py-2.5 px-5 text-xs font-bold font-sans cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Share New Recipe</span>
            </CustomButton>
          </div>
        </section>

        {/* Tab Selection */}
        <section className="flex border-b border-neutral-200 dark:border-zinc-800 mb-8 select-none">
          <button
            onClick={() => setActiveTab("my-recipes")}
            className={`pb-3.5 px-6 text-sm font-bold border-b-2 font-sans transition-all duration-200 cursor-pointer ${
              activeTab === "my-recipes"
                ? "border-orange-500 text-orange-500 scale-102"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>My Recipes ({myRecipes.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("saved-recipes")}
            className={`pb-3.5 px-6 text-sm font-bold border-b-2 font-sans transition-all duration-200 cursor-pointer ${
              activeTab === "saved-recipes"
                ? "border-orange-500 text-orange-500 scale-102"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Saved Recipes ({savedRecipes.length})</span>
            </div>
          </button>
        </section>

        {/* Recipes Display Area */}
        <section className="min-h-[300px]">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500 dark:text-zinc-400 font-sans">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mb-2"></div>
              <p className="text-xs font-semibold">Fetching recipes data...</p>
            </div>
          ) : activeTab === "my-recipes" ? (
            myRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {myRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            ) : (
              /* Empty my recipes */
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-neutral-300 dark:border-zinc-800 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-900 dark:text-zinc-100 font-sans">
                  No Published Recipes
                </h3>
                <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-2 font-sans leading-relaxed">
                  You haven&apos;t shared any of your own recipes yet. Tap the button below to publish your first culinary masterpiece!
                </p>
                <button
                  onClick={() => router.push("/add-recipe")}
                  className="mt-5 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer font-sans"
                >
                  Share a Recipe
                </button>
              </div>
            )
          ) : savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          ) : (
            /* Empty saved recipes */
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-neutral-300 dark:border-zinc-800 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-neutral-900 dark:text-zinc-100 font-sans">
                No Saved Recipes
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-2 font-sans leading-relaxed">
                You haven&apos;t bookmarked any recipes yet. Browse our delicious catalog and save items to find them easily here.
              </p>
              <button
                onClick={() => router.push("/recipes")}
                className="mt-5 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer font-sans"
              >
                Browse Recipes
              </button>
            </div>
          )}
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

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
