import Link from "next/link";
import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import { containerClass } from "@/features/homepage/constants";
import { creators } from "@/features/homepage/data";
import { getCurrentUser } from "@/features/auth/server";

export default async function CreatorsPage() {
  const user = await getCurrentUser();

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <SiteHeader user={user} />
      <main className="py-12">
        <section className={containerClass}>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Creators</h1>
          <p className="mt-3 text-[#565b64]">Meet the cooks sharing standout recipes.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => (
              <Link
                key={creator.name}
                href={`/recipes?creator=${encodeURIComponent(creator.name)}`}
                className="rounded-2xl border border-[#dbbc9952] bg-white/90 p-4 transition hover:-translate-y-0.5"
              >
                <div className="mb-3 flex items-center gap-3">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="h-14 w-14 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#eceff3] text-sm font-extrabold text-[#31353b]">
                      {creator.initials}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold">{creator.name}</h2>
                    <p className="text-sm text-[#565b64]">{creator.role}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#373b42]">{creator.bio}</p>
                <p className="mt-3 text-xs font-bold text-[#cb3219]">{creator.followers}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
