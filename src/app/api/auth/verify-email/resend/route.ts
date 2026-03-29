import { NextResponse } from "next/server";

import { issueVerificationEmail } from "@/lib/email-verification";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";

type ResendVerificationPayload = {
  email?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

function isEmailVerificationEnabled() {
  const rawValue = process.env.EMAIL_VERIFICATION_ENABLED;

  if (rawValue === undefined) {
    return true;
  }

  return ENABLED_VALUES.has(rawValue.trim().toLowerCase());
}

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

  const rateLimit = await checkRateLimit({
    policy: "authResendVerification",
    request,
    identifier: email,
  });

  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit);
  }

  if (!isEmailVerificationEnabled()) {
    return NextResponse.json(
      { error: "Email verification is currently disabled. You can sign in without verifying." },
      { status: 403 },
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
