// src/app/(pages)/projects/page.jsx

import ProjectsBanner from "./_components/ProjectsBanner";
import ProjectsHighlightsSection from "./_components/ProjectsHighlightsSection";
import ProjectsCTASection from "./_components/ProjectsCTASection";
import ProjectsShowcaseSection from "./_components/ProjectsShowcaseSection";
import { getListProjects } from "@/lib/getProjectApi";

export async function generateMetadata() {
  return {
    title: "Our Projects | Software Development Portfolio",
    description:
      "Explore our portfolio of successful projects across various industries including web development, mobile apps, software solutions, and more.",
  };
}

export default async function ProjectsPage() {
  const projects = await getListProjects({
    page: 1,
    limit: 50,
    is_active: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <main>
      <ProjectsBanner />
      <ProjectsHighlightsSection />
      <ProjectsShowcaseSection projects={projects} />
      {/* <ProjectsCTASection /> */}
    </main>
  );
}
