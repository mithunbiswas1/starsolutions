// src/app/(home)/_components/AtAGlanceSection.jsx
import Image from "next/image";
import { H2, H3, P } from "@/components/ui/Typography";
import { baseUriBackend } from "@/redux/url/url";
import { allianceData as defaultAlliance } from "../_data/allianceData";

function StatCard({ value, label }) {
  return (
    <div className="glass-dark bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl text-white rounded-2xl p-6 lg:p-8 flex flex-col justify-center border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-xl group">
      <H3 className="font-bold leading-none mb-3 text-white">
        <span className="text-primary group-hover:drop-shadow-[0_0_12px_rgba(46,208,110,0.4)] transition-all">{value}</span>
      </H3>
      <P className="text-gray-300 text-sm sm:text-base leading-snug">{label}</P>
    </div>
  );
}

export default function AtAGlanceSection({ alliances }) {
  const dynamicAlliance = alliances?.data;
  const alliance = dynamicAlliance || defaultAlliance;

  // Get certification images
  const certificationImages = dynamicAlliance
    ? [
        dynamicAlliance.alliance_image1,
        dynamicAlliance.alliance_image2,
        dynamicAlliance.alliance_image3,
        dynamicAlliance.alliance_image4,
      ].filter(Boolean)
    : defaultAlliance.certificationImages;

  // Stats array
  const stats = [
    {
      value: `${alliance.experience_year || 12} years`,
      label: "in the global IT market",
    },
    {
      value: `${alliance.client || 95}+ clients served`,
      label: "including 5 from Fortune 500",
    },
    {
      value: `${alliance.projects || 280} projects`,
      label: "successfully served",
    },
    {
      value: `${alliance.countries || 35} countries`,
      label: "on our global delivery map",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-transparent text-white relative overflow-hidden">
      {/* Subtle ambient glass glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <H2 className="text-white font-extrabold text-3xl sm:text-4xl mb-10 lg:mb-14">
          Star Solutions BD Delivery At A Glance
        </H2>


        <div className="grid lg:grid-cols-[3fr_7fr] gap-8 lg:gap-14 items-center">
          {/* Logos with Frosted Glass Badges */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {certificationImages.map((image, index) => (
              <div
                key={index}
                className="glass-badge bg-white/[0.03] backdrop-blur-md rounded-2xl p-4 lg:p-6 flex items-center justify-center border border-white/10 hover:border-white/25 transition-all select-none hover:bg-white/[0.06]"
              >
                <Image
                  src={
                    image?.startsWith("/")
                      ? image
                      : `${baseUriBackend}${image}`
                  }
                  alt={`Certification ${index + 1}`}
                  width={200}
                  height={100}
                  className="w-full h-auto max-h-16 object-contain opacity-85 hover:opacity-100 transition brightness-110"
                  unoptimized={image?.endsWith(".svg")}
                />
              </div>
            ))}
          </div>

          {/* Stats with Frosted Glass Cards */}
          <div className="space-y-4 lg:space-y-6">
            {/* Row 1 */}
            <div className="grid gap-4 lg:gap-6 md:grid-cols-[3fr_5fr]">
              <StatCard value={stats[0].value} label={stats[0].label} />
              <StatCard value={stats[1].value} label={stats[1].label} />
            </div>

            {/* Row 2 */}
            <div className="grid gap-4 lg:gap-6 md:grid-cols-[3fr_5fr]">
              <StatCard value={stats[2].value} label={stats[2].label} />
              <StatCard value={stats[3].value} label={stats[3].label} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
