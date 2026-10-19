// src/app/(service)/_components/DevelopmentProcessSection.jsx

import { H2, P } from "@/components/ui/Typography";

function ProcessCard({ step, index }) {
  return (
    <div className="p-8 rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="text-4xl lg:text-5xl font-black tracking-tight text-primary/40 group-hover:text-primary transition-colors mb-6">
          {step.number}
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
          {step.title}
        </h3>

        <P className="text-gray-300 leading-relaxed text-sm">
          {step.description}
        </P>
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
        <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Stage 0{index + 1}</span>
      </div>
    </div>
  );
}

export default function DevelopmentProcessSection({ developmentProcessData }) {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[300px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-white/10">
            Methodology & Flow
          </div>
          <H2 className="font-extrabold text-white mb-4 text-3xl sm:text-4xl">
            {developmentProcessData.heading}
          </H2>

          <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
            {developmentProcessData.description}
          </P>
        </div>

        {/* Process Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developmentProcessData.processSteps.map((step, index) => (
            <ProcessCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}