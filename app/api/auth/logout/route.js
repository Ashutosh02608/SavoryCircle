import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  clearSessionCookie,
  deleteSessionByToken,
  SESSION_COOKIE_NAME,
} from "@/features/auth/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    await deleteSessionByToken(token);
    await clearSessionCookie();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to sign out." }, { status: 500 });
  }
}

