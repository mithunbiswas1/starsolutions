// src/app/(pages)/case-studies/page.jsx

import PageBanner from "@/components/shared/PageBanner";
import CaseStudiesGrid from "./_components/CaseStudiesGrid";
import CTASection from "./_components/CTASection";
import { getListBlogs } from "@/lib/getBlogApi";

export async function generateMetadata() {
  return {
    title: "Case Studies | Our Success Stories",
    description:
      "Discover how we've helped businesses transform their ideas into successful digital products through innovation and expertise.",
  };
}

export default async function CaseStudiesPage() {
  const blogs = await getListBlogs({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <main>
      <PageBanner
        title="Case Studies"
        subtitle="Discover how we've helped businesses transform their ideas into successful digital products through innovation and expertise."
        backgroundImage="/case-studies/case-studies-banner.webp"
      />

      <CaseStudiesGrid blogs={blogs} />
      <CTASection />
    </main>
  );
}
