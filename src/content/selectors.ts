import { categories } from "@/content/categories";
import { featuredProjectEntries } from "@/content/featured-projects";
import { projects } from "@/content/projects";
import type { CategoryId, Project, ProjectImage, ProjectSummary } from "@/content/types";

export function getProjectById(id: string) { return projects.find((project) => project.id === id); }
export function getProjectBySlug(slug: string) { return projects.find((project) => project.slug === slug && project.published); }
export function getPublishedProjects() { return projects.filter((project) => project.published); }
export function getDetailProjects() { return projects.filter((project) => project.published && project.detailPublished); }
export function getProjectsByCategory(categoryId: CategoryId) { return getPublishedProjects().filter((project) => project.categoryId === categoryId); }
export function getCategoryById(id: CategoryId) { return categories.find((category) => category.id === id); }
export function getCategoryCount(categoryId: CategoryId) { return getProjectsByCategory(categoryId).length; }

export function getProjectImage(project: Project, imageId?: string): ProjectImage {
  const image = imageId ? project.images.find((item) => item.id === imageId) : undefined;
  return image ?? project.images.find((item) => item.role === "hero") ?? project.images[0];
}

export function toProjectSummary(project: Project, imageId?: string): ProjectSummary {
  const category = getCategoryById(project.categoryId);
  const image = getProjectImage(project, imageId);
  return {
    id: project.id,
    slug: project.slug,
    number: project.code.replace("P34—", ""),
    title: project.title,
    location: project.metadata.location,
    category: category?.label ?? project.categoryId,
    year: project.metadata.year?.toString() ?? "—",
    coordinates: project.metadata.coordinates?.label ?? "—",
    image: image.src,
    composition: project.composition,
    territoryAlt: image.alt,
  };
}

export const projectSummaries = getPublishedProjects().map((project) => toProjectSummary(project));

export const featuredProjects = featuredProjectEntries
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((entry) => {
    const project = getProjectById(entry.projectId);
    if (!project) throw new Error(`Featured project not found: ${entry.projectId}`);
    return toProjectSummary(project, entry.heroImageId);
  });

export function getEvidenceImage(projectId: string, imageId: string) {
  const project = getProjectById(projectId);
  if (!project) return undefined;
  return project.images.find((image) => image.id === imageId);
}

export function getProjectNavigation(slug: string) {
  const detailProjects = getDetailProjects();
  const index = detailProjects.findIndex((project) => project.slug === slug);
  if (index < 0 || detailProjects.length < 2) return { previous: undefined, next: undefined };
  return {
    previous: detailProjects[(index - 1 + detailProjects.length) % detailProjects.length],
    next: detailProjects[(index + 1) % detailProjects.length],
  };
}
