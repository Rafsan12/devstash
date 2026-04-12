"use client";

import { SidebarAccountMenu } from "@/components/auth/sidebar-account-menu";
import { EditorPreferencesProvider } from "@/components/editor-preferences/editor-preferences-provider";
import { Badge } from "@/components/ui/badge";
import { type DashboardSidebarCollection } from "@/lib/db/collections";
import {
  type DashboardSidebarItemType,
  type DashboardSidebarUser,
} from "@/lib/db/items";
import { type SearchData } from "@/lib/db/search";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ItemTypeIcon, withAlpha } from "./item-type-icon";
import { CreateItemModal } from "./create-item-modal";
import { CreateCollectionModal } from "./create-collection-modal";
import { GlobalSearchPalette } from "./global-search-palette";

export function DashboardShell({
  children,
  favoriteCollections,
  recentCollections,
  sidebarItemTypes,
  allCollections,
  user,
  searchData,
  initialEditorPreferences,
}: {
  children: ReactNode;
  favoriteCollections: DashboardSidebarCollection[];
  recentCollections: DashboardSidebarCollection[];
  sidebarItemTypes: DashboardSidebarItemType[];
  allCollections: DashboardSidebarCollection[];
  user: DashboardSidebarUser | null;
  searchData: SearchData;
  initialEditorPreferences?: unknown;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";
  const showBackToDashboard = pathname !== "/dashboard";

  return (
    <EditorPreferencesProvider initialPreferences={initialEditorPreferences}>
      <>
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#050507_100%)] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-2xl shadow-black/30 backdrop-blur">
            <button
              aria-label="Close sidebar overlay"
              className={cn(
                "absolute inset-0 z-20 bg-black/60 opacity-0 transition-opacity lg:hidden",
                isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none"
              )}
              onClick={() => setIsMobileOpen(false)}
              type="button"
            />

          <div className="flex min-h-[calc(100vh-2rem)]">
            <aside
              className={cn(
                "absolute inset-y-0 left-0 z-30 flex w-[290px] -translate-x-full border-r border-white/10 bg-[#07070a] transition-[width,transform] duration-300 lg:static lg:translate-x-0",
                isDesktopCollapsed ? "lg:w-[88px]" : "lg:w-[290px]",
                isMobileOpen && "translate-x-0"
              )}
            >
              <div className="flex h-full w-full flex-col">
                <div className={cn(
                  "flex items-center gap-3 border-b border-white/10 px-5 py-5",
                  isDesktopCollapsed && "lg:justify-center lg:px-2"
                )}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6_0%,#8b5cf6_100%)] text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
                    DS
                  </div>
                  <div className={cn("min-w-0", isDesktopCollapsed && "lg:hidden")}>
                    <p className="truncate text-lg font-semibold text-white">DevStash</p>
                    <p className="truncate text-sm text-zinc-500">Knowledge hub</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
                  <SidebarSection isDesktopCollapsed={isDesktopCollapsed} label="Types">
                    {sidebarItemTypes.map((itemType) => (
                      <Link
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition hover:bg-white/[0.05] hover:text-white",
                          "justify-between",
                          isDesktopCollapsed && "lg:justify-center"
                        )}
                        href={itemType.href}
                        key={itemType.id}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sky-200">
                            <ItemTypeIcon icon={itemType.icon} />
                          </span>
                          <span className={cn("flex items-center gap-2", isDesktopCollapsed && "lg:hidden")}>
                            <span className="truncate text-zinc-200">{itemType.name}</span>
                          </span>
                        </div>
                        <span className={cn("text-xs text-zinc-500", isDesktopCollapsed && "lg:hidden")}>
                          {itemType.count}
                        </span>
                      </Link>
                    ))}
                  </SidebarSection>

                  <SidebarSection isDesktopCollapsed={isDesktopCollapsed} label="Favorites">
                    {favoriteCollections.map((collection) => (
                      <CollectionListItem
                        collection={collection}
                        isDesktopCollapsed={isDesktopCollapsed}
                        key={collection.id}
                        onSidebarClick={() => setIsMobileOpen(false)}
                        variant="favorite"
                      />
                    ))}
                  </SidebarSection>

                  <SidebarSection isDesktopCollapsed={isDesktopCollapsed} label="Recent">
                    {recentCollections.map((collection) => (
                      <CollectionListItem
                        collection={collection}
                        isDesktopCollapsed={isDesktopCollapsed}
                        key={collection.id}
                        meta={`${collection.itemCount} items`}
                        onSidebarClick={() => setIsMobileOpen(false)}
                        variant="recent"
                      />
                    ))}
                  </SidebarSection>

                  <SidebarSection isDesktopCollapsed={isDesktopCollapsed} label="Collections">
                    <Link
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition hover:bg-white/[0.05] hover:text-white",
                        "justify-between",
                        isDesktopCollapsed && "lg:justify-center"
                      )}
                      href="/collections"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-zinc-200">
                          ALL
                        </span>
                        <span className={cn("truncate text-zinc-200", isDesktopCollapsed && "lg:hidden")}>
                          View all collections
                        </span>
                      </div>
                      <span className={cn("text-xs text-zinc-500", isDesktopCollapsed && "lg:hidden")}>
                        Open
                      </span>
                    </Link>
                  </SidebarSection>
                </div>

                <div className="border-t border-white/10 p-4">
                  {user ? (
                    <SidebarAccountMenu isDesktopCollapsed={isDesktopCollapsed} user={user} />
                  ) : null}
                </div>
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
              <header className="border-b border-white/10 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Open sidebar"
                      className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
                      onClick={() => setIsMobileOpen(true)}
                      type="button"
                    >
                      <DrawerIcon />
                    </button>
                    <button
                      aria-label="Toggle sidebar width"
                      className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white transition-colors hover:bg-white/10 lg:inline-flex"
                      onClick={() => setIsDesktopCollapsed((prev) => !prev)}
                      type="button"
                    >
                      <DrawerIcon />
                    </button>
                    <div>
                      {showBackToDashboard ? (
                        <Link
                          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition hover:text-zinc-200"
                          href="/dashboard"
                        >
                          <ArrowLeftIcon />
                          Back to dashboard
                        </Link>
                      ) : null}
                      <h1 className={cn(
                        "font-semibold text-white",
                        isDashboardPage ? "text-xl sm:text-2xl" : "mt-2 text-lg sm:text-xl"
                      )}>
                        Workspace
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
                    <div className="relative lg:w-full lg:max-w-xl">
                      <button
                        aria-label="Open search"
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-left text-sm text-zinc-500 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-400"
                        type="button"
                        onClick={() => setSearchOpen(true)}
                      >
                        <SearchIcon />
                        <span className="flex-1">Search items...</span>
                        <span className="hidden items-center gap-1 sm:flex">
                          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px]">
                            ⌘K
                          </kbd>
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        aria-label="Favorites"
                        className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/12 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-amber-300"
                        href="/favorites"
                        title="Favorites"
                      >
                        <StarIcon />
                      </Link>
                      <CreateCollectionModal />
                      <CreateItemModal
                        collections={allCollections}
                        itemTypes={sidebarItemTypes}
                      />
                    </div>
                  </div>
                </div>
              </header>

              {children}
            </div>
          </div>
        </div>
      </div>
        </main>

        <GlobalSearchPalette
          open={searchOpen}
          searchData={searchData}
          onOpenChange={setSearchOpen}
        />
      </>
    </EditorPreferencesProvider>
  );
}

function SidebarSection({
  children,
  label,
  isDesktopCollapsed,
}: {
  children: ReactNode;
  label: string;
  isDesktopCollapsed: boolean;
}) {
  return (
    <section>
      <p className={cn(
        "mb-2 px-3 text-xs uppercase tracking-[0.22em] text-zinc-500",
        isDesktopCollapsed && "lg:hidden"
      )}>
        {label}
      </p>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function CollectionListItem({
  collection,
  meta,
  variant,
  isDesktopCollapsed,
  onSidebarClick,
}: {
  collection: DashboardSidebarCollection;
  meta?: string;
  variant: "favorite" | "recent";
  isDesktopCollapsed: boolean;
  onSidebarClick: () => void;
}) {
  const leadingBadge =
    variant === "favorite" ? (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-amber-200">
        STAR
      </span>
    ) : (
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
        style={{
          borderColor: withAlpha(collection.dominantTypeColor, "52"),
          backgroundColor: withAlpha(collection.dominantTypeColor, "14"),
        }}
      >
        <span
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: collection.dominantTypeColor,
          }}
        />
      </span>
    );

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/[0.05]",
        "justify-between",
        isDesktopCollapsed && "lg:justify-center"
      )}
      onClick={onSidebarClick}
      type="button"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {leadingBadge}
        <div className={cn("min-w-0", isDesktopCollapsed && "lg:hidden")}>
          <p className="truncate text-sm font-medium text-zinc-200">
            {collection.name}
          </p>
          <p className="truncate text-xs text-zinc-500">
            {meta ?? collection.description}
          </p>
        </div>
      </div>
      {variant === "favorite" ? (
        <span className={cn("text-amber-300", isDesktopCollapsed && "lg:hidden")}>*</span>
      ) : null}
    </button>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DrawerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 5h16M4 12h16M4 19h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}


