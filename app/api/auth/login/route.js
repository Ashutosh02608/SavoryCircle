import { NextResponse } from "next/server";
import { createSession, loginUser, setSessionCookie } from "@/features/auth/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await loginUser(body);

    if (result.error) {
      const status = result.validationError ? 422 : 401;
      return NextResponse.json(
        { error: result.error, fieldErrors: result.fieldErrors || {} },
        { status }
      );
    }

    const session = await createSession(result.user.id);
    await setSessionCookie(session.token, session.maxAge);

    return NextResponse.json({ user: result.user });
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in right now." },
      { status: 500 }
    );
  }
}

