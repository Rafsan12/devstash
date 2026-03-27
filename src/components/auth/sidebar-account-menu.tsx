"use client";

import { UserAvatar } from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export type SidebarAccountUser = {
  name: string;
  email: string;
  image?: string | null;
};

export function SidebarAccountMenu({
  sidebarExpanded,
  user,
}: {
  sidebarExpanded: boolean;
  user: SidebarAccountUser;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/sign-in" });
  }

  return (
    <div className="relative">
      {isOpen ? (
        <button
          aria-label="Close account menu"
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      ) : null}

      <div
        className={cn(
          "relative z-20 flex items-center rounded-2xl border border-white/10 bg-white/[0.03]",
          sidebarExpanded ? "gap-3 px-3 py-3" : "justify-center px-2 py-3",
        )}
      >
        <Link
          aria-label="Open profile"
          className="shrink-0"
          href="/profile"
          onClick={() => setIsOpen(false)}
        >
          <UserAvatar className="h-11 w-11" image={user.image} name={user.name} />
        </Link>

        {sidebarExpanded ? (
          <>
            <Link className="min-w-0 flex-1" href="/profile" onClick={() => setIsOpen(false)}>
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-sm text-zinc-500">{user.email}</p>
            </Link>
            <Button
              aria-expanded={isOpen}
              aria-label="Toggle account menu"
              className="h-9 w-9 shrink-0"
              onClick={() => setIsOpen((current) => !current)}
              size="icon"
              variant="ghost"
            >
              <ChevronUpIcon className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
            </Button>
          </>
        ) : (
          <Button
            aria-expanded={isOpen}
            aria-label="Toggle account menu"
            className="absolute inset-0 h-full w-full rounded-2xl opacity-0"
            onClick={() => setIsOpen((current) => !current)}
            size="icon"
            variant="ghost"
          />
        )}
      </div>

      {isOpen ? (
        <div className="absolute bottom-[calc(100%+0.75rem)] left-0 z-30 w-64 rounded-2xl border border-white/10 bg-[#09090d] p-2 shadow-2xl shadow-black/40">
          <Link
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-200 transition hover:bg-white/[0.06] hover:text-white"
            href="/profile"
            onClick={() => setIsOpen(false)}
          >
            <UserAvatar className="h-9 w-9" image={user.image} name={user.name} />
            <span className="min-w-0">
              <span className="block truncate font-medium">{user.name}</span>
              <span className="block truncate text-xs text-zinc-500">{user.email}</span>
            </span>
          </Link>
          <div className="my-2 h-px bg-white/10" />
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-200 transition hover:bg-white/[0.06] hover:text-white"
            disabled={isSigningOut}
            onClick={handleSignOut}
            type="button"
          >
            <SignOutIcon />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 14 6-6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m14 16 4-4-4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M18 12H9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
