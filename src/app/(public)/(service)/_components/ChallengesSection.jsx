// src/components/services/ChallengesSection.jsx

import { H2, H3, P } from "@/components/ui/Typography";

export default function ChallengesSection({ challengesData }) {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="max-w-3xl mb-12">
          <H2 className="font-extrabold text-white mb-4 text-3xl sm:text-4xl">
            {challengesData.heading}
          </H2>

          <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
            {challengesData.description}
          </P>
        </div>

        {/* Challenge Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {challengesData.challenges.map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm mb-6 group-hover:scale-110 transition-transform">
                0{index + 1}
              </div>
              <H3 className="font-bold text-white mb-3 text-xl group-hover:text-primary transition-colors">
                {item.title}
              </H3>

              <P className="text-gray-300 leading-relaxed text-sm">
                {item.description}
              </P>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

