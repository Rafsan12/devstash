import { createHash, randomBytes } from "node:crypto";

import { db } from "@/lib/db";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

type SendVerificationEmailInput = {
  email: string;
  name: string;
  verificationUrl: string;
};

type VerificationEmailResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "already_verified" };

function hashVerificationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required to send verification emails.");
  }

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is required to send verification emails.");
  }

  return { apiKey, from };
}

export function resolveAppUrl(origin?: string | null) {
  const configuredUrl =
    process.env.APP_URL ??
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    origin;

  if (!configuredUrl) {
    throw new Error(
      "APP_URL, AUTH_URL, or NEXTAUTH_URL must be set when the request origin is unavailable.",
    );
  }

  return configuredUrl;
}

export async function createEmailVerificationToken(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = hashVerificationToken(rawToken);
  const expires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);

  await db.verificationToken.deleteMany({
    where: { identifier: normalizedEmail },
  });

  await db.verificationToken.create({
    data: {
      identifier: normalizedEmail,
      token: hashedToken,
      expires,
    },
  });

  return { rawToken, expires };
}

export async function sendVerificationEmail({
  email,
  name,
  verificationUrl,
}: SendVerificationEmailInput) {
  const { apiKey, from } = getResendConfig();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Verify your DevStash email",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
          <p>Hi ${escapeHtml(name || "there")},</p>
          <p>Thanks for creating your DevStash account. Confirm your email address to finish setting up your workspace.</p>
          <p>
            <a
              href="${verificationUrl}"
              style="display:inline-block;padding:12px 20px;border-radius:10px;background:#0ea5e9;color:#ffffff;text-decoration:none;font-weight:600;"
            >
              Verify email
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
      text: [
        `Hi ${name || "there"},`,
        "",
        "Thanks for creating your DevStash account.",
        "Verify your email by opening the link below:",
        verificationUrl,
        "",
        "This link expires in 24 hours.",
      ].join("\n"),
    }),
  });

  const result = (await response.json().catch(() => null)) as
    | { error?: { message?: string } }
    | null;

  if (!response.ok) {
    throw new Error(
      result?.error?.message ?? "Failed to send verification email.",
    );
  }
}

export async function issueVerificationEmail(
  email: string,
  origin?: string | null,
): Promise<VerificationEmailResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      email: true,
      emailVerified: true,
      name: true,
    },
  });

  if (!user?.email) {
    return { ok: false, reason: "not_found" };
  }

  if (user.emailVerified) {
    return { ok: false, reason: "already_verified" };
  }

  const { rawToken } = await createEmailVerificationToken(user.email);
  const verificationUrl = new URL("/verify-email", resolveAppUrl(origin));

  verificationUrl.searchParams.set("email", user.email);
  verificationUrl.searchParams.set("token", rawToken);

  await sendVerificationEmail({
    email: user.email,
    name: user.name ?? "",
    verificationUrl: verificationUrl.toString(),
  });

  return { ok: true };
}

export async function verifyEmailAddress(
  email: string,
  rawToken: string,
): Promise<"success" | "invalid" | "expired"> {
  const normalizedEmail = email.trim().toLowerCase();
  const hashedToken = hashVerificationToken(rawToken);

  const verificationToken = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: normalizedEmail,
        token: hashedToken,
      },
    },
  });

  if (!verificationToken) {
    return "invalid";
  }

  if (verificationToken.expires < new Date()) {
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token: hashedToken,
        },
      },
    });

    return "expired";
  }

  const didVerify = await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (!user) {
      return false;
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    await tx.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token: hashedToken,
        },
      },
    });

    return true;
  });

  return didVerify ? "success" : "invalid";
}
