// src/app/(pages)/contact/_components/ContactSection.jsx

"use client";

import ContactLeftContent from "./ContactLeftContent";
import ContactForm from "./ContactForm";

export default function ContactSection({ settings }) {
  return (
    <section className="bg-gray-100 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Content */}
          <ContactLeftContent settings={settings} />

          {/* Right Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
