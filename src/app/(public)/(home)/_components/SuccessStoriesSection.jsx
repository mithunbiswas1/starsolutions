// src/app/(home)/_components/SuccessStoriesSection.jsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, H4, P } from "@/components/ui/Typography";
import { successStoriesData as defaultStories } from "../_data/successStoriesData";

export default function SuccessStoriesSection({ stories = defaultStories }) {
  const displayStories = stories && stories.length > 0 ? stories : defaultStories;

  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <H2 className="font-bold text-white">Our Success Stories</H2>

          <Link
            href="/case-studies"
            className="hidden md:flex items-center gap-2 font-medium text-gray-300 hover:text-primary hover:gap-3 transition-all"
          >
            <span>More case studies</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Story Cards Grid with Glass Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayStories.slice(0, 3).map((story, index) => (
            <Link
              key={index}
              href={story.link}
              className="block group glass-dark bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:border-primary/40 rounded-2xl p-4 sm:p-5 shadow-xl hover:shadow-[0_12px_35px_rgba(46,208,110,0.15)] transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-xl bg-gray-900">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={700}
                  height={700}
                  className="w-full aspect-8/9 object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-5">
                <H4 className="font-bold mb-2 text-white group-hover:text-primary transition-colors">
                  {story.title}
                </H4>
                <P className="text-gray-300 line-clamp-3 text-sm leading-relaxed">
                  {story.description}
                </P>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Link */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-semibold text-primary"
          >
            <span>More case studies</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
