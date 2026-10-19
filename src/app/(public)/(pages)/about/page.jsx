// src/app/(pages)/about/page.jsx

export const dynamic = "force-dynamic";
import PageBanner from "@/components/shared/PageBanner";
import ChairmanSection from "./_components/ChairmanSection";
import MissionVisionSection from "./_components/MissionVisionSection";
import CoreValuesSection from "./_components/CoreValuesSection";
import WhyChooseUsSection from "./_components/WhyChooseUsSection";
import CTASection from "./_components/CTASection";
import { getAbout } from "@/lib/getAboutApi";
import { baseUriBackend } from "@/redux/url/url";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

import { siteConfig } from "@/config/siteConfig";

export async function generateMetadata() {
  const about = await getAbout().catch(() => null);

  const data = about?.data || {};
  const title = data.title ? `${data.title} | ${siteConfig.brandName}` : `About Us | ${siteConfig.brandName}`;
  const description = data?.short_description || `About ${siteConfig.brandName} - Leading software development company in Bangladesh.`;
  const bannerImage = data?.banner_image ? `${baseUriBackend}${data.banner_image}` : `${siteConfig.domain}/logo_white.png`;

  return {
    title,
    description,
    keywords: [
      "About Star Solutions",
      "Star Solutions BD",
      "Software Company in Bangladesh",
      "Custom Software Development Dhaka",
      "IT Consulting Firm BD",
      ...siteConfig.keywords,
    ],

    authors: [{ name: siteConfig.brandName, url: siteConfig.domain }],
    creator: siteConfig.brandName,
    publisher: siteConfig.legalName,

    alternates: {
      canonical: `${siteConfig.domain}/about`,
    },

    openGraph: {
      title,
      description,
      url: `${siteConfig.domain}/about`,
      siteName: siteConfig.brandName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: bannerImage,
          width: 1200,
          height: 630,
          alt: data?.title || `About ${siteConfig.brandName}`,
        },
      ],
    },


    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [bannerImage],
    },

    category: "Technology",
  };
}

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <main>
      <PageBanner about={about} />
      <ChairmanSection about={about} />
      <MissionVisionSection about={about} />
      <CoreValuesSection />
      <WhyChooseUsSection />
      <CTASection />
    </main>
  );
}
