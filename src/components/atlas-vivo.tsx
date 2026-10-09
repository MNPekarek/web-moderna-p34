"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
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

type MobileTransitionPieces = {
  traveler: HTMLElement;
  travelerSource: HTMLElement;
  outgoing: HTMLElement;
  from: DOMRect;
  to: DOMRect;
  travelerKey: string;
  progress: number;
};

type MobileDrag = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  axis: "x" | "y" | null;
  direction: -1 | 1 | null;
  progress: number;
  raf: number | null;
  primary: HTMLElement;
  secondary: HTMLElement;
  pieces: MobileTransitionPieces | null;
};

const tileKey = (tile: AtlasTile) => `${tile.project.id}-${tile.image.id}`;

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
  const collageRef = useRef<HTMLDivElement>(null);
  const categoryOverlayRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const activeLineRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const isAnimatingRef = useRef(false);
  const mobileDragRef = useRef<MobileDrag | null>(null);

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

  useEffect(() => {
    if (!window.matchMedia("(min-width: 761px)").matches) return;
    atlasCategories.forEach((category) => {
      buildAtlasTiles(category.projects, 0).forEach((tile) => {
        const image = new window.Image();
        image.src = tile.image.src;
      });
    });
  }, []);

  useLayoutEffect(() => {
    const categoriesElement = categoriesRef.current;
    const line = activeLineRef.current;
    if (!categoriesElement || !line) return;
    const activeButton = categoriesElement.querySelector<HTMLElement>("button.is-active");
    if (!activeButton) return;
    gsap.set(line, { y: activeButton.offsetTop + activeButton.offsetHeight - 1, width: activeButton.offsetWidth });
  }, []);

  const isDesktop = () => window.matchMedia("(min-width: 761px)").matches;
  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCounter = (direction: -1 | 1) => {
    const counter = counterRef.current;
    if (!counter) return;
    const current = counter.querySelector<HTMLElement>(".home-atlas__counter-current");
    if (!current) return;
    const outgoing = current.cloneNode(true) as HTMLElement;
    outgoing.textContent = String(projectIndex + 1).padStart(2, "0");
    outgoing.classList.add("is-outgoing");
    outgoing.setAttribute("aria-hidden", "true");
    counter.appendChild(outgoing);
    gsap.fromTo(current, { yPercent: direction > 0 ? 110 : -110 }, { yPercent: 0, duration: .58, ease: "power4.out" });
    gsap.to(outgoing, { yPercent: direction > 0 ? -110 : 110, duration: .48, ease: "power4.in", onComplete: () => outgoing.remove() });
  };

  const animateMobileCounter = (direction: -1 | 1) => {
    const current = counterRef.current?.querySelector<HTMLElement>(".home-atlas__counter-current");
    if (!current) return;
    gsap.fromTo(current, { yPercent: direction > 0 ? 110 : -110 }, { yPercent: 0, duration: .42, ease: "power3.out", overwrite: true });
  };

  const prepareMobileTransition = (
    direction: -1 | 1,
    primary: HTMLElement,
    secondary: HTMLElement,
  ): MobileTransitionPieces | null => {
    const collage = collageRef.current;
    if (!collage) return null;
    const collageRect = collage.getBoundingClientRect();
    const travelerSource = direction > 0 ? secondary : primary;
    const destination = direction > 0 ? primary : secondary;
    const outgoing = direction > 0 ? primary : secondary;
    const from = travelerSource.getBoundingClientRect();
    const to = destination.getBoundingClientRect();
    const travelerKey = travelerSource.dataset.atlasKey ?? "";
    const traveler = travelerSource.cloneNode(true) as HTMLElement;
    traveler.classList.add("home-atlas__mobile-traveler");
    traveler.setAttribute("aria-hidden", "true");
    Object.assign(traveler.style, {
      left: `${from.left - collageRect.left}px`,
      top: `${from.top - collageRect.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
    });
    collage.appendChild(traveler);
    gsap.set(traveler, { zIndex: 30, willChange: "transform,width,height" });
    gsap.set([travelerSource, outgoing], { animation: "none" });
    gsap.set(outgoing, { willChange: "transform,opacity" });
    gsap.set(travelerSource, { visibility: "hidden" });
    return { traveler, travelerSource, outgoing, from, to, travelerKey, progress: 0 };
  };

  const animateMobileProjectChange = (
    direction: -1 | 1,
    nextIndex: number,
    prepared?: MobileTransitionPieces,
  ) => {
    const collage = collageRef.current;
    if (!collage) return;
    isAnimatingRef.current = true;

    const visibleTiles = Array.from(collage.querySelectorAll<HTMLElement>(":scope > .home-atlas__tile"))
      .filter((element) => element.offsetWidth > 0 && element.offsetHeight > 0);
    const primary = visibleTiles[0];
    const secondary = visibleTiles[1];
    const pieces = prepared ?? (primary && secondary ? prepareMobileTransition(direction, primary, secondary) : null);
    if (!pieces) {
      setProjectIndex(nextIndex);
      isAnimatingRef.current = false;
      return;
    }

    const { traveler, outgoing, from, to, travelerKey } = pieces;
    const progress = Math.max(0, Math.min(1, pieces.progress));
    const remaining = Math.max(.06, .82 * (1 - progress));

    const navigationButtons = collage.parentElement?.querySelectorAll(".home-atlas__project-nav button");
    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
    });

    timeline.to(outgoing, {
      x: direction > 0 ? -Math.max(54, collage.clientWidth * .2) : Math.max(34, collage.clientWidth * .1),
      y: direction > 0 ? -16 : 10,
      scale: direction > 0 ? .95 : .96,
      duration: Math.max(.18, .62 * (1 - progress)),
      ease: "power2.inOut",
    }, 0);
    if (direction > 0) {
      timeline.to(outgoing, {
        opacity: .12,
        duration: Math.max(.14, .22 * (1 - progress)),
        ease: "power2.in",
      }, Math.max(0, remaining - .22));
    } else {
      timeline.to(outgoing, { opacity: .15, duration: Math.max(.18, .64 * (1 - progress)), ease: "power3.inOut" }, 0);
    }
    timeline.to(traveler, {
      x: to.left - from.left,
      y: to.top - from.top,
      width: to.width,
      height: to.height,
      transformOrigin: "0 0",
      duration: remaining,
      ease: "power2.inOut",
    }, 0);

    if (navigationButtons?.length) {
      timeline.fromTo(navigationButtons, { x: direction * 3, scale: .9 }, { x: 0, scale: 1, duration: .3, ease: "power4.out" }, 0);
    }

    timeline.call(() => {
      flushSync(() => setProjectIndex(nextIndex));
      const definitiveTiles = Array.from(collage.querySelectorAll<HTMLElement>(":scope > .home-atlas__tile"))
        .filter((element) => element.offsetWidth > 0 && element.offsetHeight > 0);
      const definitiveTraveler = definitiveTiles.find((element) => element.dataset.atlasKey === travelerKey);
      const newPiece = definitiveTiles.find((element) => element.dataset.atlasKey !== travelerKey);
      gsap.set(definitiveTraveler ?? [], { visibility: "hidden" });
      gsap.set(outgoing, { clearProps: "transform,opacity" });
      const finalRect = definitiveTraveler?.getBoundingClientRect() ?? to;
      const finalX = finalRect.left - from.left;
      const finalY = finalRect.top - from.top;
      const travelerRect = traveler.getBoundingClientRect();
      const needsCorrection = Math.max(
        Math.abs(travelerRect.left - finalRect.left),
        Math.abs(travelerRect.top - finalRect.top),
        Math.abs(travelerRect.width - finalRect.width),
        Math.abs(travelerRect.height - finalRect.height),
      ) > .75;
      const finishHandoff = () => {
        traveler.remove();
        gsap.set(definitiveTraveler ?? [], { clearProps: "visibility" });
        isAnimatingRef.current = false;
      };
      if (!needsCorrection) {
        finishHandoff();
      } else gsap.to(traveler, {
        x: finalX,
        y: finalY,
        width: finalRect.width,
        height: finalRect.height,
        duration: .08,
        ease: "power2.out",
        overwrite: true,
        onComplete: finishHandoff,
      });
      if (newPiece) {
        gsap.set(newPiece, { animation: "none" });
        gsap.fromTo(newPiece, { y: direction > 0 ? 24 : -20, scale: .96, opacity: 0 }, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: .32,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      }
      animateMobileCounter(direction);
    }, [], remaining);
  };

  const animateProjectChange = (direction: -1 | 1) => {
    if (!hasOverflowProjects || isAnimatingRef.current) return;
    const nextIndex = (projectIndex + direction + projectCount) % projectCount;

    if (prefersReducedMotion()) {
      setProjectIndex(nextIndex);
      return;
    }

    if (!isDesktop()) {
      animateMobileProjectChange(direction, nextIndex);
      return;
    }

    const collage = collageRef.current;
    if (!collage) return;
    isAnimatingRef.current = true;

    const collageRect = collage.getBoundingClientRect();
    const previousTiles = Array.from(collage.querySelectorAll<HTMLElement>(".home-atlas__tile"));
    const previousRects = new Map(previousTiles.map((element) => [element.dataset.atlasKey ?? "", element.getBoundingClientRect()]));
    const outgoingSource = direction > 0 ? previousTiles[0] : previousTiles[2];
    const outgoingRect = outgoingSource?.getBoundingClientRect();
    const outgoing = outgoingSource?.cloneNode(true) as HTMLElement | undefined;

    if (outgoing && outgoingRect) {
      outgoing.classList.add("home-atlas__tile-clone");
      outgoing.setAttribute("aria-hidden", "true");
      Object.assign(outgoing.style, {
        left: `${outgoingRect.left - collageRect.left}px`,
        top: `${outgoingRect.top - collageRect.top}px`,
        width: `${outgoingRect.width}px`,
        height: `${outgoingRect.height}px`,
      });
      collage.appendChild(outgoing);
    }

    flushSync(() => setProjectIndex(nextIndex));

    const nextTiles = Array.from(collage.querySelectorAll<HTMLElement>(".home-atlas__tile:not(.home-atlas__tile-clone)"));
    const entering = nextTiles.filter((element) => !previousRects.has(element.dataset.atlasKey ?? ""));
    const moving = nextTiles.filter((element) => previousRects.has(element.dataset.atlasKey ?? ""));
    const navigationButtons = collage.parentElement?.querySelectorAll(".home-atlas__project-nav button");
    const timeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        outgoing?.remove();
        gsap.set(nextTiles, { clearProps: "transform,zIndex,willChange,clipPath,opacity" });
        isAnimatingRef.current = false;
      },
    });

    moving.forEach((element, index) => {
      const first = previousRects.get(element.dataset.atlasKey ?? "");
      const last = element.getBoundingClientRect();
      if (!first) return;
      gsap.set(element, {
        x: first.left - last.left,
        y: first.top - last.top,
        scaleX: first.width / last.width,
        scaleY: first.height / last.height,
        transformOrigin: "0 0",
        zIndex: 6 - index,
        willChange: "transform",
      });
      timeline.to(element, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1.02, ease: "expo.inOut" }, index * .07);
      const image = element.querySelector("img");
      if (image) timeline.fromTo(image, { scale: 1.045, xPercent: direction * 1.2 }, { scale: 1, xPercent: 0, duration: .92, ease: "power4.out" }, .08 + index * .06);
      const meta = element.querySelector(".home-atlas__tile-meta");
      if (meta) timeline.fromTo(meta, { y: direction > 0 ? 22 : -22, clipPath: "inset(0 0 100% 0)" }, { y: 0, clipPath: "inset(0% 0 0% 0)", duration: .55, ease: "power4.out" }, .43 + index * .05);
    });

    if (outgoing) {
      timeline.to(outgoing, { xPercent: direction > 0 ? -24 : 24, scale: .97, opacity: 0, duration: .76, ease: "power4.inOut" }, 0);
      const outgoingImage = outgoing.querySelector("img");
      if (outgoingImage) timeline.to(outgoingImage, { xPercent: direction > 0 ? 2 : -2, duration: .7, ease: "power3.inOut" }, 0);
    }

    timeline.fromTo(entering, {
      x: direction > 0 ? 24 : -24,
      y: direction > 0 ? 34 : -18,
      scale: .985,
      opacity: .9,
    }, { x: 0, y: 0, scale: 1, opacity: 1, duration: .82, ease: "power4.out" }, .08);

    const enteringMetadata = entering.map((element) => element.querySelector(".home-atlas__tile-meta")).filter(Boolean);
    timeline.fromTo(enteringMetadata, { y: direction > 0 ? 18 : -18, clipPath: "inset(0 0 100% 0)" }, { y: 0, clipPath: "inset(0% 0 0% 0)", duration: .48, stagger: .04, ease: "power4.out" }, .4);
    if (navigationButtons?.length) {
      timeline.to(navigationButtons, { x: direction * 3, opacity: .46, duration: .18, ease: "power3.out" }, 0)
        .to(navigationButtons, { x: 0, opacity: 1, duration: .34, ease: "power4.out" }, .65);
    }

    animateCounter(direction);
  };

  const showCategory = (categoryId: CategoryId) => {
    if (categoryId === displayedCategoryId || isAnimatingRef.current) return;
    if (prefersReducedMotion()) {
      setDisplayedCategoryId(categoryId);
      setProjectIndex(0);
      return;
    }

    const collage = collageRef.current;
    const overlay = categoryOverlayRef.current;
    const categoriesElement = categoriesRef.current;
    const line = activeLineRef.current;
    const targetButton = categoriesElement?.querySelector<HTMLElement>(`button[data-category-id="${categoryId}"]`);
    if (!collage || !overlay) return;
    isAnimatingRef.current = true;

    const currentCategoryIndex = atlasCategories.findIndex((category) => category.id === displayedCategoryId);
    const nextCategoryIndex = atlasCategories.findIndex((category) => category.id === categoryId);
    const direction = nextCategoryIndex > currentCategoryIndex ? 1 : -1;

    if (!isDesktop()) {
      const oldTiles = Array.from(collage.querySelectorAll<HTMLElement>(":scope > .home-atlas__tile"));
      overlay.replaceChildren(...oldTiles.map((tile) => {
        const clone = tile.cloneNode(true) as HTMLElement;
        clone.removeAttribute("href");
        clone.removeAttribute("aria-label");
        clone.setAttribute("aria-hidden", "true");
        return clone;
      }));
      flushSync(() => {
        setDisplayedCategoryId(categoryId);
        setProjectIndex(0);
      });
      const freshTiles = Array.from(collage.querySelectorAll<HTMLElement>(":scope > .home-atlas__tile"));
      const oldVisuals = Array.from(overlay.querySelectorAll<HTMLElement>(".home-atlas__tile"));
      gsap.set([...freshTiles, ...oldVisuals], { animation: "none" });
      gsap.set(overlay, { y: 0, opacity: 1, clipPath: "inset(0% 0 0% 0)", willChange: "transform,opacity" });
      const timeline = gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => {
          overlay.replaceChildren();
          gsap.set(overlay, { clearProps: "transform,clipPath,opacity,willChange" });
          gsap.set(freshTiles, { clearProps: "transform,opacity,willChange" });
          isAnimatingRef.current = false;
        },
      });
      if (line && targetButton) {
        timeline.to(line, { y: targetButton.offsetTop + targetButton.offsetHeight - 1, duration: .46, ease: "power3.inOut" }, 0);
      }
      timeline.to(overlay, {
        y: direction > 0 ? -46 : 46,
        opacity: 0,
        force3D: true,
        duration: .4,
        ease: "power3.inOut",
      }, 0).fromTo(freshTiles, {
        y: direction > 0 ? 46 : -46,
        opacity: 0,
        force3D: true,
        willChange: "transform,opacity",
      }, {
        y: 0,
        opacity: 1,
        force3D: true,
        duration: .48,
        ease: "power3.out",
      }, .035);
      animateMobileCounter(direction);
      return;
    }

    const oldTiles = Array.from(collage.querySelectorAll<HTMLElement>(".home-atlas__tile:not(.home-atlas__tile-clone)"));
    overlay.replaceChildren(...oldTiles.map((tile) => {
      const clone = tile.cloneNode(true) as HTMLElement;
      clone.removeAttribute("href");
      clone.removeAttribute("aria-label");
      clone.setAttribute("aria-hidden", "true");
      return clone;
    }));

    flushSync(() => {
      setDisplayedCategoryId(categoryId);
      setProjectIndex(0);
    });

    const freshTiles = Array.from(collage.querySelectorAll<HTMLElement>(":scope > .home-atlas__tile"));
    const oldVisuals = Array.from(overlay.querySelectorAll<HTMLElement>(".home-atlas__tile"));
    const lineTravel = line && targetButton
      ? Math.max(1, (collage.getBoundingClientRect().left - targetButton.getBoundingClientRect().left) / Math.max(targetButton.offsetWidth, 1))
      : 1;

    if (line && targetButton) {
      gsap.set(line, { transformOrigin: "left center" });
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        overlay.replaceChildren();
        gsap.set(freshTiles, { clearProps: "transform,clipPath,opacity,willChange" });
        if (line) gsap.set(line, { scaleX: 1, clearProps: "willChange" });
        isAnimatingRef.current = false;
      },
    });

    if (line && targetButton) {
      timeline.to(line, {
        y: targetButton.offsetTop + targetButton.offsetHeight - 1,
        scaleX: lineTravel,
        duration: .3,
        ease: "power4.inOut",
        willChange: "transform",
      }, 0).to(line, { scaleX: 1, duration: .28, ease: "power4.out" }, .3);
    }

    timeline.to(oldVisuals, {
      x: direction * -32,
      clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
      opacity: .92,
      duration: .44,
      stagger: .065,
      ease: "power4.inOut",
    }, .04).fromTo(freshTiles, {
      x: direction * 32,
      clipPath: direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      opacity: .92,
      willChange: "transform,clip-path",
    }, {
      x: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      opacity: 1,
      duration: .54,
      stagger: .065,
      ease: "power4.out",
    }, .07);

    const freshMetadata = freshTiles.map((tile) => tile.querySelector(".home-atlas__tile-meta")).filter(Boolean);
    timeline.fromTo(freshMetadata, { y: direction * 16, clipPath: "inset(0 0 100% 0)" }, {
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: .42,
      stagger: .045,
      ease: "power4.out",
    }, .2);

    animateCounter(direction);
  };

  const selectCategory = (categoryId: CategoryId) => {
    setSelectedCategoryId(categoryId);
    showCategory(categoryId);
  };

  const restoreSelectedCategory = () => {
    if (displayedCategoryId !== selectedCategoryId) showCategory(selectedCategoryId);
  };

  const cancelMobileDrag = (drag: MobileDrag) => {
    if (drag.raf !== null) cancelAnimationFrame(drag.raf);
    if (!drag.pieces) return;
    const { traveler, travelerSource, outgoing } = drag.pieces;
    gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        traveler.remove();
        gsap.set(travelerSource, { clearProps: "visibility" });
        gsap.set(outgoing, { clearProps: "transform,opacity" });
      },
    }).to(traveler, {
      x: 0,
      y: 0,
      width: drag.pieces.from.width,
      height: drag.pieces.from.height,
      duration: .32,
      ease: "power3.out",
    }, 0).to(outgoing, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: .32,
      ease: "power3.out",
    }, 0);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDesktop() || prefersReducedMotion() || isAnimatingRef.current || !hasOverflowProjects || !event.isPrimary) return;
    const secondaryTarget = (event.target as HTMLElement).closest<HTMLElement>(".home-atlas__tile--2");
    if (!secondaryTarget) return;
    const visibleTiles = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(":scope > .home-atlas__tile"))
      .filter((element) => element.offsetWidth > 0 && element.offsetHeight > 0);
    const primary = visibleTiles[0];
    const secondary = visibleTiles[1];
    if (!primary || !secondary) return;
    const now = event.timeStamp;
    mobileDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: now,
      velocity: 0,
      axis: null,
      direction: null,
      progress: 0,
      raf: null,
      primary,
      secondary,
      pieces: null,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = mobileDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || isAnimatingRef.current) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.axis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 10) {
      drag.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      if (drag.axis === "x") {
        drag.direction = deltaX < 0 ? 1 : -1;
        drag.pieces = prepareMobileTransition(drag.direction, drag.primary, drag.secondary);
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    if (drag.axis !== "x" || !drag.direction || !drag.pieces) return;
    event.preventDefault();
    const now = event.timeStamp;
    const elapsed = Math.max(1, now - drag.lastTime);
    drag.velocity = Math.abs(event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    const collageWidth = event.currentTarget.clientWidth;
    drag.progress = Math.min(1, Math.abs(deltaX) / Math.max(128, collageWidth * .4));
    drag.pieces.progress = drag.progress;
    if (drag.raf !== null) cancelAnimationFrame(drag.raf);
    drag.raf = requestAnimationFrame(() => {
      const { traveler, outgoing, from, to } = drag.pieces!;
      const progress = drag.progress;
      gsap.set(traveler, {
        x: (to.left - from.left) * progress,
        y: (to.top - from.top) * progress,
        width: from.width + (to.width - from.width) * progress,
        height: from.height + (to.height - from.height) * progress,
        transformOrigin: "0 0",
      });
      gsap.set(outgoing, {
        x: (drag.direction! > 0 ? -Math.max(54, collageWidth * .2) : Math.max(34, collageWidth * .1)) * progress,
        y: (drag.direction! > 0 ? -16 : 10) * progress,
        scale: 1 - .05 * progress,
        opacity: 1 - .08 * progress,
      });
    });
  };

  const finishPointerDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = mobileDragRef.current;
    mobileDragRef.current = null;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.raf !== null) cancelAnimationFrame(drag.raf);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (cancelled || drag.axis !== "x" || !drag.direction || !drag.pieces) {
      cancelMobileDrag(drag);
      return;
    }
    const shouldComplete = drag.progress >= .4 || (drag.progress >= .18 && drag.velocity >= .55);
    if (!shouldComplete) {
      cancelMobileDrag(drag);
      return;
    }
    const nextIndex = (projectIndex + drag.direction + projectCount) % projectCount;
    animateMobileProjectChange(drag.direction, nextIndex, drag.pieces);
  };

  return (
    <section id="atlas" className="home-atlas" aria-labelledby="atlas-title">
      <header className="home-atlas__header">
        <p id="atlas-title" className="eyebrow">03 — Atlas vivo</p>
      </header>
      <div className="home-atlas__body">
        <nav
          ref={categoriesRef}
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
                data-category-id={category.id}
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
          <span ref={activeLineRef} className="home-atlas__active-line" aria-hidden="true" />
        </nav>

        <div className="home-atlas__viewer" aria-live="polite">
          <div
            ref={collageRef}
            className="home-atlas__collage"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
            onPointerCancel={(event) => finishPointerDrag(event, true)}
          >
            {tiles.map((tile, index) => {
              const className = `home-atlas__tile home-atlas__tile--${index + 1}${tile.crop ? ` is-crop-${tile.crop}` : ""}${tile.project.detailPublished ? " is-linked" : ""}`;
              const content = (
                <>
                <Image
                  className="home-atlas__project-image"
                  src={tile.image.src}
                  alt={tile.image.alt}
                  draggable={false}
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
                <Link className={className} href={`/proyectos/${tile.project.slug}`} key={tileKey(tile)} data-atlas-key={tileKey(tile)} aria-label={`Ver proyecto ${tile.project.title}`}>
                  {content}
                </Link>
              ) : (
                <figure className={className} key={tileKey(tile)} data-atlas-key={tileKey(tile)}>
                  {content}
                </figure>
              );
            })}
            <div ref={categoryOverlayRef} className="home-atlas__category-overlay" aria-hidden="true" />
          </div>
          {tiles.length > 0 && (
            <div className={`home-atlas__project-nav${hasOverflowProjects ? "" : " is-single"}`}>
              <span ref={counterRef} className="home-atlas__counter"><span className="home-atlas__counter-current" key={projectIndex}>{String(projectIndex + 1).padStart(2, "0")}</span><span> / {String(projectCount).padStart(2, "0")}</span></span>
              <div>
                <button type="button" onClick={() => animateProjectChange(-1)} disabled={!hasOverflowProjects} aria-label="Proyecto anterior">←</button>
                <button type="button" onClick={() => animateProjectChange(1)} disabled={!hasOverflowProjects} aria-label="Proyecto siguiente">→</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Link className="home-atlas__link" href="#obras">Ver todas las obras →</Link>
    </section>
  );
}
