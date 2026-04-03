"use client";

import { useEffect, useState } from "react";

export default function RecipeComments({ recipeId, canComment }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadComments() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/recipes/${recipeId}/comments`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load comments.");
        }

        if (active) {
          setComments(data.comments || []);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load comments.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      active = false;
    };
  }, [recipeId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/recipes/${recipeId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to post comment.");
      }

      setComments((previous) => [data.comment, ...previous]);
      setText("");
    } catch (requestError) {
      setError(requestError.message || "Unable to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
      <h2 className="text-2xl font-bold">Comments</h2>

      {canComment ? (
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Share your thoughts about this recipe..."
            rows={3}
            required
            className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-[#565b64]">Sign in to add a comment.</p>
      )}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-5 space-y-3">
        {isLoading ? <p className="text-sm text-[#565b64]">Loading comments...</p> : null}
        {!isLoading && comments.length === 0 ? (
          <p className="text-sm text-[#565b64]">No comments yet. Be the first to comment.</p>
        ) : null}
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-2xl border border-[#dbbc9952] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm">{comment.authorName}</strong>
              <span className="text-xs text-[#6f757d]">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#373b42]">{comment.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
