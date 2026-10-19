import React from "react";
import { cn } from "@/lib/cn";
import { H2 } from "@/components/ui/Typography";
import Badge from "@/components/ui/Badge";

export default function SectionHeader({
  badge,
  badgeVariant = "glass_primary",
  title,
  subtitle,
  align = "left",
  className,
}) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "mb-8 lg:mb-10",
        isCenter ? "text-center mx-auto max-w-3xl" : "text-left",
        className
      )}
    >
      {badge && (
        <div className={cn("mb-3 flex", isCenter ? "justify-center" : "justify-start")}>
          <Badge variant={badgeVariant} size="sm">
            {badge}
          </Badge>
        </div>
      )}

      <H2 className="font-bold text-heading">
        {title}
      </H2>

      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
