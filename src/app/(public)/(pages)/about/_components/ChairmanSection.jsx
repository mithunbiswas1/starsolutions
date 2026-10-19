// src/app/(pages)/about/_components/ChairmanSection.jsx

import Image from "next/image";
import { H2, H4, H5, H6, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";

export default function ChairmanSection({ about }) {
  const data = about?.data;

  if (!data) return null;

  return (
    <section className="py-15">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Image
            src={`${baseUriBackend}${data.chairman_image}`}
            alt={data.chairman_name || "Chairman"}
            width={600}
            height={700}
            className="rounded-xl"
            unoptimized
          />
        </div>

        <div>
          <H2>Message From Our Chairman</H2>

          {data.chairman_message?.split("\n").map((paragraph, index) => (
            <P key={index} className={index === 0 ? "mt-6" : "mt-4"}>
              {paragraph.trim()}
            </P>
          ))}

          <H4 className="mt-8">{data.chairman_name}</H4>
          <H6>{data.chairman_designation}</H6>
        </div>
      </div>
    </section>
  );
}
