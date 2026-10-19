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

export async function generateMetadata() {
  const about = await getAbout();

  const data = about?.data || {};
  const title = data.title ? `${data.title} | Logicraft IT` : "About Us | Logicraft IT";
  const description = data?.short_description || "About Logicraft IT";
  const bannerImage = data?.banner_image ? `${baseUriBackend}${data.banner_image}` : "/logo_black.png";

  return {
    title,
    description,

    keywords: [
      "About Us",
      "Logicraft IT",
      "Software Company",
      "Web Development",
      "Mobile App Development",
      "Digital Solutions",
      "Technology Partner",
      "Mission and Vision",
    ],

    authors: [
      {
        name: "Logicraft IT",
      },
    ],

    creator: "Logicraft IT",
    publisher: "Logicraft IT",

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: `${SITE_URL}/about`,
    },

    openGraph: {
      title,
      description,
      url: `${SITE_URL}/about`,
      siteName: "Logicraft IT",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: bannerImage,
          width: 1200,
          height: 630,
          alt: data?.title || "About Logicraft IT",
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
