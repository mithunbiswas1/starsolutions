// src/app/(home)/_components/TestimonialsSection.jsx

import Image from "next/image";
import { H2, H6, P } from "@/components/ui/Typography";
import { Star, Quote } from "lucide-react";
import { baseUriBackend } from "@/redux/url/url";

function TestimonialCard({ t }) {
  return (
    <div className="relative w-70 lg:w-110 shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition">
      <div className="flex items-center justify-between mb-4">
        {/* Quote icon */}
        <Quote className="text-primary mb-4" size={28} />

        {/* Rating Stars */}
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${
                i < (t.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Message */}
      <P>“{t.message}”</P>

      {/* User */}
      <div className="mt-6 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={`${baseUriBackend}${t.image}`}
            alt={t.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div>
          <H6 className="font-semibold text-sm">{t.name}</H6>
          <P>
            {t.position} · {t.company}
          </P>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ testimonials }) {
  const testimonialList = testimonials?.data?.testimonials || [];

  if (testimonialList.length === 0) return null;

  return (
    <section className="py-20 bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <H2 className="font-bold text-center">What Our Clients Say</H2>
      </div>

      {/* TOP MARQUEE (left → right) */}
      <div className="relative mb-6">
        <div className="flex gap-6 w-max animate-marquee">
          {[...testimonialList, ...testimonialList].map((t, i) => (
            <TestimonialCard key={`top-${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* BOTTOM MARQUEE (right → left) */}
      <div className="relative">
        <div className="flex gap-6 w-max animate-marquee-reverse">
          {[...testimonialList, ...testimonialList].map((t, i) => (
            <TestimonialCard key={`bottom-${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
