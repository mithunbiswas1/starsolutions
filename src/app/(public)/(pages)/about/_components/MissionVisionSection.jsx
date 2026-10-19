// src/app/(pages)/about/_components/MissionVisionSection.jsx

import Image from "next/image";
import { H2, H3, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

export default function MissionVisionSection({ about }) {
  const data = about?.data;

  if (!data) return null;

  return (
    <section className="py-15 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <H2 className="text-center mb-10">Mission & Vision</H2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-120">
            <div className="relative h-full max-h-70 w-auto flex justify-center">
              <Image
                src="/about/mission.png"
                alt="Mission"
                height={800}
                width={400}
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="mt-10">
              <H3 className="mb-4">Mission</H3>
              <P className="text-gray-600 leading-relaxed">{data.mission}</P>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-120">
            <div>
              <H3 className="mb-4">Vision</H3>
              <P className="text-gray-600 leading-relaxed">{data.vision}</P>
            </div>

            <div className="relative h-full max-h-70 w-auto flex justify-center">
              <Image
                src="/about/vision1.webp"
                alt="Vision"
                height={800}
                width={400}
                className="h-full w-auto object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
