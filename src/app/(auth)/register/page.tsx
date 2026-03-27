import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      description="Create a DevStash account and start organizing your developer knowledge in one secure place."
      eyebrow="Registration"
      title="Build a workspace that remembers the useful things."
    >
      <RegisterForm />
    </AuthShell>
  );
}
