// src/app/(pages)/contact/page.jsx

import PageBanner from "@/components/shared/PageBanner";
import ContactSection from "./_components/ContactSection";
import OfficeLocationsSection from "./_components/OfficeLocationsSection";
import { getSettings } from "@/lib/getSettingApi";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main>
      <PageBanner
        title="Contact Us"
        subtitle="Let's discuss your ideas and build innovative digital solutions together."
        backgroundImage="/contact/contact_banner.jpg"
      />

      <ContactSection settings={settings} />
      {/* <OfficeLocationsSection /> */}
    </main>
  );
}
