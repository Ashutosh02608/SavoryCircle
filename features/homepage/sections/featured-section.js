import Link from "next/link";
import { containerClass } from "@/features/homepage/constants";
import { listRecipes } from "@/features/recipes/server";

export default async function FeaturedSection() {
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

  const featured = allRecipes.slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-14" id="featured">
      <div className={containerClass}>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Featured Recipes</h2>
        <p className="mt-3 max-w-[60ch] text-[#565b64]">
          Fresh picks from our community this week.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="relative overflow-hidden rounded-3xl border border-[#dbbc9952] bg-white shadow-[0_14px_34px_rgba(34,22,15,0.09)] transition hover:-translate-y-2 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_20px_42px_rgba(202,79,38,0.18)]"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="aspect-[1.25] w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{recipe.title}</h3>
                <div className="my-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#42495014] px-2.5 py-1 text-[11px] text-[#373b42]">
                    {recipe.category}
                  </span>
                  <span className="rounded-full bg-[#42495014] px-2.5 py-1 text-[11px] text-[#373b42]">
                    {recipe.difficulty}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#565b64]">
                  <span>{Number(recipe.cookTime ?? 0)} min</span>
                  <span>{Number(recipe.rating ?? 0).toFixed(1)} rating</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
