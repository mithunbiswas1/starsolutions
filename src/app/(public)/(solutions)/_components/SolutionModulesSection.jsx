// src/app/(solutions)/_components/SolutionModulesSection.jsx

import { H2, H4, P } from "@/components/ui/Typography";

const modules = [
  {
    title: "Finance & Accounting",
    description:
      "Automate budgeting, invoicing, expense tracking, and financial reporting with precision.",
  },
  {
    title: "Human Resources",
    description:
      "Manage employee data, payroll, attendance, recruitment, and performance in one system.",
  },
  {
    title: "Supply Chain",
    description:
      "Optimize procurement, inventory, warehouse, and logistics workflows seamlessly.",
  },
  {
    title: "Sales & CRM",
    description:
      "Track leads, manage customers, and improve conversion with integrated CRM tools.",
  },
  {
    title: "Inventory Management",
    description:
      "Real-time stock tracking, alerts, and warehouse optimization for better control.",
  },
  {
    title: "Reporting & Analytics",
    description:
      "Advanced dashboards and reports for data-driven decision making.",
  },
];

function ModuleCard({ item, index }) {
  return (
    <div className="p-8 rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1">
      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs mb-5 group-hover:scale-110 transition-transform">
        0{index + 1}
      </div>
      <H4 className="font-bold text-white mb-3 text-lg lg:text-xl group-hover:text-primary transition-colors">
        {item.title}
      </H4>

      <P className="text-gray-300 text-sm leading-relaxed">{item.description}</P>
    </div>
  );
}

export default function SolutionModulesSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[300px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <H2 className="font-extrabold text-white mb-4 text-3xl sm:text-4xl">
            Core ERP Modules Built for Enterprise Efficiency
          </H2>

          <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Our ERP platform is designed with modular architecture so you can
            enable only what your business needs — and scale anytime.
          </P>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((item, index) => (
            <ModuleCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}