// src/app/(home)/page.jsx

import Banner from "./_components/Banner";
import { BannerVideoBack } from "./_components/BannerVideoBack";
import CompanyLogoSection from "./_components/CompanyLogoSection";
import ServicesSection from "./_components/ServicesSection";
import SuccessStoriesSection from "./_components/SuccessStoriesSection";
import AtAGlanceSection from "./_components/AtAGlanceSection";
import TechnologiesSection from "./_components/TechnologiesSection";
import IndustriesSection from "./_components/IndustriesSection";
import TestimonialsSection from "./_components/TestimonialsSection";

import { getHomeBannerList } from "@/lib/getHomeBannerApi";
import { getHomeCompanyList } from "@/lib/getHomeCompanyApi";
import { getHomeIndustryList } from "@/lib/getHomeIndustry";
import { getHomeAlliance } from "@/lib/getHomeAllianceApi";
import { getTestimonialList } from "@/lib/getTestimonialApi";

export async function generateMetadata() {}

export default async function Home() {
  const banners = await getHomeBannerList();
  const companies = await getHomeCompanyList();
  const industries = await getHomeIndustryList();
  const alliances = await getHomeAlliance();
  const testimonials = await getTestimonialList();

  return (
    <main className="">
      <section className="relative w-full min-h-[70vh] lg:min-h-screen overflow-hidden">
        <BannerVideoBack banners={banners} />
        <Banner banners={banners} />
      </section>

      <CompanyLogoSection companies={companies} />
      <ServicesSection />
      <SuccessStoriesSection />
      <IndustriesSection industries={industries} />
      <TechnologiesSection />
      <AtAGlanceSection />
      <AtAGlanceSection alliances={alliances} />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
