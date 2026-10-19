// src/config/siteConfig.js
/**
 * Master SEO and Brand Configuration for Star Solutions (Star Solutions BD)
 * Domain: https://starsolutionsbd.com
 */

export const siteConfig = {
  name: "Star Solutions",
  legalName: "Star Solutions BD Ltd.",
  brandName: "Star Solutions BD",
  domain: "https://starsolutionsbd.com",
  domainName: "starsolutionsbd.com",
  url: "https://starsolutionsbd.com",
  canonicalUrl: "https://starsolutionsbd.com",
  logo: "https://starsolutionsbd.com/logo_white.png",
  favicon: "/favicon.ico",

  tagline: "Leading Custom Software & IT Solutions Company in Bangladesh",
  shortDescription:
    "Star Solutions (Star Solutions BD) is a premier IT and software development company in Bangladesh. We build scalable ERP, HRM, web applications, mobile apps, and AI solutions.",
  fullDescription:
    "Star Solutions (Star Solutions BD) is an industry-leading software development and IT consulting company based in Dhaka, Bangladesh. We architect world-class enterprise software, custom ERP and HRM solutions, high-performance web applications (Next.js, React, Node.js), native/cross-platform mobile apps, cloud DevOps infrastructure, and autonomous AI automation platforms for growing businesses and enterprises worldwide.",

  keywords: [
    // Primary Brand Keywords
    "star solutions",
    "star solutions bd",
    "starsolutionsbd.com",
    "star solutions bangladesh",
    "star solutions it",
    "star solution",
    "star solution bd",

    // Service & Location Keywords (High Search Intent)
    "software development company in bangladesh",
    "software development company in dhaka",
    "best software company in bangladesh",
    "top it company in bangladesh",
    "custom software development bangladesh",
    "enterprise erp software bangladesh",
    "hrm and payroll software bd",
    "web application development company dhaka",
    "react nextjs development agency bangladesh",
    "mobile app development company bangladesh",
    "flutter app development bd",
    "cloud devops engineering bangladesh",
    "ai automation company in bangladesh",
    "ui ux design agency bangladesh",
    "ecommerce website development bangladesh",
    "fintech software development bangladesh",
    "healthcare software solutions bd",
    "it outsourcing company in bangladesh",
    "dedicated software development team dhaka",
  ],

  author: {
    name: "Star Solutions BD Engineering Team",
    url: "https://starsolutionsbd.com",
  },

  contact: {
    email: "info@starsolutionsbd.com",
    supportEmail: "support@starsolutionsbd.com",
    salesEmail: "sales@starsolutionsbd.com",
    phone: "+880 1700-000000",
    address: {
      street: "Banani / Gulshan Commercial Area",
      city: "Dhaka",
      state: "Dhaka Division",
      postalCode: "1213",
      country: "Bangladesh",
      countryCode: "BD",
    },
  },

  social: {
    facebook: "https://facebook.com/starsolutionsbd",
    linkedin: "https://linkedin.com/company/starsolutionsbd",
    twitter: "https://twitter.com/starsolutionsbd",
    github: "https://github.com/starsolutionsbd",
  },

  // Structured Data (Schema.org) for Google Knowledge Graph & Rich Snippets
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://starsolutionsbd.com/#organization",
      name: "Star Solutions",
      alternateName: ["Star Solutions BD", "Star Solutions Bangladesh", "starsolutionsbd.com"],
      url: "https://starsolutionsbd.com",
      logo: {
        "@type": "ImageObject",
        url: "https://starsolutionsbd.com/logo_white.png",
        caption: "Star Solutions BD Logo",
      },
      image: "https://starsolutionsbd.com/logo_white.png",
      email: "info@starsolutionsbd.com",
      telephone: "+880 1700-000000",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressRegion: "Dhaka",
        addressCountry: "BD",
      },
      sameAs: [
        "https://linkedin.com/company/starsolutionsbd",
        "https://facebook.com/starsolutionsbd",
        "https://twitter.com/starsolutionsbd",
        "https://github.com/starsolutionsbd",
      ],
      description:
        "Star Solutions is a premier custom software development and IT engineering company in Bangladesh specializing in Enterprise ERP, Web, Mobile, and AI Automation.",
    },

    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://starsolutionsbd.com/#website",
      url: "https://starsolutionsbd.com",
      name: "Star Solutions BD",
      alternateName: "Star Solutions",
      description: "Custom Software, ERP & Web Application Development Company in Bangladesh",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://starsolutionsbd.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },

    localBusiness: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://starsolutionsbd.com/#localbusiness",
      name: "Star Solutions BD",
      image: "https://starsolutionsbd.com/logo_white.png",
      url: "https://starsolutionsbd.com",
      telephone: "+880 1700-000000",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "23.7925",
        longitude: "90.4078",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
  },
};
