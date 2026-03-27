import { NextResponse } from "next/server";

import { issueVerificationEmail } from "@/lib/email-verification";

type ResendVerificationPayload = {
  email?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: ResendVerificationPayload;

  try {
    payload = (await request.json()) as ResendVerificationPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }

  try {
    const result = await issueVerificationEmail(email, request.headers.get("origin"));

    if (!result.ok && result.reason === "already_verified") {
      return NextResponse.json(
        { error: "This email is already verified. You can sign in now." },
        { status: 409 },
      );
    }

    if (!result.ok && result.reason === "not_found") {
      return NextResponse.json(
        { error: "We could not find an account with that email." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Verification email sent." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to resend the verification email.",
      },
      { status: 500 },
    );
  }
}
