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
    <footer className="bg-[#2A2D33] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top */}
        <div className="grid lg:grid-cols-[2fr_1fr_1.5fr_1fr] gap-12">
          {/* Logo */}
          <Link href="/">
            <Image
              src={
                settings?.data?.logoWhite
                  ? `${baseUriBackend}${settings.data.logoWhite}`
                  : "/logo_white.png"
              }
              alt={settings?.websiteName || "Logicraft IT"}
              width={320}
              height={100}
              className="h-auto w-full max-w-50"
            />
          </Link>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-5 text-white">Useful Link</h4>
            <ul className="space-y-5 text-gray-300">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-lg hover:text-gray-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-5 text-white">Address</h4>

            <div className="space-y-5 text-gray-300">
              {data.address && <p>{data.address}</p>}

              {data.phone && <p className="font-semibold">{data.phone}</p>}

              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="text-lg hover:text-gray-300 transition-colors"
                >
                  {data.email}
                </a>
              )}
            </div>
          </div>

          {/*  Social */}
          <div className="lg:min-w-70">
            <h4 className="font-bold mb-5 text-white">Social</h4>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="w-14 h-14 rounded-full bg-white text-[#2A2D33] flex items-center justify-center hover:scale-105 transition-transform"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={24} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        {/* <div className="mt-8 py-4 flex flex-col lg:flex-row justify-between gap-6 border-t border-white/10">
          <p className="text-white/80">
            Copyright © {new Date().getFullYear()}{" "}
            {data.websiteName || "Logicraft IT"}
          </p>

          <div className="flex flex-wrap gap-8 lg:gap-12">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div> */}
      </div>
    </footer>
  );
}
