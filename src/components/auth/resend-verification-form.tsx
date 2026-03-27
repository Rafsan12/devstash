"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ResendVerificationFormProps = {
  initialEmail?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ResendVerificationForm({
  initialEmail = "",
}: ResendVerificationFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      setError("Email is required.");
      setSuccess("");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      setSuccess("");
      return;
    }

    setIsPending(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/auth/verify-email/resend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;

    setIsPending(false);

    if (!response.ok) {
      setError(result?.error ?? "Unable to resend the verification email.");
      return;
    }

    setSuccess(result?.message ?? "Verification email sent.");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Resend verification email</h3>
        <p className="text-sm leading-6 text-zinc-400">
          Enter your account email and we&apos;ll send you a fresh verification link.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@devstash.io"
          type="email"
          value={email}
        />

        <Button
          className="h-11 w-full justify-center text-sm font-semibold"
          disabled={isPending}
          type="submit"
          variant="outline"
        >
          {isPending ? "Sending..." : "Send new verification link"}
        </Button>
      </form>
    </div>
  );
}
