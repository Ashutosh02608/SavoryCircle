import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/server";
import { createRecipe, listRecipes } from "@/features/recipes/server";

function isTruthy(value) {
  if (!value) {
    return false;
  }

  return value === "1" || value.toLowerCase() === "true";
}

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "All";
    const creator = searchParams.get("creator") || "All";
    const difficulty = searchParams.get("difficulty") || "All";
    const sortBy = searchParams.get("sort") || "popular";
    const mineOnly = isTruthy(searchParams.get("mine"));
    const savedOnly = isTruthy(searchParams.get("saved"));

    const [recipes, allRecipes] = await Promise.all([
      listRecipes({
        userId: user?.id || null,
        query,
        category,
        creator,
        difficulty,
        sortBy,
        mineOnly,
        savedOnly,
      }),
      listRecipes({
        userId: user?.id || null,
        query: "",
        category: "All",
        creator: "All",
        difficulty: "All",
        sortBy: "popular",
        mineOnly: false,
        savedOnly: false,
      }),
    ]);

    const categories = [
      "All",
      ...new Set(allRecipes.map((recipe) => recipe.category).filter(Boolean)),
    ];

    const creators = [
      "All",
      ...new Set(allRecipes.map((recipe) => recipe.authorName).filter(Boolean)),
    ];

    const difficulties = [
      "All",
      ...new Set(allRecipes.map((recipe) => recipe.difficulty).filter(Boolean)),
    ];

    return NextResponse.json({ recipes, categories, creators, difficulties });
  } catch {
    return NextResponse.json(
      { error: "Unable to load recipes right now." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const payload = await request.json();
    const result = await createRecipe({
      userId: user.id,
      userName: user.name,
      payload,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json({ recipeId: result.recipeId }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create recipe right now." },
      { status: 500 }
    );
  }
}

