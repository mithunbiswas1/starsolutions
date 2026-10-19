// src/app/(pages)/projects/[slug]/page.jsx

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import { getProjectBySlug } from "@/lib/getProjectApi";
import { baseUriBackend } from "@/redux/url/url";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const data = project?.data;

  if (!data) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: data.meta_title || data.title,
    description: data.meta_description || data.short_description,
    keywords: data.seo_keyword || "",
    openGraph: {
      title: data.meta_title || data.title,
      description: data.meta_description || data.short_description,
      images: data.banner ? [`${baseUriBackend}${data.banner}`] : [],
    },
  };
}

export default async function ProjectsDetailPage({ params }) {
  const { slug } = await params;
  const singleProjects = await getProjectBySlug(slug);

  const study = singleProjects?.data;

  if (!study) {
    notFound();
  }

  // Get gallery images (banner + gallery array)
  const galleryImages = [study.banner, ...(study.gallery || [])].filter(
    Boolean,
  );

  // Strip HTML tags from description for plain text preview
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <main className="bg-transparent text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] flex items-center pt-28 pb-16 overflow-hidden bg-[#080c14] border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src={`${baseUriBackend}${study.banner || study.thumbnail}`}
            alt={study.title}
            fill
            className="object-cover opacity-25"
            priority
            unoptimized
          />
        </div>

        {/* Ambient Radial Gradient Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-secondary/15 rounded-full blur-[110px] pointer-events-none" />

        {/* Cyber Grid Lines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/70 via-[#080c14]/50 to-[#080c14] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.06] text-primary text-xs font-semibold tracking-wider uppercase border border-white/15">
              {study.category}
            </span>
          </div>

          <H1 className="text-white mb-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-[0_0_20px_rgba(46,208,110,0.25)]">
            {study.title}
          </H1>

          <div className="flex flex-wrap gap-8 text-white">
            <div className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-xl">
              <span className="text-xs text-gray-400 block uppercase tracking-wider">Client</span>
              <p className="font-semibold text-white mt-0.5">{study.client}</p>
            </div>
            <div className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-xl">
              <span className="text-xs text-gray-400 block uppercase tracking-wider">Duration</span>
              <p className="font-semibold text-white mt-0.5">{study.duration}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <H2 className="text-white font-extrabold mb-4 text-2xl sm:text-3xl">Project Overview</H2>
                <P className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  {study.short_description ||
                    stripHtml(study.description).substring(0, 200)}
                </P>
              </div>

              <div className="p-8 rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <H3 className="text-2xl font-bold text-white mb-4">The Challenge</H3>
                <div
                  className="text-gray-300 leading-relaxed prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white"
                  dangerouslySetInnerHTML={{
                    __html: study.description || "No description available.",
                  }}
                />
              </div>

              <div className="p-8 rounded-2xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <H3 className="text-2xl font-bold text-white mb-4">Our Solution</H3>
                <div
                  className="text-gray-300 leading-relaxed prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white"
                  dangerouslySetInnerHTML={{
                    __html: study.description || "No solution details available.",
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <H3 className="font-bold text-white mb-4 text-lg">Technologies</H3>
                <div className="flex flex-wrap gap-2">
                  {study.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-white/[0.05] text-gray-200 border border-white/10 px-3 py-1 rounded-md text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <H3 className="font-bold text-white mb-4 text-lg">Project Details</H3>
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block">Client</span>
                    <p className="font-semibold text-white mt-1">{study.client}</p>
                  </div>
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block">Category</span>
                    <p className="font-semibold text-white mt-1">{study.category}</p>
                  </div>
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block">Duration</span>
                    <p className="font-semibold text-white mt-1">{study.duration}</p>
                  </div>
                  {study.published_at && (
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wider block">Published</span>
                      <p className="font-semibold text-white mt-1">
                        {new Date(study.published_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <H2 className="text-center text-white font-extrabold text-3xl sm:text-4xl mb-12">
              Project Gallery
            </H2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-2xl overflow-hidden glass-dark bg-white/[0.03] border border-white/10 shadow-lg hover:border-primary/40 transition-all duration-300 group"
                >
                  <Image
                    src={`${baseUriBackend}${image}`}
                    alt={`${study.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/60 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      <section className="py-20 relative overflow-hidden bg-transparent border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-8 sm:p-12 rounded-3xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10">
            <div className="text-5xl text-primary font-serif mb-4 leading-none select-none">“</div>
            <P className="text-lg sm:text-xl text-gray-200 italic mb-6 leading-relaxed">
              {study.short_description ||
                "Exceptional work delivered on time and within budget."}
            </P>
            <div>
              <p className="font-bold text-lg text-white">
                {study.createBy?.fullName || "Client"}
              </p>
              <p className="text-primary text-sm font-medium mt-1">
                {study.client || "Satisfied Client"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 sm:p-14 rounded-3xl glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <H2 className="text-white font-extrabold text-3xl sm:text-4xl mb-4">
              Ready to Start Your Project?
            </H2>
            <P className="text-gray-300 max-w-xl mx-auto mb-8 text-base sm:text-lg">
              Let's discuss how we can help you achieve similar success for your business.
            </P>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-primary hover:bg-[#25b55e] text-black font-semibold rounded-xl transition shadow-[0_0_20px_rgba(46,208,110,0.3)] hover:scale-[1.02]"
              >
                Contact Us
              </Link>
              <Link
                href="/projects"
                className="px-8 py-3.5 border border-white/20 hover:border-primary text-white hover:text-primary rounded-xl transition bg-white/[0.04]"
              >
                View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

