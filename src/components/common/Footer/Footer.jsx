// src/components/layout/Footer.jsx

import { baseUriBackend } from "@/redux/url/url";
import Image from "next/image";
import Link from "next/link";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaGithub,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";
import { SiDouban } from "react-icons/si";

const navigationLinks = [
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Cookie Policy",
    href: "/cookie-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms-and-conditions",
  },
];

// Map social media keys to icons
const socialIconMap = {
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  reddit: FaReddit,
  tiktok: FaTiktok,
  github: FaGithub,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  douban: SiDouban,
};

export default function Footer({ settings }) {
  const data = settings?.data || {};

  // Build social links from settings (only if URL exists)
  const socialLinks = [
    { key: "linkedin", url: data.linkedin, label: "LinkedIn" },
    { key: "facebook", url: data.facebook, label: "Facebook" },
    { key: "twitter", url: data.twitter, label: "Twitter" },
    { key: "instagram", url: data.instagram, label: "Instagram" },
    { key: "youtube", url: data.youtube, label: "YouTube" },
    { key: "reddit", url: data.reddit, label: "Reddit" },
    { key: "tiktok", url: data.tiktok, label: "TikTok" },
    { key: "github", url: data.github, label: "GitHub" },
    { key: "pinterest", url: data.pinterest, label: "Pinterest" },
    { key: "whatsapp", url: data.whatsapp, label: "WhatsApp" },
  ]
    .filter((item) => item.url) // Only include if URL exists
    .map((item) => ({
      icon: socialIconMap[item.key] || FaFacebookF,
      href: item.url,
      label: item.label,
    }));

  return (
    <footer className="relative bg-[#070b12] text-white border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top */}
        <div className="grid lg:grid-cols-[2fr_1fr_1.5fr_1fr] gap-12">
          {/* Logo */}
          <div className="space-y-4">
            <Link href="/">
              <Image
                src={
                  settings?.data?.logoWhite
                    ? `${baseUriBackend}${settings.data.logoWhite}`
                    : "/logo_white.png"
                }
                alt={settings?.websiteName || "Star Solutions BD"}
                width={280}
                height={62}
                className="h-10 w-auto object-contain brightness-110"
              />
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Star Solutions (Star Solutions BD) — Architecting mission-critical custom enterprise software, cloud ERP, and intelligent web platforms in Bangladesh.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-5 text-white tracking-wide">Useful Links</h4>
            <ul className="space-y-3.5 text-gray-300">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-base text-gray-400 hover:text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-5 text-white tracking-wide">Address</h4>

            <div className="space-y-4 text-gray-300">
              <p className="text-gray-400 text-sm leading-relaxed">
                {data.address || "Dhaka, Bangladesh"}
              </p>

              <p className="font-semibold text-white text-sm">
                {data.phone || "+880 1700-000000"}
              </p>

              <a
                href={`mailto:${data.email || "info@starsolutionsbd.com"}`}
                className="block text-sm text-gray-400 hover:text-primary transition-colors"
              >
                {data.email || "info@starsolutionsbd.com"}
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="lg:min-w-70">
            <h4 className="font-bold mb-5 text-white tracking-wide">Connect</h4>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="w-10 h-10 rounded-xl glass-badge bg-white/[0.04] border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] flex items-center justify-center text-gray-300 hover:text-primary hover:scale-105 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={18} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {data.websiteName || "Star Solutions BD"}. All rights reserved.</p>

          <div className="flex flex-wrap gap-6">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
