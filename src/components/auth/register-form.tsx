"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setIsPending(false);

    if (!response.ok) {
      setError(result?.error ?? "Unable to create your account.");
      return;
    }

    const redirectParams = new URLSearchParams({
      sent: "1",
      email: formData.email,
    });

    router.push(`/verify-email?${redirectParams.toString()}`);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-semibold text-white tracking-tight">Create account</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Set up a workspace for your notes, files, commands, prompts, and snippets.
          We&apos;ll send a verification link before your first sign-in.
        </p>
      </div>

      {error ? (
        <div className="animate-fade-in-up rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field className="animate-fade-in-up delay-75" label="Name">
          <Input
            autoComplete="name"
            className="h-11 bg-black/20 focus-visible:ring-sky-500/50 focus-visible:border-sky-500/50 transition-all border-white/5"
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your display name"
            value={formData.name}
          />
        </Field>

        <Field className="animate-fade-in-up delay-150" label="Email">
          <Input
            autoComplete="email"
            className="h-11 bg-black/20 focus-visible:ring-sky-500/50 focus-visible:border-sky-500/50 transition-all border-white/5"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@devstash.io"
            type="email"
            value={formData.email}
          />
        </Field>

        <Field className="animate-fade-in-up delay-200" label="Password">
          <Input
            autoComplete="new-password"
            className="h-11 bg-black/20 focus-visible:ring-sky-500/50 focus-visible:border-sky-500/50 transition-all border-white/5"
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Create a password"
            type="password"
            value={formData.password}
          />
        </Field>

        <Field className="animate-fade-in-up delay-225" label="Confirm password">
          <Input
            autoComplete="new-password"
            className="h-11 bg-black/20 focus-visible:ring-sky-500/50 focus-visible:border-sky-500/50 transition-all border-white/5"
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            placeholder="Repeat your password"
            type="password"
            value={formData.confirmPassword}
          />
        </Field>

        <div className="animate-fade-in-up delay-300 pt-2">
          <Button
            className="h-11 w-full justify-center text-sm font-semibold shadow-xl shadow-sky-500/10 transition-all hover:shadow-sky-500/20 active:scale-[0.98]"
            disabled={isPending}
            type="submit"
            variant="premium"
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>

      <p className="animate-fade-in-up delay-300 text-sm text-zinc-400">
        Already have an account?{" "}
        <Link className="font-medium text-sky-300 transition-colors hover:text-sky-200" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      {children}
    </label>
  );
}
