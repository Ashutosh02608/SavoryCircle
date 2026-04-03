import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unable to fetch session." }, { status: 500 });
  }
}

