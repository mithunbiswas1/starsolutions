import React from "react";
import { cn } from "@/lib/cn";

export function GlassCard({
  children,
  className,
  variant = "light",
  hover = true,
  ...props
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "rounded-2xl relative transition-all duration-300",
        isDark
          ? "glass-dark text-white"
          : "glass text-heading",
        hover && (isDark ? "hover:border-primary/40 hover:shadow-xl" : "glass-hover"),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({ className, children, ...props }) {
  return (
    <div className={cn("p-5 pb-2 flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-bold leading-tight tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function GlassCardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-5 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardFooter({ className, children, ...props }) {
  return (
    <div className={cn("p-5 pt-0 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export default GlassCard;
