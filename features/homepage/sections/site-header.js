import Link from "next/link";
import ProfileMenu from "@/shared/components/profile-menu";
import BrandMark from "@/features/homepage/brand-mark";
import {
  btnBaseClass,
  brandGradientClass,
  containerClass,
  navLinks,
} from "@/features/homepage/constants";

export default function SiteHeader({ user }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#c5a58242] bg-[#fffaf1c7] backdrop-blur-xl">
      <div className={`${containerClass} relative flex min-h-[76px] items-center justify-between py-3`}>
        <Link className="inline-flex items-center gap-3 text-xl font-extrabold" href="/">
          <BrandMark />
          SavoryCircle
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-4 px-2 font-semibold text-[#27292e] min-[901px]:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="rounded-lg px-2.5 py-1.5 transition hover:bg-[#e443281f] hover:text-[#cb3219]"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-3 min-[901px]:flex">
          {user ? (
            <>
              <Link
                href="/add-recipe"
                aria-label="Add recipe"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] text-xl font-bold text-white shadow-[0_10px_24px_rgba(220,73,38,0.28)] transition hover:-translate-y-0.5"
              >
                +
              </Link>
              <ProfileMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${btnBaseClass} border border-[#d6b9989e] bg-white/80 text-[#27292e] hover:bg-white`}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={`${btnBaseClass} ${brandGradientClass} text-white shadow-[0_12px_28px_rgba(220,73,38,0.34)] hover:shadow-[0_16px_30px_rgba(198,62,31,0.38)]`}
              >
                Join free
              </Link>
            </>
          )}
        </div>

        <details className="min-[901px]:hidden">
          <summary className="list-none cursor-pointer rounded-xl border border-[#5d3e2b3d] bg-white/80 px-3 py-2 text-sm font-semibold">
            Menu
          </summary>
          <div className="absolute left-0 right-0 mt-3 grid gap-2 px-4 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-xl bg-white/80 px-3 py-2 font-semibold"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link className="rounded-xl bg-white/80 px-3 py-2 font-semibold" href="/add-recipe">
                  + Add Recipe
                </Link>
                <Link className="rounded-xl bg-white/80 px-3 py-2 font-semibold" href="/profile">
                  Profile
                </Link>
                <Link className="rounded-xl bg-white/80 px-3 py-2 font-semibold" href="/my-recipes">
                  My Recipes
                </Link>
                <Link className="rounded-xl bg-white/80 px-3 py-2 font-semibold" href="/saved-recipes">
                  Saved Recipes
                </Link>
                <Link className="rounded-xl bg-white/80 px-3 py-2 font-semibold" href="/change-password">
                  Change Password
                </Link>
              </>
            ) : null}
          </div>
        </details>
      </div>
    </header>
  );
}



