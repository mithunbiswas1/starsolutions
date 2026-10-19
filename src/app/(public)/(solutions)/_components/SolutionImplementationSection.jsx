// src/app/(solutions)/_components/SolutionImplementationSection.jsx

import { H2, H3, P } from "@/components/ui/Typography";

const steps = [
  {
    number: "01",
    title: "Business Analysis",
    description:
      "We analyze your business processes, workflows, and requirements to design a tailored ERP roadmap.",
  },
  {
    number: "02",
    title: "System Design",
    description:
      "We define architecture, modules, integrations, and data structure aligned with your business goals.",
  },
  {
    number: "03",
    title: "Development & Customization",
    description:
      "We build and customize ERP modules using scalable and secure modern technologies.",
  },
  {
    number: "04",
    title: "Integration",
    description:
      "We integrate third-party systems like CRM, accounting tools, payment gateways, and APIs.",
  },
  {
    number: "05",
    title: "Testing & QA",
    description:
      "We perform rigorous testing to ensure performance, security, and accuracy across all modules.",
  },
  {
    number: "06",
    title: "Deployment",
    description:
      "We deploy your ERP system with proper configuration, migration, and environment setup.",
  },
  {
    number: "07",
    title: "Training & Onboarding",
    description:
      "We train your team to ensure smooth adoption and efficient usage of the ERP system.",
  },
  {
    number: "08",
    title: "Support & Optimization",
    description:
      "We provide ongoing support, updates, and performance optimization for long-term success.",
  },
];

function StepCard({ step, index }) {
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

        <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Phase {step.number}</span>
      </div>
    </div>
  );
}

export default function SolutionImplementationSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <H2 className="font-extrabold text-white mb-4 text-3xl sm:text-4xl">
            ERP Implementation Process That Ensures Success
          </H2>

          <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Our structured ERP implementation approach ensures smooth
            deployment, minimal disruption, and maximum business efficiency from
            day one.
          </P>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
