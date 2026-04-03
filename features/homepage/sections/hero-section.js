import Link from "next/link";
import {
  btnBaseClass,
  brandGradientClass,
  containerClass,
} from "@/features/homepage/constants";
import { listRecipes } from "@/features/recipes/server";

export default async function HeroSection() {
  const allRecipes = await listRecipes({
    userId: null,
    query: "",
    category: "All",
    creator: "All",
    difficulty: "All",
    sortBy: "popular",
    mineOnly: false,
    savedOnly: false,
  });

  const spotlight = allRecipes[0] || null;
  const spotlightHref = spotlight ? `/recipes/${spotlight.id}` : "/recipes";
  const spotlightTitle = spotlight?.title || "Share your next kitchen favorite";
  const spotlightAuthor = spotlight?.authorName || "SavoryCircle Community";
  const spotlightImage = spotlight?.imageUrl || "https://loremflickr.com/1000/1067/food,recipe";

  return (
    <section className="overflow-clip py-16">
      <div className={`${containerClass} grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]`}>
        <div>
          <h1 className="max-w-[18ch] text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            Discover, cook, and share recipes that{" "}
            <span className={`${brandGradientClass} bg-clip-text text-transparent`}>
              bring people together.
            </span>
          </h1>
          <p className="mt-4 max-w-[54ch] text-base text-[#565b64] sm:text-lg">
            From five-minute weekday dinners to celebration feasts, SavoryCircle connects home
            cooks and food creators through irresistible recipes and warm kitchen stories.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/recipes" className={`${btnBaseClass} ${brandGradientClass} text-white`}>
              Explore Recipes
            </Link>
            <Link
              href="/add-recipe"
              className={`${btnBaseClass} border border-[#d6b9989e] bg-white/80 text-[#27292e] hover:bg-white`}
            >
              Share Your Recipe
            </Link>
          </div>
        </div>

        <Link
          href={spotlightHref}
          className="rotate-[-2deg] overflow-hidden rounded-[2rem] border border-[#d6b19461] bg-white shadow-[0_18px_50px_rgba(42,28,18,0.14)]"
        >
          <img
            src={spotlightImage}
            alt={spotlightTitle}
            className="aspect-[3/3.2] w-full object-cover"
          />
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <strong>{spotlightTitle}</strong>
              <div className="text-sm text-[#646a73]">By {spotlightAuthor}</div>
            </div>
            <span className="inline-flex items-center rounded-full bg-[#e4432824] px-3 py-1 text-xs font-bold text-[#cb3219]">
              Spotlight
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
