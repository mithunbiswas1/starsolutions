// src/app/(service)/_components/ServiceBanner.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";

export default function ServiceBanner({ bannerData }) {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-[#080c14] text-white overflow-hidden flex items-center border-b border-white/10">
      {/* Mobile Background Image */}
      <div className="absolute inset-0 lg:hidden">
        {bannerData?.image && (
          <Image
            src={bannerData.image}
            alt={bannerData?.title || "Service"}
            fill
            priority
            className="object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-[#080c14]/80" />
      </div>

      {/* Ambient Radial Gradient Mesh */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/70 via-transparent to-[#080c14] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 lg:py-32">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Subtle Glass Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] text-primary text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Specialized IT Capability</span>
          </div>

          <H1 className="text-white font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6 drop-shadow-[0_0_20px_rgba(46,208,110,0.2)]">
            {bannerData?.title}
          </H1>

          <P className="text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl">
            {bannerData?.description}
          </P>

          {bannerData?.buttonLink && (
            <Link
              href={bannerData.buttonLink}
              className="inline-flex items-center gap-3 bg-primary hover:bg-[#25b55e] transition-all text-black font-semibold px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(46,208,110,0.3)] hover:shadow-[0_0_35px_rgba(46,208,110,0.5)] hover:scale-[1.02]"
            >
              <span>{bannerData?.buttonText || "Get Started"}</span>
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Right Image with Glass Mask */}
      {bannerData?.image && (
        <div className="hidden lg:block absolute top-0 right-0 h-full w-[45%] pointer-events-none">
          <Image
            src={bannerData.image}
            alt={bannerData?.title || "Service banner"}
            fill
            priority
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c14] via-transparent to-[#080c14]" />
        </div>
      )}
    </section>
  );
}

