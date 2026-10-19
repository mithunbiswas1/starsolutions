// src/app/sitemap.js
import { siteConfig } from "@/config/siteConfig";

export default async function sitemap() {
  const baseUrl = siteConfig.domain;
  const now = new Date();

  // Primary pages
  const routes = [
    { url: `${baseUrl}`, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/case-studies`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/package`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.9 },

    // Core IT Services
    { url: `${baseUrl}/software-development`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/web-development`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/app-development`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/ui-ux-design`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ecommerce-solutions`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ai-automation`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/seo`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/digital-marketing`, changeFrequency: "weekly", priority: 0.8 },

    // Enterprise Solutions
    { url: `${baseUrl}/enterprise-resource-planning`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/human-resource-management`, changeFrequency: "weekly", priority: 0.9 },

    // Legal
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/cookie-policy`, changeFrequency: "yearly", priority: 0.4 },
  ];

  return routes.map((r) => ({
    url: r.url,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
