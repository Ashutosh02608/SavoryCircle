import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/server";
import { createStory, listStories } from "@/features/stories/server";

export async function GET() {
  try {
    const stories = await listStories({ limit: 30 });
    return NextResponse.json({ stories });
  } catch {
    return NextResponse.json({ error: "Unable to load stories right now." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    const payload = await request.json();

    const result = await createStory({ user, payload });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json({ story: result.story }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to post story right now." }, { status: 500 });
  }
}
