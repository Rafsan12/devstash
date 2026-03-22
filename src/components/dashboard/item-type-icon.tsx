export function withAlpha(color: string, alphaHex: string) {
  if (/^#[\da-fA-F]{6}$/.test(color)) {
    return `${color}${alphaHex}`;
  }

  return color;
}

export function ItemTypeIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "Code":
      return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <path d="M8 8 4 12l4 4M16 8l4 4-4 4M14 5l-4 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "Sparkles":
      return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM5 16l.75 2.25L8 19l-2.25.75L5 22l-.75-2.25L2 19l2.25-.75L5 16Zm14-2 .75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </svg>
      );
    case "Terminal":
      return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <path d="m5 7 4 4-4 4m7 0h7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "StickyNote":
      return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <path d="M6 4h12a2 2 0 0 1 2 2v7.5L13.5 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M13 20v-5.5a1.5 1.5 0 0 1 1.5-1.5H20" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "File":
      return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M14 3v5h5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "Image":
      return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="4" />
          <circle cx="9" cy="10" fill="currentColor" r="1.5" />
          <path d="m21 16-5-5-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "Link":
      return (
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <path d="M10 14 8 16a3 3 0 1 1-4-4l2-2a3 3 0 0 1 4 0M14 10l2-2a3 3 0 1 1 4 4l-2 2a3 3 0 0 1-4 0M8 12h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    default:
      return <span className="text-[9px] font-semibold uppercase">{icon.slice(0, 2)}</span>;
  }
}
