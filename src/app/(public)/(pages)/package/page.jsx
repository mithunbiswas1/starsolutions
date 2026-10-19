// src/app/(pages)/package/page.jsx

import PageBanner from "@/components/shared/PageBanner";
import PricingSection from "./_components/PricingSection";
import PackageFAQSection from "./_components/PackageFAQSection";
import { getPackages } from "@/lib/getPackages";

export const metadata = {
  title: "Pricing & Packages | Choose Your Plan",
  description:
    "Explore our flexible pricing plans designed for startups, businesses, and enterprises. Find the perfect package for your needs.",
  keywords:
    "pricing, packages, plans, web development, software development, enterprise solutions",
  openGraph: {
    title: "Pricing & Packages | Choose Your Plan",
    description:
      "Explore our flexible pricing plans designed for startups, businesses, and enterprises.",
    url: "https://logicraftit.com",
    siteName: "LogiCraft IT",
    images: [
      {
        url: "/packages/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pricing Packages",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Packages | Choose Your Plan",
    description:
      "Explore our flexible pricing plans designed for startups, businesses, and enterprises.",
    images: ["/packages/twitter-image.jpg"],
  },
};

export default async function PackagesPage() {
  const packagesData = await getPackages();

  return (
    <main>
      <PageBanner
        title="Packages"
        subtitle="Flexible pricing plans designed for startups, businesses, and enterprises."
        backgroundImage="/packages/packages_banner.webp"
      />

      <PricingSection packagesData={packagesData} />
      <PackageFAQSection />
    </main>
  );
}
