import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/project-header";
import { ProjectPage } from "@/components/project-page";
import { getDetailProjects, getProjectBySlug, getProjectNavigation } from "@/content/selectors";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDetailProjects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: `${project.title} — PARALELO 34`, description: project.summary };
}

export default async function ProjectRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project?.detailPublished) notFound();
  const { previous, next } = getProjectNavigation(slug);
  return <><ProjectHeader code={project.code} title={project.title} /><ProjectPage project={project} previous={previous} next={next} /></>;
}
