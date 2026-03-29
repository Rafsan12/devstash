"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    setIsPending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      const nextError = data.error || data.message || "Failed to request password reset.";

      if (!response.ok) {
        setError(nextError);

        if (response.status === 429) {
          toast.error("Too many attempts", {
            id: "forgot-password-rate-limited",
            description: nextError,
          });
        }

        setIsPending(false);
        return;
      }

      setIsSuccess(true);
      toast.success("Reset link sent!", {
        description: data.message,
      });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-white">Check your email</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and click the link to continue.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/sign-in" className="block w-full">
            <Button className="w-full justify-center" variant="outline" type="button">
              Return to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Forgot password</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-200">Email</span>
          <Input
            autoFocus
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@devstash.io"
            type="email"
            value={email}
            disabled={isPending}
          />
        </label>

        <Button
          className="h-11 w-full justify-center text-sm font-semibold"
          disabled={isPending}
          type="submit"
          variant="premium"
        >
          {isPending ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      <p className="text-sm text-zinc-400">
        Remember your password?{" "}
        <Link className="font-medium text-sky-300 transition hover:text-sky-200" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
