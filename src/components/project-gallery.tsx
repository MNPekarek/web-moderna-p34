import Image from "next/image";
import type { Project, ProjectGalleryBlock, ProjectImage } from "@/content/types";

function resolveImage(project: Project, imageId: string) {
  const image = project.images.find((item) => item.id === imageId);
  if (!image) throw new Error(`Image ${imageId} not found in project ${project.id}`);
  return image;
}

function caption(image: ProjectImage) {
  return (
    <figcaption>
      <span>{image.caption ?? image.role}</span>
    </figcaption>
  );
}

function media(image: ProjectImage, className = "", sizes = "(max-width: 760px) 100vw, 80vw") {
  return (
    <button className="project-photo-trigger" type="button" data-lightbox-image={image.id} aria-label={`Ampliar imagen: ${image.caption ?? image.alt}`} aria-haspopup="dialog">
      <span className="project-photo-hover"><Image className={className} src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} quality={92} /></span>
      <span className="project-photo-cursor" aria-hidden="true" style={{ backgroundImage: `url("${image.src}")` }}><b>+</b></span>
    </button>
  );
}

export function createFallbackGallery(project: Project): ProjectGalleryBlock[] {
  const hero = project.images.find((image) => image.role === "hero") ?? project.images[0];
  const images = project.images.filter((image) => image.id !== hero.id);
  if (images.length === 0) return [];
  if (images.length === 1) return [{ id: "fallback-final", type: "finalMonument", imageId: images[0].id }];
  if (images.length === 2) return [{ id: "fallback-pair", type: "diptych", imageIds: [images[0].id, images[1].id], variant: "equal" }];
  const blocks: ProjectGalleryBlock[] = [
    { id: "fallback-opening", type: "containedLandscape", imageId: images[0].id, align: "center" },
  ];
  const middle = images.slice(1, -1);
  for (let index = 0; index < middle.length; index += 3) {
    const group = middle.slice(index, index + 3);
    if (group.length === 1) blocks.push({ id: `fallback-detail-${index}`, type: "detail", imageId: group[0].id, align: index % 2 ? "right" : "left" });
    else blocks.push({ id: `fallback-sequence-${index}`, type: "sequence", imageIds: group.map((item) => item.id) as [string, string] | [string, string, string] });
  }
  blocks.push({ id: "fallback-final", type: "finalMonument", imageId: images.at(-1)!.id });
  return blocks;
}

export function ProjectGallery({ project }: { project: Project }) {
  const layout = project.galleryLayout?.length ? project.galleryLayout : createFallbackGallery(project);

  return (
    <section className="project-gallery-system" data-project-gallery data-header-theme="dark" aria-label={`Ensayo fotográfico de ${project.title}`}>
      {layout.map((block) => {
        if (block.type === "materialInterlude") {
          const detailImage = block.imageId ? resolveImage(project, block.imageId) : undefined;
          return (
            <section className={`gallery-block gallery-material gallery-block--${block.id}`} data-header-theme="light" key={block.id}>
              <p className="eyebrow">Materia / sistema</p>
              <p className="gallery-material__statement">{block.statement}</p>
              <ul>{(block.materials ?? project.materialTags).map((item) => <li key={item}>{item}</li>)}</ul>
              {detailImage && <figure>{media(detailImage)}{caption(detailImage)}</figure>}
            </section>
          );
        }

        if (block.type === "fullBleed" || block.type === "finalMonument") {
          const image = resolveImage(project, block.imageId);
          return <figure className={`gallery-block gallery-${block.type} gallery-block--${block.id} ${block.type === "fullBleed" ? `is-${block.height ?? "cinematic"}` : ""}`} key={block.id}>{media(image, "", "100vw")}{block.type !== "finalMonument" && caption(image)}</figure>;
        }

        if (block.type === "containedLandscape" || block.type === "detail") {
          const image = resolveImage(project, block.imageId);
          return <figure className={`gallery-block gallery-${block.type} gallery-block--${block.id} align-${block.align ?? "center"}`} key={block.id}>{media(image)}{caption(image)}</figure>;
        }

        const images = block.imageIds.map((id) => resolveImage(project, id));
        const variant = "variant" in block ? block.variant : undefined;
        const position = block.type === "verticalLandscape" ? block.verticalPosition : undefined;
        if (block.type === "asymmetricPair" && block.editorial) {
          return (
            <div className={`gallery-block gallery-asymmetricPair gallery-block--${block.id} is-${block.variant ?? "lead-left"} has-editorial`} key={block.id}>
              {images.map((image, index) => (
                <article className="gallery-editorial-row" key={image.id}>
                  <figure>{media(image, "", "(max-width: 760px) 100vw, 66vw")}{caption(image)}</figure>
                  <div className="gallery-editorial-copy">
                    {block.editorial?.[index].eyebrow && <p className="eyebrow">{block.editorial[index].eyebrow}</p>}
                    <h2>{block.editorial?.[index].title}</h2>
                    <p>{block.editorial?.[index].body}</p>
                  </div>
                </article>
              ))}
            </div>
          );
        }
        return (
          <div className={`gallery-block gallery-${block.type} gallery-block--${block.id} ${variant ? `is-${variant}` : ""} ${position ? `vertical-${position}` : ""}`} key={block.id}>
            {images.map((image) => <figure key={image.id}>{media(image)}{caption(image)}</figure>)}
          </div>
        );
      })}
    </section>
  );
}
