import Link from "next/link";
import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import { containerClass } from "@/features/homepage/constants";
import AddRecipeForm from "@/features/recipes/components/add-recipe-form";
import { getCurrentUser } from "@/features/auth/server";

export default async function AddRecipePage() {
  const user = await getCurrentUser();

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-20 [background-image:radial-gradient(rgba(34,29,24,0.08)_0.65px,transparent_0.65px)] [background-size:3px_3px]"
      />

      <SiteHeader user={user} />

      <main className="relative z-10 py-12">
        <section className={containerClass}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Share Your Recipe</h1>
          <p className="mt-3 max-w-[60ch] text-[#565b64]">
            Add a full recipe with ingredients and step-by-step instructions.
          </p>

          {user ? (
            <AddRecipeForm />
          ) : (
            <div className="mt-8 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
              <p className="text-sm text-[#565b64]">
                You need to sign in before publishing a recipe.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-5 py-3 text-sm font-bold text-white"
              >
                Go to Login
              </Link>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

