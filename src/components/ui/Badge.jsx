// src/components/ui/Badge.jsx
"use client";

import { cn } from "@/lib/cn";
import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    success: "bg-green-50 text-green-700 border-green-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    info: "bg-green-50 text-green-700 border-green-200",
    dark: "bg-gray-800 text-white border-gray-700",
    outline: "bg-transparent text-gray-700 border-gray-300",
    gradient:
      "bg-gradient-to-r from-primary to-secondary text-white border-transparent",
    glass: "glass-badge bg-white/70 text-gray-800 border-white/50",
    glass_primary: "glass-badge bg-primary/10 text-primary border-primary/25",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const baseStyles =
    "inline-flex items-center gap-1.5 font-medium rounded-full border transition-all duration-200";

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Badge with icon support
const BadgeWithIcon = ({ children, icon, iconPosition = "left", ...props }) => {
  return (
    <Badge {...props}>
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </Badge>
  );
};

// Dot badge (for status indicators)
const DotBadge = ({ color = "gray", size = "md", className, ...props }) => {
  const colors = {
    gray: "bg-gray-400",
    primary: "bg-primary",
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-green-500",
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full",
        colors[color] || colors.gray,
        sizes[size] || sizes.md,
        className,
      )}
      {...props}
    />
  );
};

// Pill badge (for counts)
const PillBadge = ({ count, max = 99, variant = "danger", ...props }) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <Badge variant={variant} size="sm" {...props}>
      {displayCount}
    </Badge>
  );
};

export { Badge, BadgeWithIcon, DotBadge, PillBadge };
export default Badge;
