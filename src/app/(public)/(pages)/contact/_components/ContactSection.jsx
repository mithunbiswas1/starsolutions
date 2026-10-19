// src/app/(pages)/contact/_components/ContactSection.jsx

"use client";

import ContactLeftContent from "./ContactLeftContent";
import ContactForm from "./ContactForm";

export default function ContactSection({ settings }) {
  return (
    <section className="bg-transparent py-20 lg:py-28 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <ContactLeftContent settings={settings} />

          {/* Right Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
