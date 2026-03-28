import { issuePasswordReset } from "@/lib/password-reset";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Invalid email address." },
        { status: 400 }
      );
    }

    // We intentionally don't return whether the user was found to prevent email enumeration.
    await issuePasswordReset(email, req.headers.get("origin"));

    return NextResponse.json(
      { message: "If that email is registered, we've sent a password reset link." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Forgot Password Error]", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
