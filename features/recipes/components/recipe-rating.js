"use client";

import { useState } from "react";

export default function RecipeRating({
  recipeId,
  canRate,
  initialRating,
  initialRatingCount,
  initialUserRating,
}) {
  const [rating, setRating] = useState(Number(initialRating ?? 0));
  const [ratingCount, setRatingCount] = useState(Number(initialRatingCount ?? 0));
  const [userRating, setUserRating] = useState(
    typeof initialUserRating === "number" ? initialUserRating : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submitRating(value) {
    if (!canRate) {
      setError("Sign in to rate this recipe.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/recipes/${recipeId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit rating.");
      }

      setRating(Number(data.recipe?.rating ?? 0));
      setRatingCount(Number(data.recipe?.ratingCount ?? 0));
      setUserRating(Number(data.recipe?.userRating ?? value));
    } catch (requestError) {
      setError(requestError.message || "Unable to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
      <h2 className="text-2xl font-bold">Rate This Recipe</h2>
      <p className="mt-2 text-sm text-[#565b64]">
        Average {rating.toFixed(1)} / 5 from {ratingCount} rating{ratingCount === 1 ? "" : "s"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((value) => {
          const isSelected = userRating === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => submitRating(value)}
              disabled={isSubmitting}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                isSelected
                  ? "border-[#e44328b3] bg-[#e443281a] text-[#cb3219]"
                  : "border-[#d6b9989e] bg-white/80 text-[#373b42]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {value}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-[#565b64]">
        {canRate
          ? userRating
            ? `Your rating: ${userRating} / 5`
            : "Select a score from 1 to 5."
          : "Sign in to submit a rating."}
      </p>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
