// src/app/(home)/_components/IndustriesSection.jsx
import Image from "next/image";
import { H2, H3, H4, H5, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";
import { industriesData as defaultIndustries } from "../_data/industriesData";

export default function IndustriesSection({ industries }) {
  const dynamicIndustries = industries?.data?.industries || [];
  const industryList =
    dynamicIndustries.length > 0 ? dynamicIndustries : defaultIndustries;

  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <H2 className="font-bold mb-8 sm:mb-10 text-white">Industries We Serve</H2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {industryList.map((industry) => (
            <div
              key={industry.id}
              className="group relative aspect-4/5 overflow-hidden rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-[0_12px_35px_rgba(46,208,110,0.18)]"
            >
              {/* Background Image */}
              <Image
                src={
                  industry.image?.startsWith("/")
                    ? industry.image
                    : `${baseUriBackend}${industry.image}`
                }
                alt={industry.title}
                height={500}
                width={400}
                className="object-cover h-full w-auto opacity-80 group-hover:opacity-100 transition duration-700 group-hover:scale-105"
              />

              {/* Frosted Glass Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 backdrop-blur-[2px] group-hover:from-black/95 group-hover:via-black/60 group-hover:to-transparent transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-3.5 lg:p-5 flex flex-col justify-between text-white">
                <div className="self-start">
                  <span className="glass-badge bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-white/90 border border-white/15">
                    Industry
                  </span>
                </div>

                <div className="mt-auto">
                  <H4 className="font-bold text-white mb-2 leading-snug">
                    {industry.title}
                  </H4>

                  <P className="hidden lg:block text-white/90 text-sm opacity-0 group-hover:opacity-100 transition duration-300 leading-relaxed">
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
