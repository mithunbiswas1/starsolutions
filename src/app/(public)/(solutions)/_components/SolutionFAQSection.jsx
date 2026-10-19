// src/app/(solutions)/_components/SolutionFAQSection.jsx

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
    question: "What is an ERP system and how does it help my business?",
    answer:
      "An ERP system integrates core business processes like finance, HR, inventory, and operations into a single platform, improving efficiency and decision-making.",
  },
  {
    question: "How long does it take to implement an ERP solution?",
    answer:
      "Implementation time depends on complexity, but typically ranges from a few weeks for basic setups to several months for enterprise-level systems.",
  },
  {
    question: "Can ERP be customized for my business needs?",
    answer:
      "Yes. Our ERP solutions are fully customizable to match your workflows, industry requirements, and operational structure.",
  },
  {
    question: "Is ERP suitable for small businesses?",
    answer:
      "Yes. ERP systems can be scaled for small, medium, and large enterprises depending on their operational needs and growth stage.",
  },
  {
    question: "Can ERP integrate with existing tools and software?",
    answer:
      "Absolutely. We integrate ERP systems with CRMs, accounting tools, payment gateways, and third-party APIs.",
  },
  {
    question: "Do you provide support after ERP deployment?",
    answer:
      "Yes. We offer continuous support, maintenance, updates, and optimization to ensure long-term system performance.",
  },
  {
    question: "Is ERP secure for sensitive business data?",
    answer:
      "Yes. We implement enterprise-grade security including encryption, role-based access control, and regular security audits.",
  },
  {
    question: "Can ERP grow with my business?",
    answer:
      "Yes. Our ERP systems are designed with scalability in mind, allowing you to add new modules and users as your business expands.",
  },
];

export default function SolutionFAQSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Sticky Left Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <H2 className="font-extrabold text-white mb-8 text-3xl sm:text-4xl">
              FAQ About ERP
            </H2>

            <div className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 lg:p-8 rounded-2xl">
              <H3 className="text-white font-bold mb-3 text-xl">
                Everything you need to know before starting ERP
              </H3>

              <P className="text-gray-300 mb-8 leading-relaxed text-sm sm:text-base">
                We help businesses design, build, and implement ERP systems that
                unify operations, improve efficiency, and support long-term
                growth.
              </P>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-primary hover:bg-[#25b55e] text-black font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(46,208,110,0.3)] hover:scale-[1.02]"
              >
                Talk to Experts
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

