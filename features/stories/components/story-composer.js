"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StoryComposer({ canWrite }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to publish story.");
      }

      setTitle("");
      setContent("");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || "Unable to publish story.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#dbbc9952] bg-white/90 p-5 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
      <h2 className="text-2xl font-bold">Write a Story</h2>

      {canWrite ? (
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Story title"
            minLength={3}
            maxLength={120}
            required
            className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your cooking moment, challenge, or kitchen win..."
            rows={5}
            minLength={20}
            maxLength={2000}
            required
            className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Publishing..." : "Publish Story"}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-[#565b64]">
          Sign in to write your story. <Link href="/login" className="font-semibold text-[#cb3219] hover:underline">Go to Login</Link>
        </p>
      )}
    </section>
  );
}
