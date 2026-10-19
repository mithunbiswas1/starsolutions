// src/app/(pages)/about/_components/MissionVisionSection.jsx

import Image from "next/image";
import { H2, H3, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

export default function MissionVisionSection({ about }) {
  const data = about?.data;

  if (!data) return null;

  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <H2 className="text-center mb-12 text-white font-bold">Mission & Vision</H2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="glass-dark bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-primary/40 rounded-2xl p-8 flex flex-col justify-between min-h-120 transition-all duration-300 shadow-xl">
            <div className="relative h-full max-h-70 w-auto flex justify-center">
              <Image
                src="/about/mission.png"
                alt="Mission"
                height={800}
                width={400}
                className="h-full w-auto object-contain brightness-110"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <H3 className="mb-3 text-white font-bold">Mission</H3>
              <P className="text-gray-300 leading-relaxed text-base">{data.mission}</P>
            </div>
          </div>

          {/* Vision */}
          <div className="glass-dark bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-primary/40 rounded-2xl p-8 flex flex-col justify-between min-h-120 transition-all duration-300 shadow-xl">
            <div className="mb-8 pb-6 border-b border-white/10">
              <H3 className="mb-3 text-white font-bold">Vision</H3>
              <P className="text-gray-300 leading-relaxed text-base">{data.vision}</P>
            </div>

            <div className="relative h-full max-h-70 w-auto flex justify-center">
              <Image
                src="/about/vision1.webp"
                alt="Vision"
                height={800}
                width={400}
                className="h-full w-auto object-center brightness-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
