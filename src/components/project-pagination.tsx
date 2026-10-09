import Image from "next/image";
import Link from "next/link";
import { getProjectImage } from "@/content/selectors";
import type { Project } from "@/content/types";

function ProjectPreview({ project, direction }: { project?: Project; direction: "previous" | "next" }) {
  const label = direction === "previous" ? "Proyecto anterior" : "Proyecto siguiente";
  const arrow = direction === "previous" ? "←" : "→";
  const content = (
    <>
      <span className="project-preview__direction">{direction === "previous" && `${arrow} `}{label}{direction === "next" && ` ${arrow}`}</span>
      {project && <figure><Image src={getProjectImage(project).src} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" /></figure>}
      <span className="project-preview__project">
        {project ? <><small>{project.code}</small><strong>{project.title}</strong></> : <strong>En preparación</strong>}
      </span>
    </>
  );

  return project ? (
    <Link className={`project-preview project-preview--${direction}`} href={`/proyectos/${project.slug}`}>{content}</Link>
  ) : (
    <div className={`project-preview project-preview--${direction} is-unavailable`} aria-disabled="true">{content}</div>
  );
}

export function ProjectPagination({ previous, next }: { previous?: Project; next?: Project }) {
  return (
    <nav className="project-pagination" data-header-theme="dark" aria-label="Navegación entre proyectos">
      <ProjectPreview project={previous} direction="previous" />
      <ProjectPreview project={next} direction="next" />
      <Link className="project-pagination__all" href="/#atlas">Ver todas las obras →</Link>
    </nav>
  );
}
