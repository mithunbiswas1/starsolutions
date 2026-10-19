// src/app/(home)/_components/IndustriesSection.jsx

import Image from "next/image";
import { H2, H3, H5, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

export default function IndustriesSection({ industries }) {
  const industryList = industries?.data?.industries || [];

  if (industryList.length === 0) return null;

  return (
    <section className="py-15 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <H2 className="font-bold mb-8">Industries We Serve</H2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {industryList.map((industry) => (
            <div
              key={industry.id}
              className="group relative aspect-4/5 overflow-hidden rounded-xl"
            >
              {/* Background Image */}
              <Image
                src={`${baseUriBackend}${industry.image}`}
                alt={industry.title}
                height={500}
                width={400}
                className="object-cover h-full w-auto transition duration-700 group-hover:scale-102"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/65 group-hover:bg-linear-to-t group-hover:from-black/90 group-hover:via-black/60 group-hover:to-transparent transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-3 lg:p-5 flex flex-col text-white">
                <H5 className="text-white font-semibold">Industry</H5>

                <div className="mt-auto">
                  <H3 className="font-bold text-white mb-3">
                    {industry.title}
                  </H3>

                  <P className="hidden lg:block text-white/90 opacity-0 group-hover:opacity-100 transition duration-300">
                    {industry.description}
                  </P>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
