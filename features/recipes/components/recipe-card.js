"use client";

import { Bookmark, Star, Clock } from "lucide-react";

export default function RecipeCard({
  recipe,
  onOpen,
  onToggleSaved,
  isSaving = false,
  canSave = false,
}) {
  return (
    <article
      onClick={onOpen}
      className="w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:shadow-xl"
    >
      <div className="relative">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="h-52 w-full object-cover" />
        ) : (
          <div className="h-52 w-full bg-[linear-gradient(130deg,#ffe4c7,#ffd8c8_52%,#e8f4da)]" />
        )}

        <button
          type="button"
          onClick={(event) => onToggleSaved(event, recipe.id)}
          disabled={isSaving || !canSave}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={recipe.isSaved ? "Unsave recipe" : "Save recipe"}
        >
          <Bookmark
            className={`h-5 w-5 ${recipe.isSaved ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{Number(recipe.cookTime ?? 0)} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{Number(recipe.rating ?? 0).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
