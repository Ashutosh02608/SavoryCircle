"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateLoginInput } from "@/shared/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isPending, setIsPending] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validation = validateLoginInput(form);
    if (!validation.isValid) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.error);
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(data.fieldErrors || {});
        setError(data.error || "Could not sign in.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Could not sign in right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] px-6 py-14 text-[#1a1b1f]">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-extrabold">
          <span className="relative aspect-square w-8 rounded-xl bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] shadow-[0_14px_34px_rgba(34,22,15,0.09)] after:absolute after:inset-[24%_28%] after:rounded-[60%_40%_55%_45%] after:bg-white/90 after:content-['']" />
          SavoryCircle
        </Link>

        <div className="mt-8 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
          <h1 className="text-3xl font-extrabold">Welcome back</h1>
          <p className="mt-2 text-sm text-[#565b64]">
            Need an account?{" "}
            <Link href="/signup" className="font-semibold text-[#cb3219] hover:underline">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#373b42]">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
              />
              {fieldErrors.email ? (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#373b42]">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
              />
              {fieldErrors.password ? (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              ) : null}
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

