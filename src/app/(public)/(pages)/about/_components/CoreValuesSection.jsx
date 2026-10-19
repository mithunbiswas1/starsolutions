// src/app/(pages)/about/_components/CoreValuesSection.jsx

import {
  Users,
  Lightbulb,
  ShieldCheck,
  Award,
  BookOpen,
  Handshake,
} from "lucide-react";

import { H2, H3, H4, P } from "@/components/ui/Typography";

const values = [
  {
    title: "Client First",
    icon: Users,
    description:
      "Every solution begins with understanding our clients' goals, challenges, and long-term vision.",
  },
  {
    title: "Innovation",
    icon: Lightbulb,
    description:
      "We embrace modern technologies and creative thinking to build future-ready digital products.",
  },
  {
    title: "Transparency",
    icon: ShieldCheck,
    description:
      "Open communication, honest feedback, and clear processes build trusted relationships.",
  },
  {
    title: "Excellence",
    icon: Award,
    description:
      "We are committed to delivering high-quality solutions that exceed expectations.",
  },
  {
    title: "Continuous Learning",
    icon: BookOpen,
    description:
      "Technology evolves rapidly, and we continuously improve our skills to stay ahead.",
  },
  {
    title: "Long-Term Partnership",
    icon: Handshake,
    description:
      "We focus on building enduring partnerships that support sustainable business growth.",
  },
];

export default function CoreValuesSection() {
  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <H2 className="text-center mb-12 text-white font-bold">Our Core Values</H2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/10 glass-dark bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_35px_rgba(46,208,110,0.15)] shadow-xl"
              >
                {/* Top Green Accent Line on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="mb-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 text-primary border border-primary/20 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/10">
                    <Icon size={26} />
                  </div>
                </div>

                <H4 className="mb-3 text-white font-bold group-hover:text-primary transition-colors">{value.title}</H4>

                <P className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {value.description}
                </P>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
