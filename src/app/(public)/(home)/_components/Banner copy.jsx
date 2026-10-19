// src/app/(home)/_components/Banner.jsx

"use client";

import { H1, H6 } from "@/components/ui/Typography";

export default function Banner({ banners }) {
  const bannerData = banners?.data?.banners[0];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] lg:min-h-screen flex flex-col justify-center pt-8 md:pt-16">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Title */}
        <H1 className="text-white">
          {bannerData?.first_title}
          {bannerData?.middle_title && (
            <>
              {" "}
              <span className="text-primary">{bannerData.middle_title}</span>
            </>
          )}
          {bannerData?.last_title && <> {bannerData.last_title}</>}
        </H1>

        {/* Description */}
        <H6 className="mt-7 text-white">
          {bannerData?.sub_title ||
            "We are your trusted development partner with just one goal in focus to build products that generate a lasting, profitable impact."}
        </H6>
      </div>
    </section>
  );
}
