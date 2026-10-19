// src/app/(home)/_components/TechnologiesSection.jsx
import { H2 } from "@/components/ui/Typography";
import TechnologiesTabs from "../_clients/TechnologiesTabs";
import { technologiesData } from "../_data/technologiesData";

export default function TechnologiesSection() {
  return (
    <section className="py-16 sm:py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 lg:mb-10">
          <H2 className="font-bold text-white">Technologies We Use</H2>
        </div>

        {/* Frosted Glass Container for Tabs */}
        <div className="glass-dark bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <TechnologiesTabs />
        </div>
      </div>
    </section>
  );
}
