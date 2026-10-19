// src/components/shared/PageBanner.jsx

"use client";

import { H1, H6 } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";
import { usePathname } from "next/navigation";

export default function PageBanner({ about }) {
  const pathname = usePathname();
  const data = about?.data;

  const pageTitles = {
    "/package": "Our Packages",
    "/about": "About Our Company",
  };

  const fallbackTitle =
    pageTitles[pathname] ||
    pathname
      ?.split("/")
      ?.filter(Boolean)
      ?.pop()
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "About Our Company";

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${baseUriBackend}${data?.banner_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 text-center max-w-4xl mt-10 px-4">
        <H1 className="text-white">{data?.title || fallbackTitle}</H1>

        <H6 className="text-white mt-2">{data?.short_description || ""}</H6>
      </div>
    </section>
  );
}
