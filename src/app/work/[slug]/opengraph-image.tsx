import { notFound } from "next/navigation";

import { FEATURED_PROJECTS, getProject } from "@/content/projects";
import { OG_SIZE, projectImage } from "@/lib/og";

export const alt = "A case study on msaleh.site: the project's name, its one-line summary and its cover screen.";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return FEATURED_PROJECTS.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return projectImage(project);
}
