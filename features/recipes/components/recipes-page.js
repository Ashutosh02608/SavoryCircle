"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { containerClass } from "@/features/homepage/constants";
import { categories as homeCategories } from "@/features/homepage/data";
import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import { sortOptions } from "@/features/recipes/components/data";
import RecipeCard from "@/features/recipes/components/recipe-card";

const CATEGORY_FALLBACK = ["All", ...homeCategories];

export default function RecipesPage({
  user,
  initialQuery = "",
  initialCategory = "All",
  initialSavedOnly = false,
  initialMineOnly = false,
  pageTitle = "Recipes",
  pageDescription = "Search, sort, and filter recipes to find exactly what you want to cook.",
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("popular");
  const [category, setCategory] = useState(initialCategory || "All");
  const [difficulty, setDifficulty] = useState("All");
  const [savedOnly, setSavedOnly] = useState(initialSavedOnly);
  const [mineOnly, setMineOnly] = useState(initialMineOnly);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState(CATEGORY_FALLBACK);
  const [difficulties, setDifficulties] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savingIds, setSavingIds] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadRecipes() {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (query.trim()) {
          params.set("q", query.trim());
        }

        if (category !== "All") {
          params.set("category", category);
        }

        if (difficulty !== "All") {
          params.set("difficulty", difficulty);
        }

        params.set("sort", sortBy);

        if (mineOnly) {
          params.set("mine", "1");
        }

        if (savedOnly) {
          params.set("saved", "1");
        }

        const response = await fetch(`/api/recipes?${params.toString()}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load recipes.");
        }

        if (!active) {
          return;
        }

        const apiCategories = (data.categories || []).filter(Boolean);
        const nextCategories = apiCategories.length > 1 ? apiCategories : CATEGORY_FALLBACK;
        const nextDifficulties = data.difficulties || ["All"];

        setRecipes(data.recipes || []);
        setCategories(nextCategories);
        setDifficulties(nextDifficulties);

        if (!nextCategories.includes(category)) {
          setCategory("All");
        }

        if (!nextDifficulties.includes(difficulty)) {
          setDifficulty("All");
        }
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(requestError.message || "Unable to load recipes.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      active = false;
    };
  }, [query, sortBy, category, difficulty, mineOnly, savedOnly]);

  const savingSet = useMemo(() => new Set(savingIds), [savingIds]);

  async function handleToggleSaved(event, recipeId) {
    event.stopPropagation();
    setSaveError("");
    setSavingIds((previous) => [...previous, recipeId]);

    try {
      const response = await fetch(`/api/recipes/${recipeId}/save`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save recipe.");
      }

      setRecipes((previous) => {
        const updated = previous.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, isSaved: data.saved } : recipe
        );

        if (savedOnly && !data.saved) {
          return updated.filter((recipe) => recipe.id !== recipeId);
        }

        return updated;
      });
    } catch (requestError) {
      setSaveError(requestError.message || "Unable to save recipe.");
    } finally {
      setSavingIds((previous) => previous.filter((id) => id !== recipeId));
    }
  }

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-20 [background-image:radial-gradient(rgba(34,29,24,0.08)_0.65px,transparent_0.65px)] [background-size:3px_3px]"
      />

      <SiteHeader user={user} />

      <main className="relative z-10 py-12">
        <section className={containerClass}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{pageTitle}</h1>
              <p className="mt-3 max-w-[60ch] text-[#565b64]">{pageDescription}</p>
            </div>
            <Link
              href={user ? "/add-recipe" : "/login"}
              className="inline-flex rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Add Recipe
            </Link>
          </div>

          <div className="mt-8 grid gap-3 rounded-3xl border border-[#dbbc9952] bg-white/80 p-4 shadow-[0_14px_34px_rgba(34,22,15,0.09)] md:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-semibold text-[#373b42]">
              Search
              <input
                className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 font-normal text-[#1a1b1f] outline-none ring-[#e052358c] transition focus:ring-2"
                placeholder="Try garlic, pizza, tofu..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <label className="text-sm font-semibold text-[#373b42]">
              Sort
              <select
                className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 font-normal text-[#1a1b1f] outline-none ring-[#e052358c] transition focus:ring-2"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-[#373b42]">
              Category
              <select
                className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 font-normal text-[#1a1b1f] outline-none ring-[#e052358c] transition focus:ring-2"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-[#373b42]">
              Difficulty
              <select
                className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 font-normal text-[#1a1b1f] outline-none ring-[#e052358c] transition focus:ring-2"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                {difficulties.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMineOnly((value) => !value)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                mineOnly
                  ? "border-[#47a467aa] bg-[#47a46722] text-[#2e8850]"
                  : "border-[#d6b9989e] bg-white/70 text-[#373b42]"
              }`}
            >
              {mineOnly ? "Showing My Recipes" : "My Recipes"}
            </button>
            <button
              type="button"
              onClick={() => setSavedOnly((value) => !value)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                savedOnly
                  ? "border-[#e44328b3] bg-[#e443281a] text-[#cb3219]"
                  : "border-[#d6b9989e] bg-white/70 text-[#373b42]"
              }`}
            >
              {savedOnly ? "Showing Saved" : "Saved Recipes"}
            </button>
          </div>

          {saveError ? <p className="mt-3 text-sm text-red-600">{saveError}</p> : null}
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          <p className="mt-4 text-sm font-semibold text-[#565b64]">
            {isLoading ? "Loading recipes..." : `${recipes.length} recipe${recipes.length === 1 ? "" : "s"} found`}
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const isSaving = savingSet.has(recipe.id);

              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaving={isSaving}
                  canSave={Boolean(user)}
                  onOpen={() => router.push(`/recipes/${recipe.id}`)}
                  onToggleSaved={handleToggleSaved}
                />
              );
            })}
          </div>

          {!isLoading && recipes.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[#d6b9989e] bg-white/70 p-6 text-center text-[#565b64]">
              No recipes match your filters.
            </div>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}




