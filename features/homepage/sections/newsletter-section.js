"use client";

import { useState } from "react";
import { containerClass } from "@/features/homepage/constants";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("Thanks! Weekly recipe drops are on the way to your inbox.");
    setEmail("");
  }

  return (
    <section className="py-14" id="newsletter">
      <div className={containerClass}>
        <div className="grid items-center gap-4 rounded-[2rem] bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] p-6 text-white shadow-[0_18px_50px_rgba(42,28,18,0.14)] lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Get Weekly Recipe Drops
            </h2>
            <p className="mt-3 max-w-[46ch] text-[#ffe7da]">
              Join 90,000+ readers getting curated collections, chef notes, and seasonal inspiration
              every Friday.
            </p>
          </div>
          <div className="rounded-[2.2rem] border border-white/35 bg-white/15 p-2">
            <form className="grid gap-2 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="emailInput">
                Email address
              </label>
              <input
                className="rounded-full bg-white/95 px-4 py-3 text-sm text-black outline-none ring-[#e052358c] transition focus:ring-2"
                id="emailInput"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                required
              />
              <button
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5"
                type="submit"
              >
                Subscribe
              </button>
            </form>
            {message ? <p className="mt-3 text-sm font-semibold text-white">{message}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
