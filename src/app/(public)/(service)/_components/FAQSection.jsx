// src/app/(service)/_components/FAQSection.jsx

"use client";

import Link from "next/link";
import { H2, H3, P } from "@/components/ui/Typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

export default function FAQSection({ faqData }) {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Sticky Left Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-white/10">
              Clear Answers
            </div>
            <H2 className="font-extrabold text-white mb-8 text-3xl sm:text-4xl">
              {faqData.heading}
            </H2>

            <div className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 lg:p-8 rounded-2xl">
              <H3 className="text-white font-bold mb-3 text-xl">{faqData.sidebarTitle}</H3>

              <P className="text-gray-300 mb-8 leading-relaxed text-sm sm:text-base">
                {faqData.sidebarDescription}
              </P>

              <Link
                href={faqData.sidebarButtonLink}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-primary hover:bg-[#25b55e] text-black font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(46,208,110,0.3)] hover:scale-[1.02]"
              >
                {faqData.sidebarButtonText}
              </Link>
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 rounded-2xl px-6 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left text-white hover:text-primary text-base sm:text-lg font-semibold py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent className="text-gray-300 pb-6 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

