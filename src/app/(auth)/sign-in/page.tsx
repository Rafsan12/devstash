import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { redirect } from "next/navigation";

function mapAuthError(error?: string, code?: string) {
  if (error === "EmailNotVerified") {
    return "Verify your email before signing in. Check your inbox for the link.";
  }

  if (error === "CredentialsSignin" && code === "rate_limited") {
    return "Too many sign-in attempts. Please wait a few minutes and try again.";
  }

  if (error === "CredentialsSignin") {
    return "Invalid email or password.";
  }

  if (error === "AccessDenied") {
    return "Access was denied. Try another account or method.";
  }

  if (error) {
    return "Sign in could not be completed. Please try again.";
  }

  return undefined;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const callbackUrl = typeof resolvedSearchParams.callbackUrl === "string"
    ? resolvedSearchParams.callbackUrl
    : "/dashboard";
  const errorCode = typeof resolvedSearchParams.error === "string"
    ? resolvedSearchParams.error
    : undefined;
  const authCode = typeof resolvedSearchParams.code === "string"
    ? resolvedSearchParams.code
    : undefined;
  const registrationEmail = typeof resolvedSearchParams.email === "string"
    ? resolvedSearchParams.email
    : undefined;
  const registrationSuccess = resolvedSearchParams.registered === "1";

  return (
    <AuthShell
      description="Sign in with GitHub or your DevStash credentials to jump back into your workspace."
      eyebrow="Authentication"
      title="Keep your notes, prompts, and snippets one step away."
    >
      <SignInForm
        callbackUrl={callbackUrl}
        initialCode={authCode}
        initialError={mapAuthError(errorCode, authCode)}
        registrationEmail={registrationEmail}
        registrationSuccess={registrationSuccess}
      />
    </AuthShell>
  );
}
