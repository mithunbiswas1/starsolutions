import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { nekst } from "@/font/nekst/nekst";
import ReduxProvider from "@/redux/reduxProvider/ReduxProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/getSettingApi";
import { baseUriBackend } from "@/redux/url/url";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

import { siteConfig } from "@/config/siteConfig";

export async function generateMetadata() {
  const settingsData = await getSettings().catch(() => null);
  const settings = settingsData?.data || {};

  const title = settings.metaTitle || `${siteConfig.brandName} | ${siteConfig.tagline}`;
  const description = settings.metaDescription || siteConfig.fullDescription;
  const keywords = settings.metaKeywords
    ? `${settings.metaKeywords}, ${siteConfig.keywords.join(", ")}`
    : siteConfig.keywords;

  return {
    metadataBase: new URL(siteConfig.domain),
    title: {
      default: `${siteConfig.brandName} | ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.brandName}`,
    },
    description,
    keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.domain }],
    creator: siteConfig.brandName,
    publisher: siteConfig.legalName,
    applicationName: siteConfig.brandName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: siteConfig.domain,
      siteName: siteConfig.brandName,
      images: settings.openGraphImage
        ? [
            {
              url: `${baseUriBackend}${settings.openGraphImage}`,
              width: 1200,
              height: 630,
              alt: siteConfig.brandName,
            },
          ]
        : [
            {
              url: `${siteConfig.domain}/star_logo_white.png`,
              width: 1200,
              height: 630,
              alt: `${siteConfig.brandName} - Custom Software & IT Solutions`,
            },
          ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@starsolutionsbd",
      images: settings.openGraphImage
        ? [`${baseUriBackend}${settings.openGraphImage}`]
        : [`${siteConfig.domain}/star_logo_white.png`],
    },
    icons: {
      icon: [
        { url: settings.favicon ? `${baseUriBackend}${settings.favicon}` : "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon-32x32.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    alternates: {
      canonical: siteConfig.canonicalUrl,
    },
  };
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteConfig.structuredData.organization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteConfig.structuredData.website),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteConfig.structuredData.localBusiness),
          }}
        />
      </head>
      <body className={`${inter.className} ${manrope.variable} ${nekst.variable} bg-[#080c14] text-white antialiased selection:bg-primary selection:text-black`}>
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

