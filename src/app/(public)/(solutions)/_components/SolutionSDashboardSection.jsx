// src/app/(solutions)/_components/SolutionSDashboardSection.jsx

import Image from "next/image";
import { H2, H3, P } from "@/components/ui/Typography";

const dashboards = [
  {
    title: "Finance Dashboard",
    description:
      "Get real-time insights into revenue, expenses, cash flow, and financial performance across your organization.",
    image: "/solutions/erp/finance_dashboard.webp",
  },
  {
    title: "Operations Dashboard",
    description:
      "Monitor daily operations, workflow efficiency, and process performance in a centralized view.",
    image: "/solutions/erp/operations_dashboard2.webp",
  },
  {
    title: "Sales Dashboard",
    description:
      "Track leads, conversions, sales pipeline, and team performance with live analytics.",
    image: "/solutions/erp/sales_dashboard2.webp",
  },
  {
    title: "HR Dashboard",
    description:
      "Manage employee performance, attendance, payroll status, and recruitment analytics in one place.",
    image: "/solutions/erp/hr_dashboard2.webp",
  },
];

function DashboardCard({ item, reverse }) {
  return (
    <div className="rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 overflow-hidden grid lg:grid-cols-2 transition-all duration-500 group">
      {/* Image */}
      <div
        className={`relative min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] overflow-hidden ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-center p-6 sm:p-10 lg:p-14 ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Control Center
          </span>
        </div>

        <H3 className="font-bold text-white mb-4 text-2xl lg:text-3xl leading-tight group-hover:text-primary transition-colors">
          {item.title}
        </H3>

        <P className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-xl">
          {item.description}
        </P>
      </div>
    </div>
  );
}

export default function SolutionSDashboardSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-white/10">
            Real-Time Intelligence
          </div>
          <H2 className="font-extrabold text-white mb-4 text-3xl sm:text-4xl">
            Powerful ERP Dashboards for Smarter Decisions
          </H2>

          <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Our ERP dashboards provide real-time visibility across all core
            business functions, helping you monitor performance, identify
            bottlenecks, and make data-driven decisions instantly.
          </P>
        </div>

        {/* Dashboard Sections */}
        <div className="space-y-6">
          {dashboards.map((item, index) => (
            <DashboardCard key={index} item={item} reverse={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

