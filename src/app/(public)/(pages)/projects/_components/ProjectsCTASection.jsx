// src/app/(pages)/projects/_components/ProjectsCTASection.jsx

import Link from "next/link";
import { H2, P } from "@/components/ui/Typography";

export default function ProjectsCTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="p-10 sm:p-14 rounded-3xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <H2 className="text-white font-extrabold text-3xl sm:text-4xl">
            Have a Project in Mind?
          </H2>

          <P className="mt-4 text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
            Let’s turn your idea into a powerful, high-performance digital product together.
          </P>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary hover:bg-[#25b55e] text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(46,208,110,0.3)] hover:shadow-[0_0_35px_rgba(46,208,110,0.5)] hover:scale-[1.02]"
            >
              Start Your Project →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

