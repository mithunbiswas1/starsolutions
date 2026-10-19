import Banner from "../_components/Banner";
import { BannerVideoBack } from "../_components/BannerVideoBack";
import CompanyLogoSection from "../_components/CompanyLogoSection";
import ServicesSection from "../_components/ServicesSection";
import SuccessStoriesSection from "../_components/SuccessStoriesSection";
import AtAGlanceSection from "../_components/AtAGlanceSection";
import TechnologiesSection from "../_components/TechnologiesSection";
import IndustriesSection from "../_components/IndustriesSection";
import TestimonialsSection from "../_components/TestimonialsSection";

export default function HomeView({ initialData = {} }) {
  const {
    banners = null,
    companies = null,
    industries = null,
    alliances = null,
    testimonials = null,
  } = initialData;

  return (
    <main className="min-h-screen bg-[#080c14] text-white relative selection:bg-primary selection:text-black overflow-x-hidden">
      <div className="relative z-10">
        {/* 1. Hero Section with Video/Image Background and Glass Carousel */}
        <section className="relative w-full min-h-[70vh] lg:min-h-screen overflow-hidden">
          <BannerVideoBack banners={banners} />
          <Banner banners={banners} />
          {/* Subtle bottom fade to blend with canvas */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#080c14] to-transparent pointer-events-none" />
        </section>

        {/* 2. Client & Alliance Logo Marquee */}
        <CompanyLogoSection companies={companies} />

        {/* 3. Core IT & Software Services */}
        <ServicesSection />

        {/* Luminous Section Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* 4. Client Success Stories */}
        <SuccessStoriesSection />

        {/* Luminous Section Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* 5. Industries We Serve */}
        <IndustriesSection industries={industries} />

        {/* Luminous Section Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* 6. Technologies We Use */}
        <TechnologiesSection />

        {/* Luminous Section Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* 7. Industry Alliance & Metrics At A Glance */}
        <AtAGlanceSection alliances={alliances} />

        {/* 8. Client Testimonials */}
        <TestimonialsSection testimonials={testimonials} />
      </div>
    </main>
  );
}
