// src/app/(home)/page.jsx
import HomeView from "./_view/HomeView";
import { getHomeBannerList } from "@/lib/getHomeBannerApi";
import { getHomeCompanyList } from "@/lib/getHomeCompanyApi";
import { getHomeIndustryList } from "@/lib/getHomeIndustry";
import { getHomeAlliance } from "@/lib/getHomeAllianceApi";
import { getTestimonialList } from "@/lib/getTestimonialApi";

import { siteConfig } from "@/config/siteConfig";

export async function generateMetadata() {
  return {
    title: "Star Solutions BD | Top Software & Custom IT Solutions Company in Bangladesh",
    description:
      "Star Solutions (Star Solutions BD) is a leading software development company in Bangladesh. We deliver custom enterprise ERP, HRM, scalable web apps, mobile apps, and AI solutions.",
    keywords: siteConfig.keywords,
    alternates: {
      canonical: siteConfig.canonicalUrl,
    },
    openGraph: {
      title: "Star Solutions BD | Top Software & Custom IT Solutions Company in Bangladesh",
      description:
        "Star Solutions is a premier custom software development and IT engineering company in Bangladesh specializing in Enterprise ERP, Web, Mobile, and AI Automation.",
      url: siteConfig.domain,
      siteName: siteConfig.brandName,
      images: [
        {
          url: `${siteConfig.domain}/logo_white.png`,
          width: 1200,
          height: 630,
          alt: "Star Solutions BD - Software Development Company Bangladesh",
        },
      ],
    },
  };
}


export default async function Home() {
  let banners = null;
  let companies = null;
  let industries = null;
  let alliances = null;
  let testimonials = null;

  try {
    const [bannersRes, companiesRes, industriesRes, alliancesRes, testimonialsRes] =
      await Promise.allSettled([
        getHomeBannerList(),
        getHomeCompanyList(),
        getHomeIndustryList(),
        getHomeAlliance(),
        getTestimonialList(),
      ]);

    banners = bannersRes.status === "fulfilled" ? bannersRes.value : null;
    companies = companiesRes.status === "fulfilled" ? companiesRes.value : null;
    industries = industriesRes.status === "fulfilled" ? industriesRes.value : null;
    alliances = alliancesRes.status === "fulfilled" ? alliancesRes.value : null;
    testimonials = testimonialsRes.status === "fulfilled" ? testimonialsRes.value : null;
  } catch (error) {
    // Graceful fallback to static data
  }

  return (
    <HomeView
      initialData={{
        banners,
        companies,
        industries,
        alliances,
        testimonials,
      }}
    />
  );
}
