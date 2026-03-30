import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "premium" | "premium-outline" | "danger";
type ButtonSize = "default" | "sm" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-white text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-zinc-100",
  outline:
    "border border-white/12 bg-white/5 text-white hover:bg-white/10",
  ghost: "bg-transparent text-zinc-300 hover:bg-white/8 hover:text-white",
  premium: 
    "bg-[linear-gradient(135deg,#3b82f6_0%,#8b5cf6_100%)] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] border-0 hover:scale-[1.02] transition-all duration-300 ease-out",
  "premium-outline": 
    "border border-sky-400/30 bg-sky-400/10 text-sky-100 hover:bg-sky-400/20 hover:border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 ease-out",
  danger:
    "bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 hover:text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  icon: "h-10 w-10",
};

export const buttonVariants = ({ 
  variant = "default", 
  size = "default" 
}: { 
  variant?: ButtonVariant; 
  size?: ButtonSize; 
} = {}) => {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant as ButtonVariant],
    sizeClasses[size as ButtonSize]
  );
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
