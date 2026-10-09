export type CategoryId = "habitar" | "conjuntos" | "interiores" | "trabajo";

export type ProjectStatus = "concepto" | "en-desarrollo" | "en-obra" | "completado";

export type ProjectImageRole =
  | "cover"
  | "hero"
  | "exterior"
  | "interior"
  | "detail"
  | "landscape"
  | "material"
  | "plan"
  | "diagram";

export type ProjectImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  role: ProjectImageRole;
  tags: string[];
  caption?: string;
  focalPoint?: { x: number; y: number };
  priority?: boolean;
};

export type ProjectMetadata = {
  location: string;
  year: number | null;
  status: ProjectStatus;
  program?: string;
  areaM2?: number;
  coordinates?: { label: string; latitude?: number; longitude?: number };
  client?: string;
  collaborators?: string[];
  credits?: { role: string; name: string }[];
};

export type ProjectComposition = "litoral" | "patio" | "umbral" | "oficinas";

type GalleryBlockBase = { id: string };
export type FullBleedBlock = GalleryBlockBase & { type: "fullBleed"; imageId: string; height?: "cinematic" | "viewport" };
export type ContainedLandscapeBlock = GalleryBlockBase & { type: "containedLandscape"; imageId: string; align?: "left" | "center" | "right" };
export type DiptychBlock = GalleryBlockBase & { type: "diptych"; imageIds: [string, string]; variant?: "equal" | "lead-left" | "lead-right" };
export type VerticalLandscapeBlock = GalleryBlockBase & { type: "verticalLandscape"; imageIds: [string, string]; verticalPosition?: "left" | "right" };
export type GalleryEditorialCopy = { eyebrow?: string; title: string; body: string };
export type AsymmetricPairBlock = GalleryBlockBase & {
  type: "asymmetricPair";
  imageIds: [string, string];
  variant?: "lead-left" | "lead-right" | "offset";
  editorial?: [GalleryEditorialCopy, GalleryEditorialCopy];
};
export type DetailBlock = GalleryBlockBase & { type: "detail"; imageId: string; align?: "left" | "center" | "right"; label?: string };
export type SequenceBlock = GalleryBlockBase & { type: "sequence"; imageIds: [string, string] | [string, string, string] };
export type MaterialInterludeBlock = GalleryBlockBase & { type: "materialInterlude"; title: string; statement: string; imageId?: string; materials?: string[] };
export type FinalMonumentBlock = GalleryBlockBase & { type: "finalMonument"; imageId: string };

export type ProjectGalleryBlock =
  | FullBleedBlock
  | ContainedLandscapeBlock
  | DiptychBlock
  | VerticalLandscapeBlock
  | AsymmetricPairBlock
  | DetailBlock
  | SequenceBlock
  | MaterialInterludeBlock
  | FinalMonumentBlock;

export type Project = {
  id: string;
  slug: string;
  code: string;
  title: string;
  categoryId: CategoryId;
  summary: string;
  concept: string[];
  metadata: ProjectMetadata;
  images: ProjectImage[];
  materialTags: string[];
  relatedProjectIds?: string[];
  galleryLayout?: ProjectGalleryBlock[];
  composition: ProjectComposition;
  published: boolean;
  detailPublished?: boolean;
};

export type Category = {
  id: CategoryId;
  label: string;
  description: string;
  theme: "dark" | "light" | "warm" | "technical";
  order: number;
};

export type FeaturedProject = {
  projectId: string;
  order: number;
  heroImageId?: string;
  heroTitleLines?: string[];
};

export type TerritoryPrinciple = {
  id: "lugar" | "orientacion" | "materia" | "paisaje";
  index: string;
  title: string;
  statement: string;
  evidence: { projectId: string; imageId: string }[];
};

export type ProjectSummary = {
  id: string;
  slug: string;
  number: string;
  title: string;
  location: string;
  category: string;
  year: string;
  coordinates: string;
  image: string;
  composition: ProjectComposition;
  territoryAlt: string;
};
