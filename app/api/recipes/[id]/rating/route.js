import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/server";
import { rateRecipe } from "@/features/recipes/server";

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const payload = await request.json();

    const result = await rateRecipe({
      userId: user?.id || null,
      recipeId: id,
      value: payload?.rating,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json({
      recipe: {
        rating: result.rating,
        ratingCount: result.ratingCount,
        userRating: result.userRating,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit your rating right now." },
      { status: 500 }
    );
  }
}

