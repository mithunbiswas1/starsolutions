// src/app/(pages)/privacy-policy/page.jsx

import { H2, P } from "@/components/ui/Typography";
import PageBanner from "@/components/shared/PageBanner";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-transparent text-white min-h-screen">
      {/* Banner */}
      <PageBanner
        title="Privacy Policy"
        subtitle="At Star Solutions BD, we value your privacy. This policy explains how we collect, use, and protect your personal information when you use our services."
      />

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-12 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Intro */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">Overview</H2>
            <P className="text-gray-300 leading-relaxed">
              Star Solutions BD (“we”, “our”, or “us”) is committed to protecting your
              privacy. This Privacy Policy outlines how we collect, use, store,
              and safeguard your information when you interact with our website,
              applications, and services.
            </P>
          </div>

          {/* Section 1 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">1. Information We Collect</H2>
            <div className="space-y-4">
              <P className="text-gray-300 leading-relaxed">
                We may collect personal information such as your name, email
                address, phone number, company name, and project requirements when
                you contact us or fill out forms on our website.
              </P>

              <P className="text-gray-300 leading-relaxed">
                We also collect technical data including IP address, browser type,
                device information, pages visited, and usage patterns to improve
                our services.
              </P>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">2. How We Use Your Information</H2>
            <div className="space-y-4">
              <P className="text-gray-300 leading-relaxed">We use collected information to:</P>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Provide and maintain our services</li>
                <li>Respond to inquiries and client requests</li>
                <li>Deliver project updates and communication</li>
                <li>Improve website performance and user experience</li>
                <li>Send relevant business and service updates (if opted in)</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">3. Data Protection & Security</H2>
            <P className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures including
              encryption, secure servers, and access control to protect your data.
              However, no method of transmission over the internet is 100% secure.
            </P>
          </div>

          {/* Section 4 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">4. Cookies & Tracking</H2>
            <div className="space-y-4">
              <P className="text-gray-300 leading-relaxed">
                Our website uses cookies to enhance browsing experience, analyze
                traffic, and understand user behavior.
              </P>

              <P className="text-gray-300 leading-relaxed">
                You can disable cookies through your browser settings, but some
                features of the website may not function properly.
              </P>
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">5. Third-Party Services</H2>
            <P className="text-gray-300 leading-relaxed">
              We may use trusted third-party services such as analytics tools,
              hosting providers, and communication platforms. These services only
              access data necessary to perform their functions and are obligated
              to protect it.
            </P>
          </div>

          {/* Section 6 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">6. Data Sharing</H2>
            <P className="text-gray-300 leading-relaxed">
              We do not sell, trade, or rent your personal data. We may share
              information only when required by law or to fulfill service
              obligations with trusted partners.
            </P>
          </div>

          {/* Section 7 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">7. Your Rights</H2>
            <P className="text-gray-300 leading-relaxed">
              You have the right to request access, correction, or deletion of
              your personal data. You may also withdraw consent for data usage at
              any time by contacting us.
            </P>
          </div>

          {/* Section 8 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">8. Data Retention</H2>
            <P className="text-gray-300 leading-relaxed">
              We retain personal information only for as long as necessary to
              fulfill the purposes outlined in this policy or as required by law.
            </P>
          </div>

          {/* Section 9 */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">9. Changes to This Policy</H2>
            <P className="text-gray-300 leading-relaxed">
              Star Solutions BD may update this Privacy Policy periodically. Any
              changes will be posted on this page with an updated revision date.
            </P>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-8">
            <H2 className="font-extrabold text-white text-2xl mb-4">Contact Us</H2>
            <P className="text-gray-300 leading-relaxed">
              If you have any questions regarding this Privacy Policy, please
              contact us at:
            </P>
            <P className="font-medium text-primary mt-2">info@starsolutionsbd.com</P>
          </div>
        </div>
      </section>
    </main>
  );
}

