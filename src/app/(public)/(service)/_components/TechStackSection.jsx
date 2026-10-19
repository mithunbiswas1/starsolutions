import {
  // Frontend
  SiReact,
  SiAngular,
  SiVuedotjs,
  SiNextdotjs,

  // Backend
  SiNodedotjs,
  SiPython,
  SiDjango,
  SiSpringboot,
  SiDotnet,
  SiPhp,
  SiLaravel,

  // Databases
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,

  // Cloud & DevOps
  SiDocker,
  SiKubernetes,
  SiJenkins,
  SiGithubactions,

  // APIs
  SiGraphql,

  // UI/UX Design Tools
  SiFigma,
  SiSketch,
  SiMiro,
  SiFramer,
  SiWebflow,
  SiHotjar,

  // Mobile (if needed)
  SiSwift,
  SiKotlin,
  SiDart,
  SiFlutter,
  SiGooglemaps,
  SiSelenium,
  SiShopify,
  SiWoo,
  SiBigcommerce,
  SiAlpinedotjs,
  SiRubyonrails,
  SiStripe,
  SiPaypal,
  SiRazorpay,
  SiAlgolia,
  SiGoogleanalytics,
  SiMailchimp,

  // AI & Automation Icons
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiLangchain,
  SiHuggingface,
  SiUipath,
  SiZapier,
  SiMake,
  SiPandas,
  SiApachespark,
  SiApachekafka,
  SiOpencv,
  SiGooglecloud,

  // SEO Tools
  SiSemrush,
  SiGooglesearchconsole,
  SiYoast,
  SiGoogleads,
  SiPagespeedinsights,

  // Digital Marketing Tools
  SiGoogletagmanager,
  SiMixpanel,
  SiInstagram,
  SiTiktok,
  SiHubspot,
  SiHootsuite,
  SiBuffer,
} from "react-icons/si";

import { FaJava, FaAws } from "react-icons/fa";
import {
  TbApi,
  TbBrandAzure,
  TbBrandTwitter,
  TbBrandLinkedin,
  TbTable,
  TbChartBar,
} from "react-icons/tb";
import { BsBluetooth } from "react-icons/bs";

import { H2, P } from "@/components/ui/Typography";

// Map icon strings to actual icon components
const iconMap = {
  // Frontend
  SiReact,
  SiAngular,
  SiVuedotjs,
  SiNextdotjs,

  // Backend
  SiNodedotjs,
  SiPython,
  SiDjango,
  FaJava,
  SiSpringboot,
  SiDotnet,
  SiPhp,
  SiLaravel,

  // Databases
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,

  // Cloud & DevOps
  FaAws,
  SiDocker,
  SiKubernetes,
  SiJenkins,
  SiGithubactions,

  // APIs
  SiGraphql,
  TbApi,

  // UI/UX Tools
  SiFigma,
  SiSketch,
  SiMiro,
  SiFramer,
  SiWebflow,
  SiHotjar,

  // Mobile
  SiSwift,
  SiKotlin,
  SiDart,
  SiFlutter,
  SiGooglemaps,
  BsBluetooth,
  SiSelenium,

  // E-Commerce Platforms
  SiShopify,
  SiWoo,
  SiBigcommerce,
  SiAlpinedotjs,
  SiRubyonrails,
  SiStripe,
  SiPaypal,
  SiRazorpay,
  SiAlgolia,
  SiGoogleanalytics,
  SiMailchimp,

  // AI & Automation Icons
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiLangchain,
  SiHuggingface,
  SiUipath,
  SiZapier,
  SiMake,
  SiPandas,
  SiApachespark,
  SiApachekafka,
  SiOpencv,
  SiGooglecloud,
  TbBrandAzure,

  // SEO Tools
  SiSemrush,
  SiGooglesearchconsole,
  SiYoast,
  SiGoogleads,
  SiPagespeedinsights,

  // Digital Marketing Tools
  SiGoogletagmanager,
  SiMixpanel,
  SiInstagram,
  SiTiktok,
  SiHubspot,
  SiHootsuite,
  SiBuffer,

  TbBrandTwitter,
  TbBrandLinkedin,
  TbTable,
  TbChartBar,
};

export default function TechStackSection({ techStackData }) {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14 items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-white/10">
              Modern Tech Stack
            </div>
            <H2 className="font-extrabold text-white text-3xl sm:text-4xl">
              {techStackData.heading}
            </H2>
          </div>

          <div>
            <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
              {techStackData.description}
            </P>
          </div>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {techStackData.technologies.map((tech) => {
            const Icon = iconMap[tech.icon];

            return (
              <div
                key={tech.name}
                className="p-4 rounded-xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 flex items-center gap-3.5 transition-all duration-300 group hover:-translate-y-0.5"
              >
                {Icon && (
                  <div className="p-2 rounded-lg bg-white/[0.04] text-primary group-hover:scale-110 transition-transform">
                    <Icon className="text-xl shrink-0" />
                  </div>
                )}
                <span className="font-medium text-white group-hover:text-primary transition-colors text-sm">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

