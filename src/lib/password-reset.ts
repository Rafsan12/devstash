import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { resolveAppUrl } from "@/lib/email-verification";
import bcrypt from "bcryptjs";

// Password reset tokens are valid for 1 hour.
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

type SendPasswordResetEmailInput = {
  email: string;
  name: string;
  resetUrl: string;
};

type PasswordResetEmailResult =
  | { ok: true }
  | { ok: false; reason: "not_found" };

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
    throw new Error("RESEND_API_KEY is required to send emails.");
  }

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is required to send emails.");
  }

  return { apiKey, from };
}

export async function createPasswordResetToken(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = hashVerificationToken(rawToken);
  const expires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
  
  // Suffix the identifier to separate reset tokens from email verification tokens
  const identifier = `${normalizedEmail}-reset`;

  await db.verificationToken.deleteMany({
    where: { identifier },
  });

  await db.verificationToken.create({
    data: {
      identifier,
      token: hashedToken,
      expires,
    },
  });

  return { rawToken, expires };
}

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: SendPasswordResetEmailInput) {
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
      subject: "Reset your DevStash password",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
          <p>Hi ${escapeHtml(name || "there")},</p>
          <p>Someone requested to reset the password for your DevStash account.</p>
          <p>
            <a
              href="${resetUrl}"
              style="display:inline-block;padding:12px 20px;border-radius:10px;background:#0ea5e9;color:#ffffff;text-decoration:none;font-weight:600;"
            >
              Reset password
            </a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
      text: [
        `Hi ${name || "there"},`,
        "",
        "Someone requested to reset the password for your DevStash account.",
        "Reset your password by opening the link below:",
        resetUrl,
        "",
        "If you did not request this, you can safely ignore this email.",
        "This link expires in 1 hour.",
      ].join("\n"),
    }),
  });

  const result = (await response.json().catch(() => null)) as
    | { error?: { message?: string } }
    | null;

  if (!response.ok) {
    throw new Error(
      result?.error?.message ?? "Failed to send password reset email.",
    );
  }
}

export async function issuePasswordReset(
  email: string,
  origin?: string | null,
): Promise<PasswordResetEmailResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      email: true,
      name: true,
    },
  });

  if (!user?.email) {
    return { ok: false, reason: "not_found" };
  }

  const { rawToken } = await createPasswordResetToken(user.email);
  const resetUrl = new URL("/reset-password", resolveAppUrl(origin));

  resetUrl.searchParams.set("email", user.email);
  resetUrl.searchParams.set("token", rawToken);

  await sendPasswordResetEmail({
    email: user.email,
    name: user.name ?? "",
    resetUrl: resetUrl.toString(),
  });

  return { ok: true };
}

export async function verifyPasswordResetToken(
  email: string,
  rawToken: string,
): Promise<"success" | "invalid" | "expired"> {
  const normalizedEmail = email.trim().toLowerCase();
  const hashedToken = hashVerificationToken(rawToken);
  const identifier = `${normalizedEmail}-reset`;

  const verificationToken = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
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
          identifier,
          token: hashedToken,
        },
      },
    });

    return "expired";
  }

  return "success";
}

export async function resetUserPassword(
  email: string,
  rawToken: string,
  newPasswordRaw: string
): Promise<"success" | "invalid" | "expired"> {
  const tokenStatus = await verifyPasswordResetToken(email, rawToken);
  
  if (tokenStatus !== "success") {
    return tokenStatus;
  }
  
  const normalizedEmail = email.trim().toLowerCase();
  const hashedToken = hashVerificationToken(rawToken);
  const identifier = `${normalizedEmail}-reset`;
  const hashedPassword = await bcrypt.hash(newPasswordRaw, 12);

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: normalizedEmail },
      data: {
        password: hashedPassword,
      },
    });

    await tx.verificationToken.delete({
      where: {
        identifier_token: {
          identifier,
          token: hashedToken,
        },
      },
    });
  });

  return "success";
}
