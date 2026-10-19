// src/app/(pages)/package/page.jsx

import PageBanner from "@/components/shared/PageBanner";
import PricingSection from "./_components/PricingSection";
import PackageFAQSection from "./_components/PackageFAQSection";
import { getPackages } from "@/lib/getPackages";

export const metadata = {
  title: "Pricing & Packages | Star Solutions BD",
  description:
    "Explore our flexible pricing plans designed for startups, businesses, and enterprises in Bangladesh & worldwide by Star Solutions BD.",
  keywords:
    "star solutions pricing, star solutions bd packages, software development cost bangladesh, erp pricing bd, web development package dhaka",
  openGraph: {
    title: "Pricing & Packages | Star Solutions BD",
    description:
      "Explore flexible pricing plans for custom software, ERP, mobile apps, and enterprise solutions by Star Solutions BD.",
    url: "https://starsolutionsbd.com/package",
    siteName: "Star Solutions BD",
    images: [
      {
        url: "/home/banner/banner.webp",
        width: 1200,
        height: 630,
        alt: "Star Solutions BD Pricing Packages",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Packages | Star Solutions BD",
    description:
      "Explore flexible pricing plans for custom software, ERP, mobile apps, and enterprise solutions by Star Solutions BD.",
    images: ["/home/banner/banner.webp"],
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
