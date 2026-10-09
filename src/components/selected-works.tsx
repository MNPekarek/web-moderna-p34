import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { getCategoryById, getProjectImage } from "@/content/selectors";

export function SelectedWorks() {
  return (
    <section id="obras" className="selected-works" aria-labelledby="selected-works-title">
      <header className="selected-works__header"><p className="eyebrow">01 — Obras seleccionadas</p><h2 id="selected-works-title">Una lectura del<br /><em>territorio habitado.</em></h2></header>
      <div className="selected-works__list">
        {projects.map((project) => {
          const image = getProjectImage(project);
          const category = getCategoryById(project.categoryId);
          const content = <><figure><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 92vw, 62vw" quality={90} /></figure><div className="selected-work__meta"><span>{project.code}</span><span>{category?.label}</span></div><h3>{project.title}</h3><span className="selected-work__action">{project.detailPublished ? "Ver proyecto ↗" : "Archivo en desarrollo"}</span></>;
          return project.detailPublished ? <Link className="selected-work" href={`/proyectos/${project.slug}`} key={project.id}>{content}</Link> : <article className="selected-work is-unpublished" key={project.id} aria-label={`${project.title}, archivo en desarrollo`}>{content}</article>;
        })}
      </div>
    </section>
  );
}
