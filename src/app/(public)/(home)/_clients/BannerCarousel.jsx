"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H1, H6 } from "@/components/ui/Typography";

import Link from "next/link";

export default function BannerCarousel({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentBanner = banners[currentIndex] || banners[0] || {};

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] lg:min-h-screen flex flex-col justify-center pt-8 md:pt-16 text-center">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Title with Framer Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <H1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              {currentBanner?.first_title || "Leading Software &"}
              {currentBanner?.middle_title && (
                <>
                  {" "}
                  <span className="text-primary drop-shadow-[0_0_25px_rgba(46,208,110,0.45)]">
                    {currentBanner.middle_title}
                  </span>
                </>
              )}
              {currentBanner?.last_title && <> {currentBanner.last_title}</>}
            </H1>
          </motion.div>
        </AnimatePresence>

        {/* Description with Framer Motion */}
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={`desc-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
          >
            <H6 className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
              {currentBanner?.sub_title ||
                "Star Solutions (Star Solutions BD) architects mission-critical enterprise software, custom ERP, scalable web platforms, and mobile apps engineered for long-term growth."}
            </H6>
          </motion.div>
        </AnimatePresence> */}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap gap-4 items-center justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary hover:bg-[#25b55e] text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(46,208,110,0.35)] hover:shadow-[0_0_35px_rgba(46,208,110,0.5)] hover:scale-[1.02]"
          >
            Start Your Project →
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-white/20 hover:border-primary text-white hover:text-primary transition-all duration-300 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08]"
          >
            Explore Portfolio
          </Link>
        </div>

        {/* Dots Indicator with Glass styling */}
        {banners.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 pt-8"
          >
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${index === currentIndex
                  ? "w-8 h-2.5 bg-primary shadow-sm"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

