"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type SearchData } from "@/lib/db/search";
import { ItemTypeIcon } from "./item-type-icon";
import { useItemDrawer } from "./item-drawer-provider";

type Props = {
  searchData: SearchData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function fuzzyScore(haystack: string, query: string): number {
  if (!query) return 1;
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  if (h.includes(q)) return 2;
  const words = q.split(/\s+/).filter(Boolean);
  const matched = words.filter((w) => h.includes(w)).length;
  return matched / words.length;
}

export function GlobalSearchPalette({ searchData, open, onOpenChange }: Props) {
  const router = useRouter();
  const { openItem } = useItemDrawer();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Register Ctrl/Cmd+K global shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setQuery("");
        onOpenChange(true);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filteredItems = query
    ? searchData.items
        .map((item) => ({
          item,
          score: Math.max(
            fuzzyScore(item.title, query) * 3,
            fuzzyScore(item.contentPreview, query),
            fuzzyScore(item.collectionName, query) * 0.5,
          ),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)
    : searchData.items.slice(0, 8);

  const filteredCollections = query
    ? searchData.collections
        .map((col) => ({
          col,
          score: fuzzyScore(col.name, query),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ col }) => col)
    : searchData.collections.slice(0, 5);

  const hasResults = filteredItems.length > 0 || filteredCollections.length > 0;

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Palette panel */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] shadow-2xl shadow-black/60">
        <Command label="Global search" shouldFilter={false}>
          {/* Search input row */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <SearchIcon />
            <Command.Input
              ref={inputRef}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              placeholder="Search items and collections..."
              value={query}
              onValueChange={setQuery}
            />
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline">
              Esc
            </kbd>
          </div>

          <Command.List className="max-h-[420px] overflow-y-auto overscroll-contain py-2">
            {!hasResults && (
              <Command.Empty className="px-4 py-10 text-center text-sm text-zinc-500">
                No results for &ldquo;{query}&rdquo;
              </Command.Empty>
            )}

            {filteredItems.length > 0 && (
              <Command.Group
                heading={
                  <span className="px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                    Items
                  </span>
                }
              >
                {filteredItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    className="group mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors aria-selected:bg-white/[0.06] hover:bg-white/[0.06]"
                    value={`item-${item.id}`}
                    onSelect={() => {
                      onOpenChange(false);
                      openItem(item.id);
                    }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400">
                      <ItemTypeIcon icon={item.typeIcon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-100">{item.title}</p>
                      {item.contentPreview && (
                        <p className="truncate text-xs text-zinc-500">{item.contentPreview}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-zinc-600">{item.collectionName}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {filteredCollections.length > 0 && (
              <Command.Group
                heading={
                  <span className="px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                    Collections
                  </span>
                }
              >
                {filteredCollections.map((col) => (
                  <Command.Item
                    key={col.id}
                    className="mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors aria-selected:bg-white/[0.06] hover:bg-white/[0.06]"
                    value={`collection-${col.id}`}
                    onSelect={() => {
                      onOpenChange(false);
                      router.push(`/collections/${col.id}`);
                    }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400">
                      <FolderIcon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-100">{col.name}</p>
                    </div>
                    <span className="shrink-0 text-xs text-zinc-600">
                      {col.itemCount} {col.itemCount === 1 ? "item" : "items"}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          {/* Footer hint */}
          <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5 text-[11px] text-zinc-600">
            <span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↑</kbd>
              <kbd className="ml-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↓</kbd>
              {" "}navigate
            </span>
            <span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↵</kbd>
              {" "}open
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-zinc-500"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
