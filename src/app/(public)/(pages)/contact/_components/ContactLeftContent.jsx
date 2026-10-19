// src/app/(pages)/contact/_components/ContactLeftContent.jsx

"use client";

import { H1, P } from "@/components/ui/Typography";
import { Mail, Map, Phone } from "lucide-react";

export default function ContactLeftContent({ settings }) {
  const settingsData = settings?.data || {};

  return (
    <div className="flex flex-col justify-between">
      <div>
        <H1 className="max-w-md">Got an idea for your project?</H1>

        <P className="mt-8 max-w-md text-xl lg:text-2xl leading-relaxed text-gray-700">
          We'd love to learn more about you and what we can design and build
          together.
        </P>
      </div>

      <div className="mt-16 space-y-6">
        {settingsData.email && (
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-black">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-semibold">
              {settingsData.email}
            </span>
          </div>
        )}

        {settingsData.phone && (
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-black">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-semibold">
              {settingsData.phone}
            </span>
          </div>
        )}

        {settingsData.address && (
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-black">
              <Map className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-semibold">
              {settingsData.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
