import Link from "next/link";

export default function CollectionsPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">DevStash</p>
        <h1 className="mt-4 text-4xl font-semibold">Collections</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
          Browse all collections from the dashboard sidebar. This route is ready for the
          next collections-focused phase.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-100"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
          <span className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm text-zinc-400">
            Placeholder route for upcoming collection management
          </span>
        </div>
      </div>
    </main>
  );
}
