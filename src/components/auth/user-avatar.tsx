import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name?: string | null;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
};

export function getUserInitials(name?: string | null) {
  const initials = (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "DU";
}

export function UserAvatar({
  name,
  image,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const initials = getUserInitials(name);
  const hasImage = typeof image === "string" && image.trim().length > 0;

  return (
    <span
      aria-label={name ? `${name} avatar` : "User avatar"}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white text-sm font-semibold text-zinc-950",
        className,
      )}
    >
      {hasImage ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
        />
      ) : null}
      <span
        className={cn(
          "relative z-10",
          hasImage ? "sr-only" : "",
          fallbackClassName,
        )}
      >
        {initials}
      </span>
    </span>
  );
}
