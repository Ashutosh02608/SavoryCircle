import { NextResponse } from "next/server";
import {
  createSession,
  registerUser,
  requestSignupOtp,
  setSessionCookie,
  verifySignupOtp,
} from "@/features/auth/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const action = String(body?.action || "signup");

    if (action === "request_otp") {
      const result = await requestSignupOtp(body);

      if (result.error) {
        const status = result.validationError ? 422 : result.conflict ? 409 : result.status || 400;
        return NextResponse.json(
          { error: result.error, fieldErrors: result.fieldErrors || {} },
          { status }
        );
      }

      return NextResponse.json(
        {
          message: result.message,
          expiresInSeconds: result.expiresInSeconds,
        },
        { status: 200 }
      );
    }

    if (action === "verify_otp") {
      const result = await verifySignupOtp(body);

      if (result.error) {
        const status = result.validationError ? 422 : result.conflict ? 409 : result.status || 400;
        return NextResponse.json(
          { error: result.error, fieldErrors: result.fieldErrors || {} },
          { status }
        );
      }

      const session = await createSession(result.user.id);
      await setSessionCookie(session.token, session.maxAge);

      return NextResponse.json({ user: result.user }, { status: 201 });
    }

    const result = await registerUser(body);

    if (result.error) {
      const status = result.validationError ? 422 : result.conflict ? 409 : result.status || 400;
      return NextResponse.json(
        { error: result.error, fieldErrors: result.fieldErrors || {} },
        { status }
      );
    }

    const session = await createSession(result.user.id);
    await setSessionCookie(session.token, session.maxAge);

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create account right now." },
      { status: 500 }
    );
  }
}




