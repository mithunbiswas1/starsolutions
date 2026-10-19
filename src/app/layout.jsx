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

export async function generateMetadata() {
  const settingsData = await getSettings();
  const settings = settingsData?.data || {};

  const title = settings.metaTitle || "Logicraft IT - Innovative IT Solutions";
  const description =
    settings.metaDescription ||
    "Logicraft IT provides cutting-edge software development, AI automation, and web solutions.";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://logicraftit.com"
    ),
    title,
    description,
    keywords: settings.metaKeywords || "software, web development, IT, AI",
    openGraph: {
      title,
      description,
      url: "https://logicraftit.com",
      siteName: settings.websiteName || "Logicraft IT",
      images: settings.openGraphImage
        ? [
            {
              url: `${baseUriBackend}${settings.openGraphImage}`,
              width: 1200,
              height: 630,
              alt: settings.websiteName || "Logicraft IT",
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings.openGraphImage
        ? [`${baseUriBackend}${settings.openGraphImage}`]
        : [],
    },
    icons: {
      icon: settings.favicon
        ? `${baseUriBackend}${settings.favicon}`
        : "/favicon.ico",
    },
    alternates: {
      canonical: "https://logicraftit.com",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${manrope.variable} ${nekst.variable}`}>
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
