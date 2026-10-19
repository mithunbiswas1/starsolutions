// src/app/(pages)/contact/_components/ContactLeftContent.jsx

"use client";

import { H1, P } from "@/components/ui/Typography";
import { Mail, Map, Phone } from "lucide-react";

export default function ContactLeftContent({ settings }) {
  const settingsData = settings?.data || {};

  return (
    <div className="flex flex-col justify-between h-full space-y-10">
      <div>
        <H1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
          Got an idea for your <span className="text-primary drop-shadow-[0_0_20px_rgba(46,208,110,0.35)]">project?</span>
        </H1>

        <P className="mt-6 text-lg sm:text-xl leading-relaxed text-gray-300 max-w-lg">
          We'd love to learn more about you, understand your technical bottlenecks, and design scalable architecture together.
        </P>
      </div>

      <div className="space-y-6 pt-6">
        {settingsData.email && (
          <div className="flex items-center gap-4 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass-badge bg-primary/15 border border-primary/30 text-primary transition-all duration-300 group-hover:scale-105 shadow-md shadow-primary/10">
              <Mail className="h-5 w-5" />
            </div>
            <a
              href={`mailto:${settingsData.email}`}
              className="text-lg sm:text-xl font-semibold text-white group-hover:text-primary transition-colors"
            >
              {settingsData.email}
            </a>
          </div>
        )}

        {settingsData.phone && (
          <div className="flex items-center gap-4 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass-badge bg-primary/15 border border-primary/30 text-primary transition-all duration-300 group-hover:scale-105 shadow-md shadow-primary/10">
              <Phone className="h-5 w-5" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-white">
              {settingsData.phone}
            </span>
          </div>
        )}

        {settingsData.address && (
          <div className="flex items-center gap-4 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass-badge bg-secondary/15 border border-secondary/30 text-secondary transition-all duration-300 group-hover:scale-105 shadow-md shadow-secondary/10">
              <Map className="h-5 w-5" />
            </div>
            <span className="text-base sm:text-lg font-medium text-gray-300">
              {settingsData.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
