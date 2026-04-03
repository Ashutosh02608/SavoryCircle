"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/features/homepage/data";

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

export default function AddRecipeForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: categories[0],
    difficulty: "Easy",
    cookTime: "",
    ingredients: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setForm((previous) => ({ ...previous, imageUrl: "" }));
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setIsProcessingImage(true);

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setForm((previous) => ({ ...previous, imageUrl: imageDataUrl }));
    } catch {
      setError("Unable to process image right now.");
      event.target.value = "";
    } finally {
      setIsProcessingImage(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cookTime: Number(form.cookTime),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create recipe.");
        return;
      }

      router.push(`/recipes/${data.recipeId}`);
      router.refresh();
    } catch {
      setError("Unable to create recipe right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]"
    >
      <label className="block text-sm font-semibold text-[#373b42]">
        Recipe Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#e052358c] transition focus:ring-2"
        />
      </label>

      <label className="block text-sm font-semibold text-[#373b42]">
        Short Description
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#e052358c] transition focus:ring-2"
        />
      </label>

      <label className="block text-sm font-semibold text-[#373b42]">
        Full Recipe
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          rows={6}
          className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#e052358c] transition focus:ring-2"
          placeholder="Write full recipe steps, tips, and plating notes..."
        />
      </label>

      <label className="block text-sm font-semibold text-[#373b42]">
        Recipe Image (optional)
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none"
        />
        <span className="mt-1 block text-xs text-[#6f757d]">JPG, PNG, or WebP. Max 2 MB.</span>
      </label>

      {form.imageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-[#d0ab8859] bg-white">
          <Image
            src={form.imageUrl}
            alt="Recipe preview"
            width={1200}
            height={720}
            unoptimized
            className="h-52 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-semibold text-[#373b42]">
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#e052358c] transition focus:ring-2"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-[#373b42]">
          Difficulty
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#e052358c] transition focus:ring-2"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>

        <label className="block text-sm font-semibold text-[#373b42]">
          Cook Time (mins)
          <input
            name="cookTime"
            type="number"
            min="1"
            value={form.cookTime}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#e052358c] transition focus:ring-2"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-[#373b42]">
        Ingredients (comma separated)
        <input
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm font-normal outline-none ring-[#e052358c] transition focus:ring-2"
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending || isProcessingImage}
        className="rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isProcessingImage ? "Processing image..." : isPending ? "Publishing..." : "Publish Recipe"}
      </button>
    </form>
  );
}
