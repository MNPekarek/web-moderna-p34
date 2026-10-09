"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getAtlasTestProjects } from "@/content/atlas-test-projects";
import { categories } from "@/content/categories";
import { getProjectImage, getProjectsByCategory } from "@/content/selectors";
import type { CategoryId, Project, ProjectImage } from "@/content/types";

const atlasCategories = categories.map((category) => ({
  ...category,
  projects: getAtlasTestProjects(category.id, getProjectsByCategory(category.id)),
}));

type AtlasTile = {
  project: Project;
  image: ProjectImage;
  crop?: "left" | "right";
};

function buildAtlasTiles(projects: Project[], startIndex: number): AtlasTile[] {
  if (!projects.length) return [];

  if (projects.length >= 3) {
    return Array.from({ length: 3 }, (_, offset) => {
      const project = projects[(startIndex + offset) % projects.length];
      return { project, image: getProjectImage(project) };
    });
  }

  if (projects.length === 2) {
    const first = projects[startIndex % projects.length];
    const second = projects[(startIndex + 1) % projects.length];
    return [
      { project: first, image: getProjectImage(first) },
      { project: second, image: getProjectImage(second) },
      { project: first, image: first.images[1] ?? getProjectImage(first), crop: "right" },
    ];
  }

  const project = projects[0];
  const images = project.images.slice(0, 3);
  while (images.length < 3) images.push(images[0]);

  return images.map((image, index) => ({
    project,
    image,
    crop: index === 1 ? "right" : index === 2 ? "left" : undefined,
  }));
}

export function AtlasVivo() {
  const initialCategoryId = atlasCategories[0].id;
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>(initialCategoryId);
  const [displayedCategoryId, setDisplayedCategoryId] = useState<CategoryId>(initialCategoryId);
  const [projectIndex, setProjectIndex] = useState(0);

  const activeCategory = useMemo(
    () => atlasCategories.find((category) => category.id === displayedCategoryId) ?? atlasCategories[0],
    [displayedCategoryId],
  );
  const projectCount = activeCategory.projects.length;
  const hasOverflowProjects = projectCount > 3;
  const tiles = useMemo(
    () => buildAtlasTiles(activeCategory.projects, projectIndex),
    [activeCategory.projects, projectIndex],
  );

  const showCategory = (categoryId: CategoryId) => {
    setDisplayedCategoryId(categoryId);
    setProjectIndex(0);
  };

  const selectCategory = (categoryId: CategoryId) => {
    setSelectedCategoryId(categoryId);
    showCategory(categoryId);
  };

  const restoreSelectedCategory = () => {
    if (displayedCategoryId !== selectedCategoryId) showCategory(selectedCategoryId);
  };

  const changeProject = (direction: -1 | 1) => {
    if (!hasOverflowProjects) return;
    setProjectIndex((current) => (current + direction + projectCount) % projectCount);
  };

  return (
    <section id="atlas" className="home-atlas" aria-labelledby="atlas-title">
      <header className="home-atlas__header">
        <p id="atlas-title" className="eyebrow">03 — Atlas vivo</p>
      </header>
      <div className="home-atlas__body">
        <nav
          className="home-atlas__categories"
          aria-label="Categorías del atlas"
          onMouseLeave={restoreSelectedCategory}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) restoreSelectedCategory();
          }}
        >
          {atlasCategories.map((category) => {
            const isDisplayed = category.id === displayedCategoryId;
            const isSelected = category.id === selectedCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                className={isDisplayed ? "is-active" : ""}
                onMouseEnter={() => showCategory(category.id)}
                onFocus={() => showCategory(category.id)}
                onClick={() => selectCategory(category.id)}
                aria-pressed={isSelected}
              >
                <span>{category.label}</span>
                <small>0{category.order}</small>
              </button>
            );
          })}
        </nav>

        <div className="home-atlas__viewer" aria-live="polite">
          <div className="home-atlas__collage" key={`${displayedCategoryId}-${projectIndex}`}>
            {tiles.map((tile, index) => {
              const className = `home-atlas__tile home-atlas__tile--${index + 1}${tile.crop ? ` is-crop-${tile.crop}` : ""}${tile.project.detailPublished ? " is-linked" : ""}`;
              const content = (
                <>
                <Image
                  className="home-atlas__project-image"
                  src={tile.image.src}
                  alt={tile.image.alt}
                  fill
                  sizes={index === 0 ? "(max-width: 760px) 92vw, 38vw" : "(max-width: 760px) 42vw, 24vw"}
                  quality={90}
                />
                <span className="home-atlas__tile-action">Ver proyecto</span>
                <span className="home-atlas__tile-meta">
                  <span>{tile.project.code}</span>
                  <strong>{tile.project.title}</strong>
                </span>
                </>
              );

              return tile.project.detailPublished ? (
                <Link className={className} href={`/proyectos/${tile.project.slug}`} key={`${tile.project.id}-${tile.image.id}-${index}`} aria-label={`Ver proyecto ${tile.project.title}`}>
                  {content}
                </Link>
              ) : (
                <figure className={className} key={`${tile.project.id}-${tile.image.id}-${index}`}>
                  {content}
                </figure>
              );
            })}
          </div>
          {tiles.length > 0 && (
            <div className={`home-atlas__project-nav${hasOverflowProjects ? "" : " is-single"}`}>
              <span>{String(projectIndex + 1).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}</span>
              <div>
                <button type="button" onClick={() => changeProject(-1)} disabled={!hasOverflowProjects} aria-label="Proyecto anterior">←</button>
                <button type="button" onClick={() => changeProject(1)} disabled={!hasOverflowProjects} aria-label="Proyecto siguiente">→</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Link className="home-atlas__link" href="#obras">Ver todas las obras →</Link>
    </section>
  );
}
