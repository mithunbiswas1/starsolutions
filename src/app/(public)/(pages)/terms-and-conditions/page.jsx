// src/app/(pages)/terms-and-conditions/page.jsx

import { H2, P } from "@/components/ui/Typography";
import PageBanner from "@/components/shared/PageBanner";

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-transparent text-white min-h-screen">
      {/* Banner */}
      <PageBanner
        title="Terms & Conditions"
        subtitle="These Terms & Conditions govern your use of Star Solutions BD services, website, and products. Please read them carefully before using our services."
      />

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-12 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Overview */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">Overview</H2>
            <P className="text-gray-300 leading-relaxed">
              By accessing or using Star Solutions BD (“we”, “our”, “us”) website and
              services, you agree to be bound by these Terms & Conditions. If you
              do not agree, please do not use our services.
            </P>
          </div>

          {/* Services */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">1. Services</H2>
            <P className="text-gray-300 leading-relaxed">
              Star Solutions BD provides software development, enterprise ERP systems,
              web applications, mobile apps, UI/UX design, cloud solutions, and digital transformation
              services. We reserve the right to modify or discontinue any service
              at any time without notice.
            </P>
          </div>

          {/* Use of website */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">2. Use of Website</H2>
            <P className="text-gray-300 leading-relaxed">
              You agree to use our website only for lawful purposes. You must not
              attempt to gain unauthorized access, disrupt services, or misuse any
              content available on our website.
            </P>
          </div>

          {/* Intellectual property */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">3. Intellectual Property</H2>
            <P className="text-gray-300 leading-relaxed">
              All content, including text, graphics, logos, designs, and software,
              belongs to Star Solutions BD unless otherwise stated. Unauthorized use,
              reproduction, or distribution is strictly prohibited.
            </P>
          </div>

          {/* Project terms */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">4. Project Terms</H2>
            <P className="text-gray-300 leading-relaxed">
              Each project will be governed by a separate agreement outlining
              scope, timeline, and deliverables. Any changes to scope may affect
              cost and delivery time.
            </P>
          </div>

          {/* Payments */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">5. Payments</H2>
            <P className="text-gray-300 leading-relaxed">
              Payment terms are defined in individual project agreements. Delayed
              payments may result in suspension or delay of services.
            </P>
          </div>

          {/* Third-party services */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">6. Third-Party Services</H2>
            <P className="text-gray-300 leading-relaxed">
              We may use third-party tools or services. Star Solutions BD is not
              responsible for issues caused by third-party providers.
            </P>
          </div>

          {/* Limitation of liability */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">7. Limitation of Liability</H2>
            <P className="text-gray-300 leading-relaxed">
              Star Solutions BD shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our services or
              website.
            </P>
          </div>

          {/* No guarantees */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">8. No Guarantees</H2>
            <P className="text-gray-300 leading-relaxed">
              While we strive to deliver high-quality services, we do not
              guarantee uninterrupted or error-free operation of our services.
            </P>
          </div>

          {/* Termination */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">9. Termination</H2>
            <P className="text-gray-300 leading-relaxed">
              We reserve the right to suspend or terminate access to our services
              if users violate these Terms & Conditions.
            </P>
          </div>

          {/* Changes */}
          <div>
            <H2 className="font-extrabold text-white text-2xl mb-4">10. Changes to Terms</H2>
            <P className="text-gray-300 leading-relaxed">
              Star Solutions BD may update these Terms & Conditions at any time.
              Updates will be posted on this page with a revised date.
            </P>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-8">
            <H2 className="font-extrabold text-white text-2xl mb-4">Contact Us</H2>
            <P className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms & Conditions, please
              contact us at:
            </P>
            <P className="font-medium text-primary mt-2">info@starsolutionsbd.com</P>
          </div>
        </div>
      </section>
    </main>
  );
}

