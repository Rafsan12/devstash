"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SignInForm({
  callbackUrl,
  initialCode,
  initialError,
  registrationEmail,
  registrationSuccess,
}: {
  callbackUrl: string;
  initialCode?: string;
  initialError?: string;
  registrationEmail?: string;
  registrationSuccess?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(registrationEmail ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [errorCode, setErrorCode] = useState(initialCode ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isGitHubPending, setIsGitHubPending] = useState(false);

  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Account ready", {
        id: "register-success",
        description: "Your account is ready. Sign in with your credentials.",
      });
    }
  }, [registrationSuccess]);

  async function handleCredentialsSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsPending(true);
    setError("");
    setErrorCode("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsPending(false);

    if (result?.url) {
      const nextUrl = new URL(result.url, window.location.origin);
      const nextError = nextUrl.searchParams.get("error");

      if (nextUrl.pathname === "/sign-in" && nextError) {
        router.push(nextUrl.toString());
        router.refresh();
        return;
      }
    }

    if (!result || result.error) {
      if (result?.code === "rate_limited" || result?.status === 429) {
        const nextError = "Too many sign-in attempts. Please wait a few minutes and try again.";

        setErrorCode("rate_limited");
        setError(nextError);
        toast.error("Too many attempts", {
          id: "sign-in-rate-limited",
          description: nextError,
        });
        return;
      }

      setErrorCode("credentials");
      setError("Invalid email or password.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  async function handleGitHubSignIn() {
    setIsGitHubPending(true);
    setError("");

    await signIn("github", { callbackUrl });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Sign in</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Access your collections, notes, prompts, and snippets.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
        <Field label="Email">
          <Input
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value);

              if (errorCode === "rate_limited") {
                setErrorCode("");
              }
            }}
            placeholder="you@devstash.io"
            type="email"
            value={email}
          />
        </Field>

        <Field 
          label="Password"
          action={
            <Link 
              className="text-xs font-medium text-sky-300 hover:text-sky-200 transition" 
              href="/forgot-password"
              tabIndex={-1}
            >
              Forgot Password?
            </Link>
          }
        >
          <Input
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);

              if (errorCode === "rate_limited") {
                setErrorCode("");
              }
            }}
            placeholder="Enter your password"
            type="password"
            value={password}
          />
        </Field>

        <Button
          className="h-11 w-full justify-center text-sm font-semibold"
          disabled={isPending}
          type="submit"
          variant="premium"
        >
          {isPending ? "Signing in..." : "Sign in with email"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        className={cn("h-11 w-full justify-center text-sm font-semibold", isGitHubPending && "opacity-80")}
        disabled={isGitHubPending}
        onClick={handleGitHubSignIn}
        variant="outline"
      >
        <GitHubMark />
        {isGitHubPending ? "Redirecting to GitHub..." : "Sign in with GitHub"}
      </Button>

      <p className="text-sm text-zinc-400">
        New to DevStash?{" "}
        <Link className="font-medium text-sky-300 transition hover:text-sky-200" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        {action}
      </div>
      {children}
    </label>
  );
}

function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.477 2 2 6.589 2 12.248c0 4.527 2.865 8.367 6.839 9.722.5.095.682-.222.682-.494 0-.244-.009-.89-.014-1.746-2.782.617-3.37-1.375-3.37-1.375-.455-1.183-1.11-1.498-1.11-1.498-.908-.637.069-.624.069-.624 1.004.073 1.532 1.06 1.532 1.06.892 1.57 2.341 1.116 2.91.853.091-.664.349-1.116.635-1.373-2.221-.26-4.555-1.14-4.555-5.072 0-1.12.389-2.036 1.029-2.753-.103-.261-.446-1.312.098-2.735 0 0 .84-.276 2.75 1.052A9.303 9.303 0 0 1 12 6.853c.85.004 1.706.118 2.504.347 1.909-1.328 2.747-1.052 2.747-1.052.546 1.423.203 2.474.1 2.735.641.717 1.027 1.633 1.027 2.753 0 3.942-2.338 4.809-4.566 5.064.359.319.678.948.678 1.911 0 1.38-.012 2.493-.012 2.832 0 .274.18.593.688.492A10.271 10.271 0 0 0 22 12.248C22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}
