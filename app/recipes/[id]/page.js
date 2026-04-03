import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import RecipeComments from "@/features/recipes/components/recipe-comments";
import RecipeRating from "@/features/recipes/components/recipe-rating";
import { containerClass } from "@/features/homepage/constants";
import { getCurrentUser } from "@/features/auth/server";
import { getRecipeById } from "@/features/recipes/server";

export default async function RecipeDetailPage({ params }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const recipe = await getRecipeById(id, user?.id || null);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-20 [background-image:radial-gradient(rgba(34,29,24,0.08)_0.65px,transparent_0.65px)] [background-size:3px_3px]"
      />

      <SiteHeader user={user} />

      <main className="relative z-10 py-12">
        <article className={containerClass}>
          <div className="flex flex-wrap items-start gap-3">
            <Link
              href="/recipes"
              className="inline-flex items-center rounded-full border border-[#d6b9989e] bg-white/80 px-4 py-2 text-sm font-semibold text-[#373b42] transition hover:bg-white"
            >
              Back to Recipes
            </Link>
          </div>

          <p className="mt-5 text-sm font-semibold text-[#cb3219]">{recipe.category}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{recipe.title}</h1>
          <p className="mt-2 text-sm font-semibold text-[#4f5560]">By {recipe.authorName}</p>
          <p className="mt-3 max-w-[70ch] text-lg text-[#565b64]">{recipe.description}</p>

          {recipe.imageUrl ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-[#dbbc9952] bg-white/90 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={1400}
                height={840}
                unoptimized
                className="h-[280px] w-full object-cover sm:h-[360px]"
              />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#373b42]">
            <span className="rounded-full bg-white/90 px-3 py-1.5">{recipe.cookTime} min</span>
            <span className="rounded-full bg-white/90 px-3 py-1.5">{recipe.difficulty}</span>
          </div>

          <section className="mt-8 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
            <h2 className="text-2xl font-bold">Ingredients</h2>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-[#373b42]">
              {recipe.ingredients.map((item, index) => (
                <li key={`${item}-${index}`}> {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
            <h2 className="text-2xl font-bold">Full Recipe</h2>
            <p className="mt-4 whitespace-pre-line leading-7 text-[#373b42]">{recipe.content}</p>
          </section>

          <RecipeRating
            recipeId={recipe.id}
            canRate={Boolean(user)}
            initialRating={recipe.rating}
            initialRatingCount={recipe.ratingCount}
            initialUserRating={recipe.userRating}
          />

          <RecipeComments recipeId={recipe.id} canComment={Boolean(user)} />
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}




