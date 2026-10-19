// src/app/(home)/_components/Banner.jsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H1, H6 } from "@/components/ui/Typography";

export default function Banner({ banners }) {
  const bannerData = banners?.data?.banners || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (bannerData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === bannerData.length - 1 ? 0 : prev + 1,
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerData.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // If no banners, show fallback
  if (!bannerData || bannerData.length === 0) {
    return (
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] lg:min-h-screen flex flex-col justify-center pt-8 md:pt-16">
        <div className="max-w-2xl mx-auto space-y-4">
          <H1 className="text-white">We are a Software Development Company</H1>
          <H6 className="mt-7 text-white">
            We are your trusted development partner with just one goal in focus
            to build products that generate a lasting, profitable impact.
          </H6>
        </div>
      </section>
    );
  }

  const currentBanner = bannerData[currentIndex];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] lg:min-h-screen flex flex-col justify-center pt-8 md:pt-16">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Title with Framer Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <H1 className="text-white">
              {currentBanner?.first_title}
              {currentBanner?.middle_title && (
                <>
                  {" "}
                  <span className="text-primary">
                    {currentBanner.middle_title}
                  </span>
                </>
              )}
              {currentBanner?.last_title && <> {currentBanner.last_title}</>}
            </H1>
          </motion.div>
        </AnimatePresence>

        {/* Description with Framer Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`desc-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
          >
            <H6 className="mt-7 text-white">
              {currentBanner?.sub_title ||
                "We are your trusted development partner with just one goal in focus to build products that generate a lasting, profitable impact."}
            </H6>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator with Framer Motion */}
        {bannerData.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            {bannerData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
