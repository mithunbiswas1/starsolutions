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
      <div className="bg-white rounded-sm border border-gray-200">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          {imageUrl ? (
            <Image
              src={`${baseUriBackend}${imageUrl}`}
              alt={study.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              {study.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-sm text-gray-500">{study.client}</span>
          </div>

          <H3 className="font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {study.title}
          </H3>

          <P className="text-gray-600 mb-4 line-clamp-3">
            {study.short_description ||
              study.description?.replace(/<[^>]*>/g, "").substring(0, 150)}
          </P>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {study.technologies?.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
            {study.technologies?.length > 3 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                +{study.technologies.length - 3}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
            Read Case Study →
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
      <section className="py-15 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <H2 className="font-bold mb-4">Success Stories That Inspire</H2>
            <P className="text-lg text-gray-600">
              No case studies available at the moment. Check back soon!
            </P>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-15 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <H2 className="font-bold mb-4">Success Stories That Inspire</H2>
          <P className="text-lg text-gray-600">
            Explore our portfolio of successful projects and see how we've
            helped businesses across industries achieve their goals through
            innovative digital solutions.
          </P>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogList.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
