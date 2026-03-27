"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      registered: "1",
      email: formData.email,
    });

    router.push(`/sign-in?${redirectParams.toString()}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Create account</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Set up a workspace for your notes, files, commands, prompts, and snippets.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Name">
          <Input
            autoComplete="name"
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your display name"
            value={formData.name}
          />
        </Field>

        <Field label="Email">
          <Input
            autoComplete="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@devstash.io"
            type="email"
            value={formData.email}
          />
        </Field>

        <Field label="Password">
          <Input
            autoComplete="new-password"
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Create a password"
            type="password"
            value={formData.password}
          />
        </Field>

        <Field label="Confirm password">
          <Input
            autoComplete="new-password"
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            placeholder="Repeat your password"
            type="password"
            value={formData.confirmPassword}
          />
        </Field>

        <Button
          className="h-11 w-full justify-center text-sm font-semibold"
          disabled={isPending}
          type="submit"
          variant="premium"
        >
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-zinc-400">
        Already have an account?{" "}
        <Link className="font-medium text-sky-300 transition hover:text-sky-200" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      {children}
    </label>
  );
}
