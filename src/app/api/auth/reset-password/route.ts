import { resetUserPassword } from "@/lib/password-reset";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rateLimit = await checkRateLimit({
      policy: "authResetPassword",
      request: req,
    });

    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit);
    }

    const { email, token, password } = await req.json();

    if (!email || typeof email !== "string" || !token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Invalid request. Missing email or token." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const result = await resetUserPassword(email, token, password);

    if (result === "invalid") {
      return NextResponse.json(
        { message: "Invalid or already used token." },
        { status: 400 }
      );
    }

    if (result === "expired") {
      return NextResponse.json(
        { message: "Your password reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Your password has been reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Reset Password Error]", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
