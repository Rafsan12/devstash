import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | DevStash",
  description: "Reset your DevStash password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      description="Enter the email associated with your account, and we'll send you a link to reset your password."
      eyebrow="Account Recovery"
      title="Reset your password"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
