import Link from "next/link";
import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import { containerClass } from "@/features/homepage/constants";
import { getCurrentUser } from "@/features/auth/server";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SC";

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-20 [background-image:radial-gradient(rgba(34,29,24,0.08)_0.65px,transparent_0.65px)] [background-size:3px_3px]"
      />

      <SiteHeader user={user} />

      <main className="relative z-10 py-14">
        <section className={containerClass}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Profile</h1>
          <p className="mt-3 max-w-[60ch] text-[#565b64]">
            Your account details and quick access to your recipe collections.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
              {user ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] text-lg font-extrabold text-white">
                      {initials}
                    </div>
                    <div>
                      <p className="text-xl font-bold">{user.name}</p>
                      <p className="text-sm text-[#565b64]">{user.email}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <Link
                      href="/my-recipes"
                      className="rounded-2xl border border-[#d6b9989e] bg-white px-4 py-3 text-sm font-semibold text-[#27292e]"
                    >
                      My Recipes
                    </Link>
                    <Link
                      href="/saved-recipes"
                      className="rounded-2xl border border-[#d6b9989e] bg-white px-4 py-3 text-sm font-semibold text-[#27292e]"
                    >
                      Saved Recipes
                    </Link>
                    <Link
                      href="/recipes"
                      className="rounded-2xl border border-[#d6b9989e] bg-white px-4 py-3 text-sm font-semibold text-[#27292e]"
                    >
                      Browse Recipes
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm text-[#565b64]">
                  You are not signed in. Sign in to manage your profile and recipes.
                </p>
              )}
            </article>

            <article className="rounded-3xl border border-[#dbbc9952] bg-white/85 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
              <h2 className="text-lg font-bold">Account Snapshot</h2>
              <div className="mt-4 space-y-3 text-sm text-[#565b64]">
                <p>
                  <strong className="text-[#1a1b1f]">Status:</strong> {user ? "Active" : "Guest"}
                </p>
                <p>
                  <strong className="text-[#1a1b1f]">Role:</strong> Home Cook
                </p>
                <p>
                  <strong className="text-[#1a1b1f]">Collections:</strong> My Recipes, Saved Recipes, Password Settings
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


