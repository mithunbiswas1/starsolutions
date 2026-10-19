// src/app/(pages)/package/_components/PricingSection.jsx

"use client";

import { Check } from "lucide-react";
import { H2, P } from "@/components/ui/Typography";
import Link from "next/link";

function PricingCard({ plan }) {
  const isHighlighted = Boolean(plan.badge || plan.theme === "dark");

  return (
    <div
      className={`rounded-3xl border p-8 h-full flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1.5 ${
        isHighlighted
          ? "glass-dark bg-white/[0.06] border-primary/40 shadow-[0_0_35px_rgba(46,208,110,0.15)] hover:border-primary"
          : "glass-dark bg-white/[0.03] border-white/10 hover:border-primary/40"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-2xl font-bold text-white">{plan.name}</h3>

          {plan.badge && (
            <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-semibold text-primary">
              {plan.badge}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-extrabold text-white">${plan.price}</span>
          <span className="text-sm text-gray-400 font-medium">/{plan.billing || "project"}</span>
        </div>

        <p className="mt-6 text-gray-300 text-sm leading-relaxed border-b border-white/10 pb-6">
          {plan.description}
        </p>

        <ul className="mt-6 space-y-3.5 text-sm text-gray-300">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="p-0.5 rounded-full bg-primary/20 text-primary mt-0.5 shrink-0">
                <Check size={14} />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-8 mt-6 border-t border-white/10">
        <Link href="/contact" className="block">
          <button
            className={`h-14 w-full rounded-full font-bold transition-all duration-300 cursor-pointer ${
              isHighlighted
                ? "bg-primary text-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02]"
                : "glass bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40"
            }`}
          >
            {plan.buttonText || "Get Started"}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function PricingSection({ packagesData }) {
  const packages = packagesData?.data?.packages || [];

  if (packages.length === 0) {
    return null;
  }

  return (
    <section className="bg-transparent py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <H2 className="font-bold mb-4 text-white">Transparent, Scalable Packages</H2>

          <P className="text-gray-300 text-lg leading-relaxed">
            From early-stage product MVPs to mission-critical enterprise engineering squads,
            select the engagement tier that aligns with your timeline and scalability goals.
          </P>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {packages.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
