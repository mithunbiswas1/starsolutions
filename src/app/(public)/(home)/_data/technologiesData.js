import {
  FaReact,
  FaNodeJs,
  FaLaravel,
  FaAws,
  FaDocker,
  FaFigma,
  FaWordpress,
  FaShopify,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFlutter,
  SiKotlin,
  SiSwift,
  SiFirebase,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiGoogleanalytics,
  SiGoogleads,
  SiMeta,
  SiWoocommerce,
  SiStrapi,
  SiNestjs,
  SiRedis,
  SiKubernetes,
  SiAndroid,
} from "react-icons/si";
import { BsOpenai } from "react-icons/bs";

export const technologiesData = {
  "Mobile Apps": {
    sections: [
      {
        title: "iOS",
        items: [
          { name: "Swift", icon: SiSwift },
          { name: "Firebase", icon: SiFirebase },
          { name: "MVVM", icon: SiSwift },
        ],
      },
      {
        title: "Android",
        items: [
          { name: "Kotlin", icon: SiKotlin },
          { name: "Firebase", icon: SiFirebase },
          { name: "Jetpack", icon: SiAndroid },
        ],
      },
      {
        title: "Cross-Platform",
        items: [
          { name: "Flutter", icon: SiFlutter },
          { name: "React Native", icon: FaReact },
          { name: "Firebase", icon: SiFirebase },
        ],
      },
    ],
  },
  Web: {
    sections: [
      {
        title: "Frontend",
        items: [
          { name: "React", icon: FaReact },
          { name: "Next.js", icon: SiNextdotjs },
          { name: "TypeScript", icon: SiTypescript },
          { name: "Tailwind CSS", icon: SiTailwindcss },
          { name: "JavaScript", icon: SiJavascript },
        ],
      },
      {
        title: "Fullstack Frameworks",
        items: [
          { name: "Next.js App Router", icon: SiNextdotjs },
          { name: "Node.js", icon: FaNodeJs },
          { name: "NestJS", icon: SiNestjs },
        ],
      },
    ],
  },
  Backend: {
    sections: [
      {
        title: "Frameworks & Runtimes",
        items: [
          { name: "Node.js", icon: FaNodeJs },
          { name: "NestJS", icon: SiNestjs },
          { name: "Laravel", icon: FaLaravel },
        ],
      },
      {
        title: "Databases & Cache",
        items: [
          { name: "PostgreSQL", icon: SiPostgresql },
          { name: "MongoDB", icon: SiMongodb },
          { name: "MySQL", icon: SiMysql },
          { name: "Redis", icon: SiRedis },
        ],
      },
    ],
  },
  "Cloud & DevOps": {
    sections: [
      {
        title: "Infrastructure & CI/CD",
        items: [
          { name: "AWS", icon: FaAws },
          { name: "Docker", icon: FaDocker },
          { name: "Kubernetes", icon: SiKubernetes },
          { name: "Firebase", icon: SiFirebase },
        ],
      },
    ],
  },
  "CMS & E-Commerce": {
    sections: [
      {
        title: "Platforms",
        items: [
          { name: "Shopify", icon: FaShopify },
          { name: "WordPress", icon: FaWordpress },
          { name: "WooCommerce", icon: SiWoocommerce },
          { name: "Strapi Headless", icon: SiStrapi },
        ],
      },
    ],
  },
  "UI/UX Design": {
    sections: [
      {
        title: "Design Systems & Tools",
        items: [
          { name: "Figma", icon: FaFigma },
          { name: "Design Tokens", icon: FaFigma },
          { name: "Tailwind Architecture", icon: SiTailwindcss },
        ],
      },
    ],
  },
  "AI & Automation": {
    sections: [
      {
        title: "Intelligent Systems",
        items: [
          { name: "OpenAI API", icon: BsOpenai },
          { name: "LangChain Agents", icon: BsOpenai },
          { name: "Custom LLM Workflows", icon: BsOpenai },
        ],
      },
    ],
  },
  "Digital Marketing": {
    sections: [
      {
        title: "SEO & Growth",
        items: [
          { name: "Google Analytics 4", icon: SiGoogleanalytics },
          { name: "Google Ads", icon: SiGoogleads },
          { name: "Meta Ads", icon: SiMeta },
        ],
      },
    ],
  },
};
