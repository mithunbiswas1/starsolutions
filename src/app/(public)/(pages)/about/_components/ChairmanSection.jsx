// src/app/(pages)/about/_components/ChairmanSection.jsx

import Image from "next/image";
import { H2, H4, H5, H6, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

export default function ChairmanSection({ about }) {
  const data = about?.data;

  if (!data) return null;

  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500" />
          <div className="relative glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl overflow-hidden">
            <Image
              src={`${baseUriBackend}${data.chairman_image}`}
              alt={data.chairman_name || "Chairman"}
              width={600}
              height={700}
              className="rounded-xl w-full h-auto object-cover"
              unoptimized
            />
          </div>
        </div>

        <div>
          <H2 className="text-white font-bold mb-6">Message From Our Chairman</H2>

          <div className="space-y-4 text-gray-300 leading-relaxed text-base sm:text-lg">
            {data.chairman_message?.split("\n").map((paragraph, index) => (
              <P key={index} className="text-gray-300">
                {paragraph.trim()}
              </P>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <H4 className="text-white font-bold">{data.chairman_name}</H4>
            <H6 className="text-primary font-medium mt-1">{data.chairman_designation}</H6>
          </div>
        </div>
      </div>
    </section>
  );
}
