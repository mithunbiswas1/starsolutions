// src/app/(pages)/case-studies/_components/CaseStudiesGrid.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { H2, H3, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

function CaseStudyCard({ study }) {
  // Get image from banner or thumbnail
  const imageUrl = study.banner || study.thumbnail;

  return (
    <Link href={`/case-studies/${study.slug}`} className="group block">
      <div className="glass-dark bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-primary/40 overflow-hidden shadow-xl hover:shadow-[0_12px_35px_rgba(46,208,110,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-900">
          {imageUrl ? (
            <Image
              src={`${baseUriBackend}${imageUrl}`}
              alt={study.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="glass-badge bg-primary/20 backdrop-blur-md text-primary border border-primary/30 px-3 py-1 rounded-md text-xs font-semibold">
              {study.category || "Case Study"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
          <div>
            {study.client && (
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{study.client}</span>
              </div>
            )}

            <H3 className="text-white font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-xl leading-snug">
              {study.title}
            </H3>

            <P className="text-gray-300 mb-5 line-clamp-3 text-sm leading-relaxed">
              {study.short_description ||
                study.description?.replace(/<[^>]*>/g, "").substring(0, 150)}
            </P>
          </div>

          <div>
            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-white/10">
              {study.technologies?.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="text-xs glass-badge bg-white/[0.04] border border-white/10 text-gray-300 px-2.5 py-0.5 rounded-md"
                >
                  {tech}
                </span>
              ))}
              {study.technologies?.length > 3 && (
                <span className="text-xs glass-badge bg-white/[0.04] border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-md">
                  +{study.technologies.length - 3}
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
              <span>Read Case Study</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CaseStudiesGrid({ blogs }) {
  const blogList = blogs?.data?.blogs || [];

  if (blogList.length === 0) {
    return (
      <section className="py-16 sm:py-24 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <H2 className="font-bold mb-4 text-white">Success Stories That Inspire</H2>
            <P className="text-lg text-gray-400">
              No case studies available at the moment. Check back soon!
            </P>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <H2 className="font-bold mb-4 text-white">Success Stories That Inspire</H2>
          <P className="text-lg text-gray-300 leading-relaxed">
            Explore our portfolio of successful projects and see how we've
            helped businesses across industries achieve their goals through
            innovative digital solutions.
          </P>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogList.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
