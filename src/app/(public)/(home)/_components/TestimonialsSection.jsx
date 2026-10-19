// src/app/(home)/_components/TestimonialsSection.jsx
import Image from "next/image";
import { H2, H6, P } from "@/components/ui/Typography";
import { Star, Quote } from "lucide-react";
import { baseUriBackend } from "@/redux/url/url";
import { testimonialsData as defaultTestimonials } from "../_data/testimonialsData";

function TestimonialCard({ t }) {
  const imgSrc = t.image?.startsWith("/")
    ? t.image
    : t.image
    ? `${baseUriBackend}${t.image}`
    : "/user.png";

  return (
    <div className="relative w-72 lg:w-96 shrink-0 glass-dark bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:border-primary/40 rounded-2xl p-6 shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        {/* Quote icon */}
        <Quote className="text-primary mb-2 opacity-80 group-hover:opacity-100 transition-opacity" size={26} />

        {/* Rating Stars */}
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={15}
              className={`${
                i < (t.rating || 5)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Message */}
      <P className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-4">
        “{t.message}”
      </P>

      {/* User */}
      <div className="mt-6 flex items-center gap-3 pt-3 border-t border-white/10">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-white/15 shrink-0">
          <Image
            src={imgSrc}
            alt={t.name || "Client"}
            fill
            className="object-cover"
            unoptimized={imgSrc.endsWith(".png") || imgSrc.endsWith(".svg")}
          />
        </div>

        <div>
          <H6 className="font-bold text-sm text-white">{t.name}</H6>
          <P className="text-xs text-gray-400">
            {t.position} {t.company && `· ${t.company}`}
          </P>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ testimonials }) {
  const dynamicList = testimonials?.data?.testimonials || [];
  const testimonialList =
    dynamicList.length > 0 ? dynamicList : defaultTestimonials;

  return (
    <section className="py-20 lg:py-28 bg-transparent overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-secondary/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-12 relative z-10">
        <H2 className="font-bold text-center text-white">What Our Clients Say</H2>
      </div>

      {/* Marquee Container with Left & Right Gradient Mask Overlays */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-[#080c14] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-[#080c14] to-transparent z-10" />

        {/* TOP MARQUEE (left → right) */}
        <div className="relative mb-6">
          <div className="flex gap-6 w-max animate-marquee">
            {[...testimonialList, ...testimonialList].map((t, i) => (
              <TestimonialCard key={`top-${t.id || i}-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* BOTTOM MARQUEE (right → left) */}
        <div className="relative">
          <div className="flex gap-6 w-max animate-marquee-reverse">
            {[...testimonialList, ...testimonialList].map((t, i) => (
              <TestimonialCard key={`bottom-${t.id || i}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
