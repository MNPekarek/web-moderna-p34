import { ResponsiveMedia } from "@/components/responsive-media";
import { getEvidenceImage } from "@/content/selectors";
import { territoryPrinciples } from "@/content/territory-principles";

export function TerritoryContinuation() {
  const firstEvidence = territoryPrinciples[0].evidence[0];
  const image = getEvidenceImage(firstEvidence.projectId, firstEvidence.imageId);

  return (
    <div className="territory-visual">
      <figure className="territory-media" data-territory-media>
        <div className="territory-image-shell" data-territory-image-shell>
          {image && (
            <ResponsiveMedia
              src={image.src}
              alt={image.alt}
              sizes="(max-width: 760px) 100vw, 62vw"
              className="territory-image"
            />
          )}
        </div>
        <figcaption><span>Territorio</span><span>34° Sur</span></figcaption>
      </figure>
      <aside className="territory-spec territory-principles" aria-label="Principios de P—34">
        <p className="territory-spec__label">Principios</p>
        <ol>
          {territoryPrinciples.map((principle) => (
            <li key={principle.id}>
              <span>{principle.index}</span>
              <div><strong>{principle.title}</strong><p>{principle.statement}</p></div>
            </li>
          ))}
        </ol>
      </aside>
      <p className="territory-number" aria-hidden="true">34°</p>
    </div>
  );
}
