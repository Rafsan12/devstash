import { auth } from "@/auth";
import { UserAvatar } from "@/components/auth/user-avatar";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const name = session.user.name ?? "DevStash User";
  const email = session.user.email ?? "No email available";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10 text-white">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-black/40 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex items-center gap-4">
          <UserAvatar className="h-16 w-16 text-lg" image={session.user.image} name={name} />
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{name}</h1>
            <p className="mt-2 text-sm text-zinc-400">{email}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-medium text-white">Account summary</p>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This profile page is the account entry point for the new auth UI. We can expand
            it later with preferences, security controls, and connected providers.
          </p>
        </div>

        <Link
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:bg-white/10"
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
