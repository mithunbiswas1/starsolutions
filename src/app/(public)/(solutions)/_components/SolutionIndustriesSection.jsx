// src/app/(solutions)/_components/SolutionIndustriesSection.jsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, H4, P } from "@/components/ui/Typography";

const industries = [
  {
    title: "Healthcare",
    description:
      "HIPAA-compliant healthcare solutions, telemedicine platforms, patient engagement apps, and remote care systems.",
  },
  {
    title: "Fintech",
    description:
      "Digital banking, payment gateways, investment platforms, e-wallets, and secure financial management applications.",
  },
  {
    title: "E-Commerce",
    description:
      "Marketplace platforms, mobile shopping experiences, inventory management, and personalized customer journeys.",
  },
  {
    title: "Logistics & Transportation",
    description:
      "Fleet management, route optimization, shipment tracking, and real-time logistics monitoring solutions.",
  },
  {
    title: "Education",
    description:
      "E-learning platforms, virtual classrooms, student engagement apps, and learning management systems.",
  },
  {
    title: "Real Estate",
    description:
      "Property listing platforms, virtual property tours, CRM integrations, and lead generation applications.",
  },
  {
    title: "Travel & Hospitality",
    description:
      "Booking platforms, itinerary management, loyalty programs, and personalized travel experiences.",
  },
  {
    title: "Food & Restaurant",
    description:
      "Food delivery solutions, restaurant management systems, online ordering, and customer loyalty apps.",
  },
  {
    title: "Fitness & Wellness",
    description:
      "Workout tracking, wearable integrations, nutrition planning, and health monitoring applications.",
  },
  {
    title: "Agriculture",
    description:
      "Smart farming solutions, crop monitoring, supply chain visibility, and agricultural data analytics.",
  },
  {
    title: "Enterprise Solutions",
    description:
      "Custom enterprise applications, workflow automation, internal tools, and operational management systems.",
  },
];

function IndustryCard({ industry }) {
  return (
    <div className="group rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
      <div>
        <H4 className="font-bold text-white mb-3 text-lg lg:text-xl group-hover:text-primary transition-colors">
          {industry.title}
        </H4>

        <P className="text-gray-300 mb-6 text-sm leading-relaxed">
          {industry.description}
        </P>
      </div>

      <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
        <span>Explore domain</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default function SolutionIndustriesSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14 items-end">
          <div>
            <H2 className="font-extrabold text-white text-3xl sm:text-4xl">
              Specialized Dashboard Solutions for Every Industry
            </H2>
          </div>

          <div>
            <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
              We build industry-focused Dashboard solutions that solve
              real-world challenges. Our expertise spans diverse sectors,
              enabling businesses to accelerate growth through innovative
              digital products.
            </P>
          </div>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <IndustryCard key={industry.title} industry={industry} />
          ))}

          {/* CTA Card */}
          <div className="rounded-2xl glass-dark bg-primary/10 border border-primary/30 p-8 flex flex-col justify-center items-center text-center min-h-[240px] shadow-[0_0_35px_rgba(46,208,110,0.15)] group hover:border-primary/60 transition-all">
            <H4 className="text-white font-extrabold mb-4 text-xl sm:text-2xl">
              Let's Turn Your Vision Into a Market-Leading Dashboard
            </H4>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-[#25b55e] text-black font-semibold text-sm transition-all shadow-[0_0_20px_rgba(46,208,110,0.3)] hover:scale-105"
            >
              <span>Let's Talk</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

