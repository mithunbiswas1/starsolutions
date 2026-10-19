// src/app/(home)/_components/CompanyLogoSection.jsx

import Image from "next/image";
import { baseUriBackend } from "@/redux/url/url";

export default function CompanyLogoSection({ companies }) {
  const companyList = companies?.data?.companies || [];

  if (companyList.length === 0) return null;

  return (
    <section className="bg-white py-6 overflow-hidden relative">
      <div className="flex w-max animate-marquee">
        {[...companyList, ...companyList].map((company, index) => (
          <div
            key={`${company.id}-${index}`}
            className="shrink-0 mx-6 lg:mx-10 flex items-center justify-center"
          >
            <Image
              src={`${baseUriBackend}${company.image}`}
              alt={company.title || "Company logo"}
              width={180}
              height={60}
              className="h-12 lg:h-16 w-auto object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
}
