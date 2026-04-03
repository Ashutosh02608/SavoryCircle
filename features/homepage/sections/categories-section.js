import Link from "next/link";
import { containerClass } from "@/features/homepage/constants";
import { categories } from "@/features/homepage/data";

export default function CategoriesSection() {
  return (
    <section className="py-14" id="categories">
      <div className={containerClass}>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Browse Categories</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              className="rounded-full border border-[#bb9b7c5c] bg-white/70 px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#e44328b3] hover:text-[#cb3219]"
              href={`/recipes?category=${encodeURIComponent(category)}`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
