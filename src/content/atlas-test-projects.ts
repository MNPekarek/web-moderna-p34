import type { CategoryId, Project } from "@/content/types";

// TEMPORARY ATLAS TEST DATA
// Remove this file and the getAtlasTestProjects call in AtlasVivo when the
// real catalogue has enough projects to exercise every collage state.
const targetCounts: Record<CategoryId, number> = {
  habitar: 6,
  conjuntos: 4,
  interiores: 3,
  trabajo: 5,
};

function createMockProject(base: Project, index: number): Project {
  const rotatedImages = base.images.map((_, imageIndex, images) => images[(imageIndex + index) % images.length]);

  return {
    ...base,
    id: `atlas-mock-${base.id}-${index + 1}`,
    slug: `atlas-mock-${base.slug}-${index + 1}`,
    code: `MOCK—${String(index + 1).padStart(2, "0")}`,
    title: `${base.title} / prueba ${String(index + 1).padStart(2, "0")}`,
    images: rotatedImages,
    relatedProjectIds: undefined,
    galleryLayout: undefined,
    detailPublished: false,
  };
}

export function getAtlasTestProjects(categoryId: CategoryId, realProjects: Project[]): Project[] {
  if (!realProjects.length) return [];

  const missing = Math.max(0, targetCounts[categoryId] - realProjects.length);
  const mocks = Array.from({ length: missing }, (_, index) =>
    createMockProject(realProjects[index % realProjects.length], index),
  );

  return [...realProjects, ...mocks];
}
