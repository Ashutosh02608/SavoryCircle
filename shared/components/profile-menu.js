"use client";

import Link from "next/link";
import LogoutButton from "@/shared/components/logout-button";

export default function ProfileMenu({ user }) {
  return (
    <details className="group relative">
      <summary className="list-none cursor-pointer rounded-full border border-[#c2a1848c] bg-white/80 px-3 py-2 text-xs font-bold text-[#27292e]">
        {user.name}
      </summary>

      <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-[#dbbc9952] bg-white p-2 shadow-[0_14px_34px_rgba(34,22,15,0.12)]">
        <Link
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#27292e] hover:bg-[#e4432812]"
          href="/profile"
        >
          Profile
        </Link>
        <Link
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#27292e] hover:bg-[#e4432812]"
          href="/my-recipes"
        >
          My Recipes
        </Link>
        <Link
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#27292e] hover:bg-[#e4432812]"
          href="/saved-recipes"
        >
          Saved Recipes
        </Link>
        <Link
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#27292e] hover:bg-[#e4432812]"
          href="/change-password"
        >
          Change Password
        </Link>
        <div className="mt-2 border-t border-[#dbbc9952] pt-2">
          <LogoutButton
            fullWidth
            className="rounded-xl bg-[#1a1b1f] py-2 text-xs hover:bg-[#2b2d33]"
          />
        </div>
      </div>
    </details>
  );
}
