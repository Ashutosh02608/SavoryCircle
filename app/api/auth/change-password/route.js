import { NextResponse } from "next/server";
import { changeUserPassword, getCurrentUser } from "@/features/auth/server";

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const body = await request.json();
    const result = await changeUserPassword({ userId: user.id, payload: body });

    if (result.error) {
      const status = result.validationError ? 422 : result.status || 400;
      return NextResponse.json(
        { error: result.error, fieldErrors: result.fieldErrors || {} },
        { status }
      );
    }

    return NextResponse.json({ message: "Password updated successfully." });
  } catch {
    return NextResponse.json(
      { error: "Unable to update password right now." },
      { status: 500 }
    );
  }
}
