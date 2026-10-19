// scripts/seedDatabase.mjs
import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";
import { User } from "../src/models/user.model.js";
import { HomeBanner } from "../src/models/homeBanner.model.js";
import { HomeCompany } from "../src/models/homeCompany.model.js";
import { HomeIndustry } from "../src/models/homeIndustry.model.js";
import { HomeAlliance } from "../src/models/homeAlliance.model.js";
import { Testimonial } from "../src/models/testimonial.model.js";
import { Package } from "../src/models/package.model.js";
import { Project } from "../src/models/project.model.js";
import { Blog } from "../src/models/blog.model.js";
import { Setting } from "../src/models/setting.model.js";

// Ensure Atlas SRV resolves on local DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) { }

const uri =
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  "mongodb+srv://skzmithun_db_user:or0pf2JW49QZ5EIF@star-solutions-bd.pb4dlnp.mongodb.net/star-solutions-bd?retryWrites=true&w=majority";

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  const conn = await mongoose.connect(uri);
  console.log("✅ Connected to:", conn.connection.host, "DB:", conn.connection.name);

  // 1. Super Admin User
  let admin = await User.findOne({ email: "admin@starsolutionsbd.com" });
  if (!admin) {
    admin = await User.create({
      userName: "admin",
      fullName: "Star Solutions Administrator",
      email: "admin@starsolutionsbd.com",
      phone: "+8801700000000",
      role: "super_admin",
      password: "StarAdmin@2026",
      bio: "Chief Executive & System Administrator at Star Solutions BD.",
      is_active: true,
      address: "Banani Commercial Area",
      city: "Dhaka",
      district: "Dhaka",
      country: "Bangladesh",
    });
    console.log("✅ Super Admin created: admin@starsolutionsbd.com / StarAdmin@2026");
  } else {
    console.log("ℹ️ Admin already exists:", admin.email);
  }

  // 2. Home Banners
  const bannerCount = await HomeBanner.countDocuments();
  if (bannerCount === 0) {
    await HomeBanner.insertMany([
      {
        banner_image: "/home/banner/banner.webp",
        first_title: "Leading Software &",
        middle_title: "Custom IT Solutions",
        last_title: "in Bangladesh",
        sub_title:
          "Star Solutions (Star Solutions BD) architects mission-critical enterprise software, custom ERP, scalable web platforms, and mobile apps engineered for long-term growth.",
        url: "/contact",
        order: 1,
        is_active: true,
        createdBy: admin._id,
      },
      {
        banner_image: "/home/banner/banner.webp",
        first_title: "Modern Enterprise",
        middle_title: "Cloud ERP & HRM",
        last_title: "Systems",
        sub_title:
          "Unify finance, HR, inventory, and operations with intelligent ERP and automated payroll systems engineered by top software developers in Bangladesh.",
        url: "/enterprise-resource-planning",
        order: 2,
        is_active: true,
        createdBy: admin._id,
      },
      {
        banner_image: "/home/banner/banner.webp",
        first_title: "Engineering Scalable",
        middle_title: "Web & Mobile Apps",
        last_title: "Globally",
        sub_title:
          "From high-throughput Next.js & React web platforms to cross-platform Flutter and iOS applications with guaranteed security and 99.9% uptime.",
        url: "/software-development",
        order: 3,
        is_active: true,
        createdBy: admin._id,
      },
    ]);
    console.log("✅ Home Banners seeded (3 slides)");
  }

  // 3. Home Companies / Partners
  const companyCount = await HomeCompany.countDocuments();
  if (companyCount === 0) {
    await HomeCompany.insertMany([
      { title: "Google Cloud Partner", image: "/home/at_a_glance/2.svg", order: 1, is_active: true, createdBy: admin._id },
      { title: "AWS Certified Partner", image: "/home/at_a_glance/1.svg", order: 2, is_active: true, createdBy: admin._id },
      { title: "ISO 27001 Security", image: "/home/at_a_glance/3.webp", order: 3, is_active: true, createdBy: admin._id },
      { title: "CMMI Level 3 Appraised", image: "/home/at_a_glance/4.webp", order: 4, is_active: true, createdBy: admin._id },
      { title: "Microsoft Azure Partner", image: "/home/at_a_glance/1.svg", order: 5, is_active: true, createdBy: admin._id },
      { title: "Next.js & Vercel Partner", image: "/home/at_a_glance/2.svg", order: 6, is_active: true, createdBy: admin._id },
      { title: "Kubernetes DevOps Certified", image: "/home/at_a_glance/3.webp", order: 7, is_active: true, createdBy: admin._id },
      { title: "PCI DSS FinTech Certified", image: "/home/at_a_glance/4.webp", order: 8, is_active: true, createdBy: admin._id },
    ]);
    console.log("✅ Home Partner Companies seeded (8 partners)");
  }

  // 4. Home Industries
  const industryCount = await HomeIndustry.countDocuments();
  if (industryCount === 0) {
    await HomeIndustry.insertMany([
      {
        title: "FinTech & Digital Banking",
        description: "PCI-compliant payment gateways, core banking ledgers, and fraud prevention engines.",
        image: "/services/ui-ux-design/fintech.webp",
        order: 1,
        is_active: true,
        createdBy: admin._id,
      },
      {
        title: "Healthcare & MedTech",
        description: "HIPAA-compliant telemedicine platforms, electronic health records (EHR), and patient diagnostics.",
        image: "/services/ui-ux-design/healthcare.webp",
        order: 2,
        is_active: true,
        createdBy: admin._id,
      },
      {
        title: "E-Commerce & Retail",
        description: "High-volume headless commerce, omnichannel POS integrations, and automated inventory systems.",
        image: "/services/ui-ux-design/ecommerce.webp",
        order: 3,
        is_active: true,
        createdBy: admin._id,
      },
      {
        title: "SaaS & Cloud Platforms",
        description: "Multi-tenant cloud architectures, subscription billing engines, and enterprise dashboard suites.",
        image: "/services/ui-ux-design/saas.webp",
        order: 4,
        is_active: true,
        createdBy: admin._id,
      },
      {
        title: "Real Estate & PropTech",
        description: "Property discovery portals, virtual MLS integrations, and automated client CRM workflows.",
        image: "/services/web-development/real_estate.webp",
        order: 5,
        is_active: true,
        createdBy: admin._id,
      },
      {
        title: "EdTech & Learning Management",
        description: "Virtual classrooms, interactive course delivery systems, and student progress telemetry.",
        image: "/services/web-development/learning_management.webp",
        order: 6,
        is_active: true,
        createdBy: admin._id,
      },
      {
        title: "Logistics & Supply Chain",
        description: "Fleet tracking, automated route dispatching, warehouse telemetry, and shipment tracking.",
        image: "/services/app-development/airport_passenger.webp",
        order: 7,
        is_active: true,
        createdBy: admin._id,
      },
      {
        title: "AI & Industrial Automation",
        description: "Autonomous agents, predictive maintenance, and document intelligence platforms.",
        image: "/services/ai-automation/ai-automation.webp",
        order: 8,
        is_active: true,
        createdBy: admin._id,
      },
    ]);
    console.log("✅ Home Industries seeded (8 industries)");
  }

  // 5. Home Alliance / At a Glance
  const allianceCount = await HomeAlliance.countDocuments();
  if (allianceCount === 0) {
    await HomeAlliance.create({
      alliance_image1: "/home/at_a_glance/1.svg",
      alliance_image2: "/home/at_a_glance/2.svg",
      alliance_image3: "/home/at_a_glance/3.webp",
      alliance_image4: "/home/at_a_glance/4.webp",
      experience_year: 12,
      client: 95,
      projects: 280,
      countries: 35,
      is_active: true,
      createdBy: admin._id,
    });
    console.log("✅ Home Alliance / At A Glance stats seeded");
  }

  // 6. Testimonials
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany([
      {
        name: "Tariqul Islam",
        position: "Managing Director",
        company: "Bengal Logistics Group (Dhaka)",
        rating: 5,
        message:
          "Star Solutions BD implemented our custom ERP and multi-warehouse fleet tracking system. Operations speed surged by 40% within the first two months. Without a doubt the best software team in Bangladesh.",
        image: "/user.png",
        order: 1,
        is_active: true,
        createdBy: admin._id,
      },
      {
        name: "Alex Vance",
        position: "CTO",
        company: "Apex Global FinTech",
        rating: 5,
        message:
          "Star Solutions delivered our banking microservices core 3 weeks ahead of schedule. Their engineers write some of the cleanest, most resilient distributed code we have ever seen.",
        image: "/user.png",
        order: 2,
        is_active: true,
        createdBy: admin._id,
      },
      {
        name: "Dr. Elena Rostova",
        position: "VP of Product Engineering",
        company: "MedHealth Diagnostics",
        rating: 5,
        message:
          "The clinical portal and AI imaging workflow Star Solutions engineered transformed our radiologist throughput. Their compliance and security rigor are international gold standard.",
        image: "/user.png",
        order: 3,
        is_active: true,
        createdBy: admin._id,
      },
      {
        name: "Tanvir Ahmed",
        position: "Head of Technology",
        company: "FinPay BD Solutions",
        rating: 5,
        message:
          "Star Solutions BD helped us engineer high-throughput payment gateway integrations for bKash, Nagad, and cards with sub-100ms response times. Their support is unparalleled.",
        image: "/user.png",
        order: 4,
        is_active: true,
        createdBy: admin._id,
      },
    ]);
    console.log("✅ Testimonials seeded (4 reviews)");
  }

  // 7. Packages / Pricing
  const packageCount = await Package.countDocuments();
  if (packageCount === 0) {
    await Package.insertMany([
      {
        name: "Startup MVP Launch",
        price: "৳ 45,000",
        billing: "One-Time Project Delivery",
        description: "Perfect for emerging startups and businesses needing a rapid, production-ready web application or MVP.",
        buttonText: "Start MVP Build",
        theme: "light",
        badge: "Fast Track",
        features: [
          "Custom Next.js & React Frontend",
          "Responsive Mobile & Tablet UI/UX",
          "RESTful / GraphQL API Integration",
          "PostgreSQL or MongoDB Database",
          "Basic SEO & Schema Tags",
          "30 Days Free Production Support",
        ],
        order: 1,
        is_active: true,
        createdBy: admin._id,
      },
      {
        name: "Enterprise Business Scale",
        price: "৳ 1,20,000",
        billing: "Full System Deployment",
        description: "Engineered for scaling businesses requiring custom ERP, CRM, automated workflows, and multi-user systems.",
        buttonText: "Scale Your Business",
        theme: "dark",
        badge: "Most Popular",
        features: [
          "Complete Custom ERP / HRM Suite",
          "Role-Based Access Control (RBAC)",
          "bKash / Nagad / SSLCommerz / Stripe Gateway",
          "Automated PDF Invoicing & Payroll",
          "High-Speed Microservices Architecture",
          "Real-Time Telemetry & Reports Dashboard",
          "90 Days Dedicated SLA Support",
        ],
        order: 2,
        is_active: true,
        createdBy: admin._id,
      },
      {
        name: "Enterprise Cloud & AI",
        price: "Custom",
        billing: "Bespoke Enterprise Contract",
        description: "Comprehensive end-to-end digital transformation, cloud architecture, and custom LLM/AI automation.",
        buttonText: "Contact Architecture Team",
        theme: "light",
        badge: "Enterprise Grade",
        features: [
          "Dedicated Senior Engineering Squad",
          "Kubernetes & Multi-Cloud Infrastructure",
          "Custom LLM & Autonomous Workflow AI",
          "24/7/365 Dedicated Mission-Critical Support",
          "ISO 27001 Security & Auditing",
          "Guaranteed 99.99% Uptime SLA",
        ],
        order: 3,
        is_active: true,
        createdBy: admin._id,
      },
    ]);
    console.log("✅ Pricing Packages seeded (3 packages)");
  }

  // 8. Showcase Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: "Enterprise ERP & Workflow Automation for Global Corp",
        slug: "enterprise-erp-workflow-automation",
        category: "Enterprise ERP",
        client: "Apex Industries Ltd.",
        duration: "6 Months",
        short_description: "A consolidated enterprise resource platform unifying multi-branch finance, procurement, and real-time inventory management.",
        description:
          "Star Solutions BD engineered an end-to-end cloud ERP unifying 8 international branches. Key features include automated financial reconciliations, intelligent inventory telemetry, role-based governance, and real-time executive analytics.",
        technologies: ["Next.js", "Node.js", "PostgreSQL", "Docker", "TailwindCSS"],
        thumbnail: "/services/software-development/enterprise_crm.webp",
        banner: "/services/software-development/enterprise_crm.webp",
        gallery: ["/services/software-development/enterprise_crm.webp"],
        meta_title: "Enterprise ERP Case Study | Star Solutions BD",
        meta_description: "Discover how Star Solutions BD architected an enterprise-grade ERP system unifying multi-branch operations.",
        seo_keyword: "enterprise erp bangladesh, custom erp software dhaka",
        createBy: admin._id,
        is_active: true,
      },
      {
        title: "High-Throughput Multi-Vendor Headless E-Commerce",
        slug: "multi-vendor-headless-ecommerce",
        category: "E-Commerce",
        client: "Bengal Commerce Hub",
        duration: "4 Months",
        short_description: "Delivered a modern microservices-based marketplace supporting 50,000+ daily orders with seamless multi-gateway payments.",
        description:
          "Architected a headless multi-vendor marketplace with sub-second page loads, instant search via Elasticsearch, integrated bKash and Stripe payments, and automated vendor payout ledgers.",
        technologies: ["React", "Next.js", "MongoDB", "Redis", "TailwindCSS"],
        thumbnail: "/services/ecommerce-solutions/multi_vendor.webp",
        banner: "/services/ecommerce-solutions/multi_vendor.webp",
        gallery: ["/services/ecommerce-solutions/multi_vendor.webp"],
        meta_title: "Headless E-Commerce Platform | Star Solutions BD",
        meta_description: "Scalable multi-vendor e-commerce platform engineered by Star Solutions BD.",
        seo_keyword: "ecommerce development bangladesh, headless shopify react",
        createBy: admin._id,
        is_active: true,
      },
      {
        title: "AI-Powered Document Intelligence & Verification Engine",
        slug: "ai-document-intelligence-verification",
        category: "AI & Automation",
        client: "FinTrust Verification Group",
        duration: "3 Months",
        short_description: "Developed a custom OCR and autonomous LLM extraction system processing 100k+ monthly invoices and KYC documents.",
        description:
          "Automated financial onboarding with computer vision and LLM extraction, reducing human manual verification time by 82% while sustaining 99.4% precision.",
        technologies: ["Python", "FastAPI", "Next.js", "OpenAI", "Docker"],
        thumbnail: "/services/ai-automation/intelligent_document_processing.webp",
        banner: "/services/ai-automation/intelligent_document_processing.webp",
        gallery: ["/services/ai-automation/intelligent_document_processing.webp"],
        meta_title: "AI Document Intelligence Case Study | Star Solutions BD",
        meta_description: "Custom AI automation and document intelligence engineered by Star Solutions BD.",
        seo_keyword: "ai automation bangladesh, ocr document intelligence dhaka",
        createBy: admin._id,
        is_active: true,
      },
    ]);
    console.log("✅ Showcase Projects seeded (3 projects)");
  }

  // 9. Tech Blogs
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    await Blog.insertMany([
      {
        title: "Why Custom Enterprise ERP is Outperforming Off-the-Shelf SaaS in 2026",
        slug: "why-custom-enterprise-erp-outperforms-saas",
        category: "Enterprise Software",
        client: "Star Solutions BD Insights",
        duration: "5 min read",
        short_description: "Explore why forward-thinking enterprises in Bangladesh and across the globe are turning away from rigid SaaS subscriptions toward owned custom ERPs.",
        description:
          "Off-the-shelf software promises fast setup but locks organizations into recurring seat fees, rigid processes, and data silos. A custom ERP tailored by Star Solutions BD gives businesses 100% intellectual property ownership, zero per-seat penalty, and infinite adaptability to unique operational workflows.",
        technologies: ["Enterprise ERP", "Cloud Architecture", "Cost Optimization"],
        thumbnail: "/services/software-development/enterprise_crm.webp",
        banner: "/services/software-development/enterprise_crm.webp",
        gallery: ["/services/software-development/enterprise_crm.webp"],
        meta_title: "Custom ERP vs SaaS in 2026 | Star Solutions BD",
        meta_description: "Strategic insights into choosing custom ERP architecture over generic SaaS solutions.",
        seo_keyword: "custom erp software bangladesh, enterprise software dhaka",
        createBy: admin._id,
        is_active: true,
      },
      {
        title: "Accelerating Core Web Vitals with Next.js 16 and Modern Edge Rendering",
        slug: "accelerating-core-web-vitals-nextjs-16",
        category: "Web Engineering",
        client: "Star Solutions BD Tech Lab",
        duration: "6 min read",
        short_description: "A deep dive into sub-second page loads, partial prerendering, and eliminating waterfalls for maximum Google search visibility.",
        description:
          "Google ranking algorithms now heavily prioritize Interaction to Next Paint (INP) and Largest Contentful Paint (LCP). By leveraging Next.js 16 App Router, streaming server components, and asset optimization, Star Solutions BD delivers lightning-fast scores that dominate search results.",
        technologies: ["Next.js", "React", "SEO", "Performance"],
        thumbnail: "/services/web-development/web-development.jpg",
        banner: "/services/web-development/web-development.jpg",
        gallery: ["/services/web-development/web-development.jpg"],
        meta_title: "Next.js 16 Web Vitals Guide | Star Solutions BD",
        meta_description: "Master modern Next.js 16 performance engineering for top Google SEO rankings.",
        seo_keyword: "nextjs development company bangladesh, web performance dhaka",
        createBy: admin._id,
        is_active: true,
      },
    ]);
    console.log("✅ Tech Blogs seeded (2 articles)");
  }

  // 10. Site Settings
  const settingCount = await Setting.countDocuments();
  if (settingCount === 0) {
    await Setting.create({
      websiteName: "Star Solutions BD",
      websiteTitle: "Star Solutions BD | Top Software & Custom IT Solutions Company in Bangladesh",
      websiteDescription:
        "Star Solutions (Star Solutions BD) is an industry-leading software development and IT consulting company based in Dhaka, Bangladesh.",
      websiteKeywords:
        "star solutions, star solutions bd, software company in bangladesh, custom erp bd, web development dhaka",
      logo: "/logo_white.png",
      logoWhite: "/logo_white.png",
      favicon: "/favicon.ico",
      phone: "+880 1700-000000",
      secondaryPhone: "+880 1800-000000",
      email: "info@starsolutionsbd.com",
      supportEmail: "support@starsolutionsbd.com",
      officeAddress: "Banani / Gulshan Commercial Area, Dhaka-1213, Bangladesh",
      facebook: "https://facebook.com/starsolutionsbd",
      linkedin: "https://linkedin.com/company/starsolutionsbd",
      twitter: "https://twitter.com/starsolutionsbd",
      metaTitle: "Star Solutions BD | Top Software & Custom IT Solutions Company in Bangladesh",
      metaDescription:
        "Star Solutions is a premier custom software development and IT engineering company in Bangladesh specializing in Enterprise ERP, Web, Mobile, and AI Automation.",
      metaKeywords:
        "star solutions, star solutions bd, software development company in bangladesh, top it company dhaka",
      status: true,
    });
    console.log("✅ Master Site Settings seeded");
  }

  // 11. About Us
  const { About } = await import("../src/models/about.model.js");
  const aboutCount = await About.countDocuments();
  if (aboutCount === 0) {
    await About.create({
      banner_image: "/home/banner/banner.webp",
      title: "Engineering Digital Excellence for Global Enterprises",
      short_description:
        "Star Solutions (Star Solutions BD) is a premier technology partner empowering businesses through transformative enterprise software, custom ERP, scalable web platforms, and intelligent automation.",
      chairman_image: "/user.png",
      chairman_name: "K. M. Tareq",
      chairman_designation: "Founder & Chairman, Star Solutions BD",
      chairman_message:
        "At Star Solutions BD, our north star has always been technical integrity and client prosperity. We do not just build software—we engineer resilient architectures that empower companies to outpace competitors and scale sustainably in the modern AI-driven era.\nWith a decade of engineering excellence, our teams continue to deliver mission-critical solutions across Europe, North America, and Bangladesh.",
      mission:
        "Empower enterprises globally with high-performance, robust, and scalable software solutions that maximize operational efficiency and accelerate digital transformation.",
      vision:
        "To be recognized as Bangladesh's most innovative and trusted enterprise software engineering power-house, bridging local engineering brilliance with international standards.",
      is_active: true,
      createdBy: admin._id,
    });
    console.log("✅ About Page content seeded");
  }

  console.log("\n🎉 ALL COLLECTIONS SUCCESSFULLY SEEDED IN MONGODB ATLAS!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
