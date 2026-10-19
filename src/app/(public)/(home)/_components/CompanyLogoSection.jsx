// src/app/(home)/_components/CompanyLogoSection.jsx
import Image from "next/image";
import { baseUriBackend } from "@/redux/url/url";
import { companyData as defaultCompanies } from "../_data/companyData";

export default function CompanyLogoSection({ companies }) {
  const dynamicCompanies = companies?.data?.companies || [];
  const companyList =
    dynamicCompanies.length > 0 ? dynamicCompanies : defaultCompanies;

  return (
    <section className="bg-white/[0.02] backdrop-blur-md py-6 sm:py-8 overflow-hidden relative border-y border-white/[0.08]">
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#080c14] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#080c14] to-transparent z-10" />

      <div className="flex w-max animate-marquee">
        {[...companyList, ...companyList].map((company, index) => (
          <div
            key={`${company.id}-${index}`}
            className="shrink-0 mx-3 sm:mx-6 px-5 py-3 rounded-2xl glass-badge bg-white/[0.03] border border-white/10 hover:border-primary/40 flex items-center justify-center select-none transition hover:bg-white/[0.06]"
          >
            {company.image?.startsWith("/home") || company.image?.startsWith("/") ? (
              <Image
                src={company.image}
                alt={company.title || "Company logo"}
                width={140}
                height={45}
                className="h-7 lg:h-9 w-auto object-contain opacity-70 hover:opacity-100 transition brightness-125"
              />
            ) : company.image ? (
              <Image
                src={`${baseUriBackend}${company.image}`}
                alt={company.title || "Company logo"}
                width={140}
                height={45}
                className="h-7 lg:h-9 w-auto object-contain opacity-70 hover:opacity-100 transition brightness-125"
                unoptimized
              />
            ) : (
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {company.title || company.name}
              </span>
            )}

          </div>
        ))}
      </div>
    </section>
  );
}
