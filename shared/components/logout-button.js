"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ className = "", fullWidth = false }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={`${fullWidth ? "w-full" : ""} rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
