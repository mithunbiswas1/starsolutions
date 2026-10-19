// src/app/(pages)/projects/_components/ProjectsShowcaseSection.jsx

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { H2, H3, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

function ProjectCard({ item, reverse }) {
  return (
    <div className="group grid lg:grid-cols-2 overflow-hidden bg-white">
      {/* Image */}
      <div
        className={`relative h-[240px] sm:h-[300px] lg:h-auto lg:min-h-[500px] ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {item.thumbnail ? (
          <Image
            src={`${baseUriBackend}${item.thumbnail}`}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`bg-gray-100 flex flex-col justify-center p-6 sm:p-8 lg:p-16 ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        {/* Category */}
        <span className="text-sm font-semibold text-primary mb-3">
          {item.category}
        </span>

        {/* Title */}
        <H3 className="font-bold mb-4 leading-tight">{item.title}</H3>

        {/* Description */}
        <P className="text-gray-600 mb-6 leading-7">
          {item.short_description ||
            item.description?.replace(/<[^>]*>/g, "").substring(0, 150) + "..."}
        </P>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {item.technologies?.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium border border-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Button */}
        <div>
          <Link
            href={`/projects/${item.slug}`}
            className="inline-flex items-center gap-2 font-medium transition-all duration-300 hover:gap-3"
          >
            View Case Study →
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
    <section className="py-15 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <H2 className="font-bold mb-6">Our Success Stories</H2>

          <P className="text-gray-600">
            With {projectList.length}+ successful projects delivered worldwide,
            we help startups, enterprises, and growing businesses transform
            ideas into impactful digital products that drive measurable results.
          </P>
        </div>

        {/* Tab System - Same as Technologies Section */}
        <div className="lg:border-t lg:border-gray-300">
          <div className="lg:grid lg:grid-cols-[320px_1fr]">
            {/* Mobile Tabs */}
            <div className="lg:hidden sticky top-10 bg-white z-20 border-b border-gray-300">
              <div className="overflow-x-auto">
                <div className="flex w-max gap-2 px-4 py-4">
                  {categories.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all
                        ${
                          activeTab === tab
                            ? "bg-primary text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Tabs - Sticky */}
            <div className="hidden lg:block border-r border-gray-300">
              <div className="sticky top-16 flex flex-col py-4">
                {categories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`mx-3 my-1 px-4 py-3 text-left text-lg rounded-full transition-all
                      ${
                        activeTab === tab
                          ? "bg-primary text-white font-semibold"
                          : "hover:bg-gray-200"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects with alternating layout */}
            <div className="space-y-px bg-gray-200">
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
