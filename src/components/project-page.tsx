import Image from "next/image";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectPagination } from "@/components/project-pagination";
import { ProjectMotion } from "@/components/project-motion";
import { ProjectLightbox } from "@/components/project-lightbox";
import { ProjectTouchInteractions } from "@/components/project-touch-interactions";
import { ProjectIntro } from "@/components/project-intro";
import type { Project, ProjectImage } from "@/content/types";
import { getCategoryById, getProjectImage } from "@/content/selectors";

const statusLabels = { concepto: "Concepto", "en-desarrollo": "En desarrollo", "en-obra": "En obra", completado: "Completado" };

export function ProjectPage({ project, previous, next }: { project: Project; previous?: Project; next?: Project }) {
  const hero = getProjectImage(project);
  const category = getCategoryById(project.categoryId);
  const heroMeta = [
    project.metadata.location && ["Lugar", project.metadata.location],
    project.metadata.year && ["Año", String(project.metadata.year)],
    project.metadata.status && ["Estado", statusLabels[project.metadata.status]],
  ].filter(Boolean) as [string, string][];
  const specs = [
    ["Proyecto", project.code],
    project.metadata.program && ["Programa", project.metadata.program],
    project.metadata.location && ["Ubicación", project.metadata.location],
    project.metadata.year && ["Año", String(project.metadata.year)],
    project.metadata.areaM2 && ["Superficie", `${project.metadata.areaM2} m²`],
    project.metadata.coordinates?.label && ["Coordenadas", project.metadata.coordinates.label],
  ].filter(Boolean) as [string, string][];
  const galleryImageIds = project.galleryLayout?.flatMap((block) => {
    if ("imageIds" in block) return [...block.imageIds];
    if ("imageId" in block && block.imageId) return [block.imageId];
    return [];
  }) ?? [];
  const galleryImages = galleryImageIds.map((id) => project.images.find((image) => image.id === id)).filter((image): image is ProjectImage => Boolean(image));

  return (
    <main className="project-page" data-project-page>
      <ProjectIntro projectCode={project.code} />
      <ProjectMotion />
      <ProjectLightbox code={project.code} title={project.title} images={galleryImages} />
      <ProjectTouchInteractions />
      <section className="project-hero" data-project-hero aria-labelledby="project-title">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" quality={92} className="project-hero__image" />
        <div className="project-hero__scrim" aria-hidden="true" />
        <p className="project-hero__code">{project.code} / {category?.label}</p>
        <h1 id="project-title">{project.title}</h1>
        <dl className="project-hero__meta">{heroMeta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <span className="project-hero__scroll" aria-hidden="true">Proyecto / descender</span>
      </section>

      <section className="project-opening">
        <p className="eyebrow">01 — Proyecto</p>
        <div className="project-opening__lead"><p>{project.summary}</p></div>
        <dl className="project-specs">{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <div className="project-opening__concept">{project.concept.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <ProjectGallery project={project} />
      <ProjectPagination previous={previous} next={next} />
    </main>
  );
}
