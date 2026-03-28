import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password | DevStash",
  description: "Securely set a new password for your DevStash account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const email = typeof resolvedSearchParams.email === "string" ? resolvedSearchParams.email : undefined;
  const token = typeof resolvedSearchParams.token === "string" ? resolvedSearchParams.token : undefined;

  return (
    <AuthShell
      description="Choose a strong new password for your account to immediately get back into DevStash."
      eyebrow="Account Recovery"
      title="Set a new password"
    >
      <ResetPasswordForm email={email} token={token} />
    </AuthShell>
  );
}
