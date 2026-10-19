import { CheckCircle } from "lucide-react";
import { H2, P } from "@/components/ui/Typography";

const points = [
  "Experienced development team",
  "Agile project delivery",
  "Client-focused communication",
  "Scalable technology solutions",
  "Long-term support and maintenance",
  "High-quality standards",
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 sm:py-24 bg-transparent relative border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <H2 className="text-center mb-12 text-white font-bold">Why Choose Us</H2>

        <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
          {points.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-2xl glass-dark bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all duration-300"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <CheckCircle size={20} className="text-primary" />
              </div>

              <P className="font-semibold text-white text-base">{point}</P>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
