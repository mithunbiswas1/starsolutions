// src/app/(pages)/cookie-policy/page.jsx

import { H2, H6, P } from "@/components/ui/Typography";
import PageBanner from "@/components/shared/PageBanner";

export default function CookiePolicyPage() {
  return (
    <main className="bg-transparent text-white min-h-screen">
      {/* Banner */}
      <PageBanner
        title="Cookie Policy"
        subtitle="This Cookie Policy explains how Star Solutions BD uses cookies and similar technologies to improve your browsing experience and our services."
      />

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-12 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Overview */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">Overview</H2>
            <P className="text-gray-300 leading-relaxed">
              Star Solutions BD uses cookies and similar tracking technologies to
              enhance user experience, analyze website traffic, and improve our
              services. By using our website, you consent to the use of cookies as
              described in this policy.
            </P>
          </div>

          {/* What are cookies */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">1. What Are Cookies?</H2>
            <P className="text-gray-300 leading-relaxed">
              Cookies are small text files stored on your device when you visit a
              website. They help websites remember your preferences and activity
              to provide a better user experience.
            </P>
          </div>

          {/* Types of cookies */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-6">2. Types of Cookies We Use</H2>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <H6 className="font-bold text-white text-lg mb-2">Essential Cookies</H6>
                <P className="text-gray-300 leading-relaxed text-sm">
                  Required for the website to function properly. They enable core
                  features such as security, navigation, and access to secure
                  areas.
                </P>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <H6 className="font-bold text-white text-lg mb-2">Analytics Cookies</H6>
                <P className="text-gray-300 leading-relaxed text-sm">
                  Help us understand how visitors interact with our website by
                  collecting anonymous usage data.
                </P>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <H6 className="font-bold text-white text-lg mb-2">Functional Cookies</H6>
                <P className="text-gray-300 leading-relaxed text-sm">
                  Allow the website to remember choices you make, such as language
                  preferences or region.
                </P>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <H6 className="font-bold text-white text-lg mb-2">Marketing Cookies</H6>
                <P className="text-gray-300 leading-relaxed text-sm">
                  Used to deliver relevant advertisements and track campaign
                  performance (only if applicable).
                </P>
              </div>
            </div>
          </div>

          {/* Why we use cookies */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">3. Why We Use Cookies</H2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>To ensure website functionality</li>
              <li>To improve user experience</li>
              <li>To analyze traffic and performance</li>
              <li>To enhance security</li>
              <li>To personalize content</li>
            </ul>
          </div>

          {/* Third-party cookies */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">4. Third-Party Cookies</H2>
            <P className="text-gray-300 leading-relaxed">
              We may use third-party services such as Google Analytics or similar
              tools. These providers may set cookies to collect anonymous usage
              data for analytics and performance tracking.
            </P>
          </div>

          {/* Cookie control */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">5. How You Can Control Cookies</H2>
            <div className="space-y-4">
              <P className="text-gray-300 leading-relaxed">
                You can control or delete cookies through your browser settings at
                any time.
              </P>

              <P className="text-gray-300 leading-relaxed">
                Most browsers allow you to block or delete cookies, but doing so
                may affect the functionality of our website.
              </P>
            </div>
          </div>

          {/* Updates */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">6. Updates to This Policy</H2>
            <P className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in technology, legislation, or our services. Updates will be
              posted on this page.
            </P>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-8">
            <H2 className="font-extrabold text-white text-2xl mb-4">Contact Us</H2>
            <P className="text-gray-300 leading-relaxed">
              If you have any questions about our Cookie Policy, please contact us
              at:
            </P>
            <P className="font-medium text-primary mt-2">info@starsolutionsbd.com</P>
          </div>
        </div>
      </section>
    </main>
  );
}

