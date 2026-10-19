// src/app/(pages)/projects/_components/ProjectsShowcaseSection.jsx

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { H2, H3, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

function ProjectCard({ item, reverse }) {
  return (
    <div className="group grid lg:grid-cols-2 overflow-hidden rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 transition-all duration-500">
      {/* Image */}
      <div
        className={`relative h-[260px] sm:h-[320px] lg:h-auto lg:min-h-[440px] overflow-hidden ${reverse ? "lg:order-1" : "lg:order-2"
          }`}
      >
        {item.thumbnail ? (
          <Image
            src={`${baseUriBackend}${item.thumbnail}`}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.02] flex items-center justify-center border-b lg:border-b-0 lg:border-l border-white/10">
            <span className="text-gray-500 text-sm">No Preview Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-center p-6 sm:p-10 lg:p-12 ${reverse ? "lg:order-2" : "lg:order-1"
          }`}
      >
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-primary">
            {item.category}
          </span>
        </div>

        {/* Title */}
        <H3 className="font-bold text-white mb-3 text-2xl sm:text-3xl leading-tight group-hover:text-primary transition-colors">
          {item.title}
        </H3>

        {/* Description */}
        <P className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
          {item.short_description ||
            item.description?.replace(/<[^>]*>/g, "").substring(0, 160) + "..."}
        </P>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-8">
          {item.technologies?.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="rounded-md bg-white/[0.04] text-gray-300 px-3 py-1 text-xs font-medium border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Button */}
        <div>
          <Link
            href={`/projects/${item.slug}`}
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

export default function ProjectsShowcaseSection({ projects }) {
  const projectList = projects?.data?.projects || [];

  // Get unique categories from projects
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(projectList.map((p) => p.category))];
    return ["All Projects", ...uniqueCategories];
  }, [projectList]);

  const [activeTab, setActiveTab] = useState(categories[0]);

  // Filter projects based on active tab
  const filteredProjects = useMemo(() => {
    if (activeTab === "All Projects") {
      return projectList;
    }
    return projectList.filter((p) => p.category === activeTab);
  }, [activeTab, projectList]);

  // If no projects, don't render
  if (projectList.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative overflow-hidden bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[350px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <H2 className="font-extrabold text-white mb-4 text-3xl sm:text-4xl">
            Our Success Stories
          </H2>

          <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
            With {projectList.length}+ successful projects delivered worldwide,
            we help startups, enterprises, and growing businesses transform
            ideas into impactful digital products that drive measurable results.
          </P>
        </div>

        {/* Tab System */}
        <div className="border-t border-white/10 pt-8">
          <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Mobile Tabs */}
            <div className="lg:hidden sticky top-16 bg-[#080c14]/90 backdrop-blur-md z-20 pb-4 mb-6 border-b border-white/10">
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex w-max gap-2 py-2">
                  {categories.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all
                        ${activeTab === tab
                          ? "bg-primary text-black font-semibold shadow-lg shadow-primary/20"
                          : "bg-white/[0.05] text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Tabs - Sticky */}
            <div className="hidden lg:block border-r border-white/10 pr-6">
              <div className="sticky top-24 flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-4 mb-2">
                  Filter by Category
                </span>
                {categories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-left text-sm rounded-xl transition-all duration-200
                      ${activeTab === tab
                        ? "bg-primary/15 text-primary border border-primary/30 font-semibold shadow-[0_0_15px_rgba(46,208,110,0.15)]"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects list */}
            <div className="space-y-6">
              {filteredProjects.map((item, index) => (
                <ProjectCard
                  key={item.id}
                  item={item}
                  reverse={index % 2 !== 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

