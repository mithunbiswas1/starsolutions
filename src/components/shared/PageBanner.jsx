// src/components/shared/PageBanner.jsx

"use client";

import { H1, H6 } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";
import { usePathname } from "next/navigation";

export default function PageBanner({
  about,
  title,
  subtitle,
  backgroundImage,
  banner_image,
}) {
  const pathname = usePathname();
  const data = about?.data;

  const pageTitles = {
    "/package": "Our Packages",
    "/about": "About Our Company",
    "/case-studies": "Case Studies & Success Stories",
    "/projects": "Featured Client Projects",
    "/contact": "Connect With Engineering",
    "/privacy-policy": "Privacy Policy",
    "/terms-and-conditions": "Terms & Conditions",
    "/cookie-policy": "Cookie Policy",
  };

  const resolvedTitle =
    title ||
    data?.title ||
    pageTitles[pathname] ||
    pathname
      ?.split("/")
      ?.filter(Boolean)
      ?.pop()
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Star Solutions BD";

  const resolvedSubtitle = subtitle || data?.short_description || "";

  const rawImage =
    backgroundImage || banner_image || data?.banner_image || null;
  const imageSrc = rawImage
    ? rawImage.startsWith("/")
      ? rawImage
      : `${baseUriBackend}${rawImage}`
    : null;

  return (
    <section className="relative min-h-[50vh] sm:min-h-[58vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#080c14] border-b border-white/10">
      {/* Background Image (if present) */}
      {imageSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      )}

      {/* Ambient Radial Gradient Mesh for Glass Refraction */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-secondary/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Cyber Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/70 via-[#080c14]/40 to-[#080c14] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">


        <H1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(46,208,110,0.25)]">
          {resolvedTitle}
        </H1>

        {resolvedSubtitle && (
          <H6 className="text-gray-300 mt-4 max-w-2xl mx-auto font-normal text-base sm:text-lg leading-relaxed">
            {resolvedSubtitle}
          </H6>
        )}
      </div>
    </section>
  );
}
