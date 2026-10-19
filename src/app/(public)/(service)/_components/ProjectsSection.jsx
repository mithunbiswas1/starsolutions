// src/app/(service)/_components/ProjectsSection.jsx

import Image from "next/image";
import Link from "next/link";
import { H2, H3, P } from "@/components/ui/Typography";

function ProjectCard({ item, reverse }) {
  return (
    <div className="group grid lg:grid-cols-2 overflow-hidden rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 transition-all duration-500">
      {/* Image */}
      <div
        className={`relative h-64 sm:h-80 lg:h-auto lg:min-h-[440px] overflow-hidden ${reverse ? "lg:order-1" : "lg:order-2"
          }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div
        className={`p-6 sm:p-10 lg:p-12 flex flex-col justify-center ${reverse ? "lg:order-2" : "lg:order-1"
          }`}
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Featured Case
          </span>
        </div>

        <H3 className="font-bold text-white mb-4 text-2xl lg:text-3xl max-w-lg leading-tight group-hover:text-primary transition-colors">
          {item.title}
        </H3>

        <P className="text-gray-300 mb-8 max-w-xl leading-relaxed text-sm sm:text-base">
          {item.description}
        </P>

        <div>
          <Link
            href={item.link}
            className="inline-flex items-center gap-2 font-semibold text-primary hover:text-white transition-colors duration-300 group/btn"
          >
            <span>View Case Study</span>
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection({ projectsData }) {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <H2 className="font-extrabold text-white mb-4 text-3xl sm:text-4xl">
            {projectsData.heading}
          </H2>

          <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
            {projectsData.description}
          </P>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {projectsData.projects.map((item, index) => (
            <ProjectCard key={index} item={item} reverse={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

