"use client";

import Link from "next/link";
import { H2, H3, P } from "@/components/ui/Typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

const faqs = [
  {
    question: "Which package is best for my business?",
    answer:
      "Our Starter package is ideal for small businesses and startups, while Growth and Enterprise packages are designed for scaling companies that require advanced features, dedicated support, and custom solutions.",
  },
  {
    question: "Can I upgrade my package later?",
    answer:
      "Yes. You can upgrade your package at any time as your business grows. We'll help ensure a smooth transition with no disruption to your services.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. Our pricing is transparent, and all package inclusions are clearly outlined before the project begins.",
  },
  {
    question: "Do you offer custom packages?",
    answer:
      "Absolutely. If our standard packages don't fit your requirements, we can create a tailored solution based on your goals, timeline, and budget.",
  },
  {
    question: "What is included in ongoing support?",
    answer:
      "Support may include bug fixes, maintenance, performance monitoring, security updates, and technical assistance depending on the selected package.",
  },
  {
    question: "How does the payment process work?",
    answer:
      "Payments are typically divided into milestones. The exact structure depends on the project scope and package selected.",
  },
  {
    question: "How long does it take to get started?",
    answer:
      "Most projects can begin within a few business days after finalizing the package, requirements, and agreement.",
  },
  {
    question: "Can I switch to a custom enterprise solution later?",
    answer:
      "Yes. Many clients start with a standard package and later move to a fully customized enterprise engagement as their needs evolve.",
  },
];

export default function PackageFAQSection() {
  return (
    <section className="py-16 sm:py-24 bg-transparent relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Sticky Left Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <H2 className="font-bold mb-8 text-white">Frequently Asked Questions</H2>

            <div className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl">
              <H3 className="mb-4 text-white font-bold leading-snug">
                Flexible packages built for every stage of growth
              </H3>

              <P className="text-gray-300 mb-8 text-base leading-relaxed">
                Whether you're launching a startup, scaling a business, or
                managing enterprise operations, our packages provide the
                flexibility, support, and expertise needed to achieve your
                goals.
              </P>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_25px_rgba(46,208,110,0.4)] transition-all duration-300 hover:scale-[1.02]"
              >
                Talk to the Team
              </Link>
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-dark bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl px-6 transition-all duration-200"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-6 text-white hover:text-primary transition-colors hover:no-underline">
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
