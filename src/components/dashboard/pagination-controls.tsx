import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  createPageHref: (page: number) => string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

function PaginationLink({
  href,
  isActive = false,
  isDisabled = false,
  children,
}: {
  href: string;
  isActive?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
}) {
  const className = cn(
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors",
    isActive
      ? "border-sky-400/50 bg-sky-400/15 text-sky-100"
      : "border-white/12 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
    isDisabled && "pointer-events-none border-white/8 bg-white/[0.02] text-zinc-600",
  );

  if (isDisabled) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

export function PaginationControls({
  currentPage,
  totalPages,
  createPageHref,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 border-t border-white/8 pt-6"
    >
      <PaginationLink
        href={createPageHref(currentPage - 1)}
        isDisabled={currentPage <= 1}
      >
        Prev
      </PaginationLink>

      {visiblePages.map((page, index) => {
        const previousPage = visiblePages[index - 1];
        const showGap = previousPage !== undefined && page - previousPage > 1;

        return (
          <div className="flex items-center gap-2" key={page}>
            {showGap ? <span className="px-1 text-sm text-zinc-500">...</span> : null}
            <PaginationLink
              href={createPageHref(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </div>
        );
      })}

      <PaginationLink
        href={createPageHref(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      >
        Next
      </PaginationLink>
    </nav>
  );
}
