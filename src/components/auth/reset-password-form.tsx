"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ResetPasswordForm({
  email,
  token,
}: {
  email?: string;
  token?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isInvalidLink = !email || !token;

  if (isInvalidLink) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-white">Invalid Reset Link</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            It looks like your password reset link is invalid or missing required information. 
            Please try requesting a new link.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/forgot-password" className="block w-full">
            <Button className="w-full justify-center" variant="premium" type="button">
              Request new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill out both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password.");
        setIsPending(false);
        return;
      }

      toast.success("Password reset successfully!", {
        description: "You may now sign in with your new password.",
      });
      router.push("/sign-in");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">New password</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Set a new strong password for your DevStash account.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-200">New Password</span>
          <Input
            autoFocus
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your new password"
            type="password"
            value={password}
            disabled={isPending}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-200">Confirm Password</span>
          <Input
            autoComplete="new-password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your new password"
            type="password"
            value={confirmPassword}
            disabled={isPending}
          />
        </label>

        <Button
          className="h-11 w-full justify-center text-sm font-semibold"
          disabled={isPending}
          type="submit"
          variant="premium"
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
