import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/server";
import { createRecipeComment, listRecipeComments } from "@/features/recipes/comments";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const comments = await listRecipeComments(id);
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json(
      { error: "Unable to load comments right now." },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await request.json();

    const result = await createRecipeComment({
      recipeId: id,
      user,
      text: body?.text,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json({ comment: result.comment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to add comment right now." },
      { status: 500 }
    );
  }
}

