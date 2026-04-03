import Link from "next/link";
import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import { containerClass } from "@/features/homepage/constants";
import { categories } from "@/features/homepage/data";
import { getCurrentUser } from "@/features/auth/server";

export default async function CategoriesPage() {
  const user = await getCurrentUser();

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <SiteHeader user={user} />
      <main className="py-12">
        <section className={containerClass}>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Categories</h1>
          <p className="mt-3 text-[#565b64]">Browse recipe collections by category.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/recipes?category=${encodeURIComponent(category)}`}
                className="rounded-2xl border border-[#dbbc9952] bg-white/90 p-4 transition hover:-translate-y-0.5"
              >
                <h2 className="text-lg font-bold">{category}</h2>
                <p className="mt-2 text-sm text-[#565b64]">Discover top recipes and seasonal picks.</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

