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
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center pt-16">
        <div className="absolute inset-0">
          <Image
            src={`${baseUriBackend}${study.banner || study.thumbnail}`}
            alt={study.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 py-20">
          <div className="mb-4">
            <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
              {study.category}
            </span>
          </div>
          <H1 className="text-white mb-6">{study.title}</H1>
          <div className="flex flex-wrap gap-6 text-white">
            <div>
              <span className="text-gray-300">Client:</span>
              <p className="font-semibold">{study.client}</p>
            </div>
            <div>
              <span className="text-gray-300">Duration:</span>
              <p className="font-semibold">{study.duration}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <H2 className="mb-6">Project Overview</H2>
              <P className="text-gray-600 leading-relaxed mb-8">
                {study.short_description ||
                  stripHtml(study.description).substring(0, 200)}
              </P>

              <H3 className="text-2xl font-bold mb-4">The Challenge</H3>
              <div
                className="text-gray-600 leading-relaxed mb-8 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: study.description || "No description available.",
                }}
              />

              <H3 className="text-2xl font-bold mb-4">Our Solution</H3>
              <div
                className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: study.description || "No solution details available.",
                }}
              />
            </div>

            <div>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <H3 className="font-bold mb-4">Technologies</H3>
                <div className="flex flex-wrap gap-2">
                  {study.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <H3 className="font-bold mb-4">Project Details</H3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Client</span>
                    <p className="font-semibold">{study.client}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Category</span>
                    <p className="font-semibold">{study.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Duration</span>
                    <p className="font-semibold">{study.duration}</p>
                  </div>
                  {study.published_at && (
                    <div>
                      <span className="text-gray-500 text-sm">Published</span>
                      <p className="font-semibold">
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
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <H2 className="text-center mb-12">Project Gallery</H2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden shadow-lg"
                >
                  <Image
                    src={`${baseUriBackend}${image}`}
                    alt={`${study.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl text-primary mb-6">"</div>
          <P className="text-xl text-gray-700 italic mb-8">
            {study.short_description ||
              "Exceptional work delivered on time and within budget."}
          </P>
          <div>
            <p className="font-bold text-lg">
              {study.createBy?.fullName || "Client"}
            </p>
            <p className="text-gray-600">
              {study.client || "Satisfied Client"}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <H2 className="mb-6">Ready to Start Your Project?</H2>
          <P className="text-gray-600 mb-8">
            Let's discuss how we can help you achieve similar success for your
            business.
          </P>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-primary text-white rounded-xl hover:opacity-90 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
