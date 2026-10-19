// src/app/(pages)/about/_components/CTASection.jsx

import Link from "next/link";
import { H2, P } from "@/components/ui/Typography";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-white/[0.01] border-t border-white/10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/[0.08] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <H2 className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl">
          Let's Build Something <span className="text-primary drop-shadow-[0_0_20px_rgba(46,208,110,0.35)]">Amazing</span> Together
        </H2>

        <P className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Whether you're a startup or an enterprise, we're ready to help bring your vision to life with resilient code and modern architecture.
        </P>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center mt-8 px-9 py-4 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_25px_rgba(46,208,110,0.4)] transition-all duration-300 hover:scale-105"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
