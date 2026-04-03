import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/server";
import { getRecipeById } from "@/features/recipes/server";

export async function GET(_request, { params }) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    const recipe = await getRecipeById(id, user?.id || null);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch {
    return NextResponse.json(
      { error: "Unable to load this recipe right now." },
      { status: 500 }
    );
  }
}

