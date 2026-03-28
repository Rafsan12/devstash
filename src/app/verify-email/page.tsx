import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { verifyEmailAddress } from "@/lib/email-verification";

type VerifyEmailStatus = "sent" | "success" | "invalid" | "expired" | "missing";

const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

function isEmailVerificationEnabled() {
  const rawValue = process.env.EMAIL_VERIFICATION_ENABLED;

  if (rawValue === undefined) {
    return true;
  }

  return ENABLED_VALUES.has(rawValue.trim().toLowerCase());
}

function getContent(status: VerifyEmailStatus, email?: string) {
  if (status === "sent") {
    return {
      eyebrow: "Verification",
      title: "Check your inbox.",
      description:
        "We sent a verification link to your email address. Open it to finish activating your DevStash account.",
      body: email
        ? `The link was sent to ${email}. It expires in 24 hours.`
        : "Your verification link expires in 24 hours.",
      primaryHref: "/sign-in",
      primaryLabel: "Back to sign in",
      canResend: true,
    };
  }

  if (status === "success") {
    return {
      eyebrow: "Verified",
      title: "Your email is confirmed.",
      description:
        "Your DevStash account is ready to use. Sign in to get back to your workspace.",
      body: email
        ? `${email} has been verified successfully.`
        : "Your email has been verified successfully.",
      primaryHref: email
        ? `/sign-in?registered=1&email=${encodeURIComponent(email)}`
        : "/sign-in?registered=1",
      primaryLabel: "Continue to sign in",
      canResend: false,
    };
  }

  if (status === "expired") {
    return {
      eyebrow: "Expired",
      title: "This link has expired.",
      description:
        "The verification window has ended, but you can send yourself a fresh verification email below.",
      body: "Verification links are valid for 24 hours.",
      primaryHref: "/sign-in",
      primaryLabel: "Back to sign in",
      canResend: true,
    };
  }

  if (status === "invalid") {
    return {
      eyebrow: "Invalid link",
      title: "This verification link is not valid.",
      description:
        "The link may have already been used or copied incorrectly. You can request a fresh verification email below.",
      body: "If you already verified successfully, you can sign in normally.",
      primaryHref: "/sign-in",
      primaryLabel: "Go to sign in",
      canResend: true,
    };
  }

  return {
    eyebrow: "Verification",
    title: "Verification details missing.",
    description:
      "Open the full link from your email, or request a new verification message below.",
    body: "If you no longer have the email, enter your address and we will send another verification link.",
    primaryHref: "/register",
    primaryLabel: "Go to register",
    canResend: true,
  };
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  if (!isEmailVerificationEnabled()) {
    redirect("/sign-in?registered=1");
  }

  const resolvedSearchParams = await searchParams;
  const email = typeof resolvedSearchParams.email === "string"
    ? resolvedSearchParams.email
    : undefined;
  const token = typeof resolvedSearchParams.token === "string"
    ? resolvedSearchParams.token
    : undefined;
  const isSent = resolvedSearchParams.sent === "1";

  let status: VerifyEmailStatus = "missing";

  if (isSent) {
    status = "sent";
  } else if (email && token) {
    status = await verifyEmailAddress(email, token);
  }

  const content = getContent(status, email);

  return (
    <AuthShell
      description={content.description}
      eyebrow={content.eyebrow}
      title={content.title}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-zinc-300">
          {content.body}
        </div>

        <Link
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3b82f6_0%,#8b5cf6_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
          href={content.primaryHref}
        >
          {content.primaryLabel}
        </Link>

        {content.canResend ? <ResendVerificationForm initialEmail={email} /> : null}

        <p className="text-center text-sm text-zinc-400">
          Need a different account?{" "}
          <Link className="font-medium text-sky-300 transition hover:text-sky-200" href="/register">
            Create a new one
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
