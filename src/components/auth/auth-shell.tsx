import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#050507_100%)] px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,47,73,0.65),rgba(9,9,11,0.96)_42%,rgba(15,23,42,0.92))] p-8 shadow-2xl shadow-black/30 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.65),transparent)]" />
          <div className="flex h-full flex-col justify-between gap-10">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6_0%,#22d3ee_100%)] text-sm font-semibold text-white shadow-lg shadow-sky-500/20">
                DS
              </div>
              <p className="mt-8 text-sm uppercase tracking-[0.32em] text-sky-200/80">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300">
                {description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureCard
                description="Move between notes, prompts, snippets, and assets without losing context."
                title="Fast workspace"
              />
              <FeatureCard
                description="Keep important collections and recent files close while you work."
                title="Organized by default"
              />
              <FeatureCard
                description="Use GitHub or credentials and pick up right where you left off."
                title="Built for developers"
              />
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
                  DevStash
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Secure access to your developer knowledge hub.
                </p>
              </div>
              <Link
                className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
                href="/"
              >
                Home
              </Link>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
