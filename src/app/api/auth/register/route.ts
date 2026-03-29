import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import {
  createEmailVerificationToken,
  resolveAppUrl,
  sendVerificationEmail,
} from "@/lib/email-verification";
import { db } from "@/lib/db";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";

type RegisterPayload = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
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
  const rateLimit = await checkRateLimit({
    policy: "authRegister",
    request,
  });

  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit);
  }

  let payload: RegisterPayload;

  try {
    payload = (await request.json()) as RegisterPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password =
    typeof payload.password === "string" ? payload.password : "";
  const confirmPassword =
    typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "Name, email, password, and confirmPassword are required." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match." },
      { status: 400 },
    );
  }

  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "A user with that email already exists." },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const emailVerificationEnabled = isEmailVerificationEnabled();

  const user = await db.user.create({
    data: {
      name,
      email,
      emailVerified: emailVerificationEnabled ? null : new Date(),
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (emailVerificationEnabled) {
    try {
      const { rawToken } = await createEmailVerificationToken(email);
      const verificationUrl = new URL("/verify-email", resolveAppUrl(request.headers.get("origin")));

      verificationUrl.searchParams.set("email", email);
      verificationUrl.searchParams.set("token", rawToken);

      await sendVerificationEmail({
        email,
        name,
        verificationUrl: verificationUrl.toString(),
      });
    } catch (error) {
      await db.verificationToken.deleteMany({
        where: { identifier: email },
      });
      await db.user.delete({
        where: { id: user.id },
      });

      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unable to send the verification email.",
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    {
      message: emailVerificationEnabled
        ? "User registered successfully. Please verify your email."
        : "User registered successfully. You can sign in now.",
      requiresEmailVerification: emailVerificationEnabled,
      user,
    },
    { status: 201 },
  );
}
