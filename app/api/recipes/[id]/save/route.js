import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/server";
import { toggleSavedRecipe } from "@/features/recipes/server";

export async function POST(_request, { params }) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    const result = await toggleSavedRecipe({
      userId: user?.id || null,
      recipeId: id,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json({ saved: result.saved });
  } catch {
    return NextResponse.json(
      { error: "Unable to update saved recipe right now." },
      { status: 500 }
    );
  }
}

