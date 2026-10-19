// src/app/(home)/_components/ServicesSection.jsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, H3, H5, P } from "@/components/ui/Typography";
import { servicesData as defaultServices } from "../_data/servicesData";

export default function ServicesSection({ services = defaultServices }) {
  const serviceList = services && services.length > 0 ? services : defaultServices;

  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <H2 className="font-bold mb-8 sm:mb-10 text-white">
          From Idea to Scale — We Add Value at Every Stage
        </H2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {serviceList.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group relative aspect-4/6 overflow-hidden rounded-2xl cursor-pointer border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-[0_12px_35px_rgba(46,208,110,0.18)]"
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Glass Frosted Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 backdrop-blur-[2px] group-hover:from-black/95 group-hover:via-black/60 group-hover:to-transparent transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-3.5 sm:p-5 flex flex-col justify-between text-white">
                {/* Category Glass Badge */}
                <div className="self-start">
                  <span className="glass-badge bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-white/90 border border-white/15">
                    {service.category}
                  </span>
                </div>

                <div>
                  <H3 className="font-bold text-white mb-2 sm:mb-3 leading-snug">
                    {service.title}
                  </H3>

                  <P className="hidden lg:block text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed mb-4">
                    {service.description}
                  </P>

                  <div className="flex justify-end pt-2">
                    <div className="w-10 h-10 rounded-full glass-button bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                      <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
