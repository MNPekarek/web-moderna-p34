"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import type { ProjectImage } from "@/content/types";

type Props = { code: string; title: string; images: ProjectImage[] };

export function ProjectLightbox({ code, title, images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [swipeOffset, setSwipeOffset] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; panX: number; panY: number; touch: boolean } | null>(null);
  const reducedMotion = useMotionPreference();

  const close = useCallback(() => {
    setActiveIndex(null);
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    setSwipeOffset(0);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  const move = useCallback((direction: number) => {
    setActiveIndex((current) => current === null ? null : (current + direction + images.length) % images.length);
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    setSwipeOffset(0);
  }, [images.length]);

  useEffect(() => {
    const openFromTrigger = (event: MouseEvent) => {
      const trigger = (event.target as Element).closest<HTMLElement>("[data-lightbox-image]");
      if (!trigger) return;
      const index = images.findIndex((image) => image.id === trigger.dataset.lightboxImage);
      if (index < 0) return;
      openerRef.current = trigger;
      setActiveIndex(index);
    };
    document.addEventListener("click", openFromTrigger);
    return () => document.removeEventListener("click", openFromTrigger);
  }, [images]);

  useEffect(() => {
    const updateCursor = (event: PointerEvent) => {
      const trigger = (event.target as Element).closest<HTMLElement>(".project-photo-trigger");
      if (!trigger) return;
      const lens = trigger.querySelector<HTMLElement>(".project-photo-cursor");
      const image = trigger.querySelector<HTMLImageElement>("img");
      if (!lens || !image) return;
      const bounds = trigger.getBoundingClientRect();
      const zoom = 2.1;
      const radius = lens.offsetWidth / 2;
      const pointerX = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
      const pointerY = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
      const lensX = Math.max(radius, Math.min(bounds.width - radius, pointerX));
      const lensY = Math.max(radius, Math.min(bounds.height - radius, pointerY));
      const sampleX = Math.max(radius / zoom, Math.min(bounds.width - radius / zoom, pointerX));
      const sampleY = Math.max(radius / zoom, Math.min(bounds.height - radius / zoom, pointerY));
      const naturalRatio = image.naturalWidth / image.naturalHeight;
      const boxRatio = bounds.width / bounds.height;
      const usesCover = getComputedStyle(image).objectFit === "cover";
      const renderedWidth = usesCover && naturalRatio < boxRatio ? bounds.width : usesCover ? bounds.height * naturalRatio : bounds.width;
      const renderedHeight = usesCover && naturalRatio < boxRatio ? bounds.width / naturalRatio : usesCover ? bounds.height : bounds.height;
      const cropX = Math.max(0, (renderedWidth - bounds.width) / 2);
      const cropY = Math.max(0, (renderedHeight - bounds.height) / 2);
      trigger.style.setProperty("--photo-pointer-x", `${lensX}px`);
      trigger.style.setProperty("--photo-pointer-y", `${lensY}px`);
      trigger.style.setProperty("--photo-bg-width", `${renderedWidth * zoom}px`);
      trigger.style.setProperty("--photo-bg-height", `${renderedHeight * zoom}px`);
      trigger.style.setProperty("--photo-bg-x", `${radius - (sampleX + cropX) * zoom}px`);
      trigger.style.setProperty("--photo-bg-y", `${radius - (sampleY + cropY) * zoom}px`);
    };
    document.addEventListener("pointermove", updateCursor, { passive: true });
    return () => document.removeEventListener("pointermove", updateCursor);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const scrollY = window.scrollY;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, [activeIndex, close, move]);

  if (activeIndex === null) return null;
  const image = images[activeIndex];
  const count = String(images.length).padStart(2, "0");
  const current = String(activeIndex + 1).padStart(2, "0");

  const onPointerDown = (event: React.PointerEvent) => {
    pointerRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y, touch: event.pointerType === "touch" };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointerRef.current) return;
    if (zoomed) {
      setPan({
        x: Math.max(-window.innerWidth * 0.2, Math.min(window.innerWidth * 0.2, pointerRef.current.panX + event.clientX - pointerRef.current.x)),
        y: Math.max(-window.innerHeight * 0.16, Math.min(window.innerHeight * 0.16, pointerRef.current.panY + event.clientY - pointerRef.current.y)),
      });
    } else if (pointerRef.current.touch) {
      setSwipeOffset(Math.max(-90, Math.min(90, event.clientX - pointerRef.current.x)));
    }
  };
  const onPointerUp = (event: React.PointerEvent) => {
    if (pointerRef.current && !zoomed) {
      const delta = event.clientX - pointerRef.current.x;
      if (Math.abs(delta) > 55) move(delta < 0 ? 1 : -1);
    }
    setSwipeOffset(0);
    pointerRef.current = null;
  };
  const onPointerCancel = () => {
    pointerRef.current = null;
    setSwipeOffset(0);
  };

  return (
    <div className={`project-lightbox ${reducedMotion ? "is-reduced" : ""}`} role="dialog" aria-modal="true" aria-label={`Visor fotográfico de ${title}`} ref={dialogRef} tabIndex={-1}>
      <header className="project-lightbox__header">
        <p>{code}</p><p>{title}</p><button type="button" onClick={close} aria-label="Cerrar visor">Cerrar ×</button>
      </header>
      <div className={`project-lightbox__stage ${zoomed ? "is-zoomed" : ""} ${swipeOffset ? "is-swiping" : ""}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}>
        <div className="project-lightbox__image" style={{ transform: `translate3d(${pan.x + swipeOffset}px, ${pan.y}px, 0) scale(${zoomed ? 1.65 : 1})` }}>
          <Image src={image.src} alt={image.alt} fill sizes="100vw" quality={95} priority />
        </div>
      </div>
      <div className="project-lightbox__meta"><span>{image.caption ?? image.role}</span><span>{current} / {count}</span></div>
      <button className="project-lightbox__previous" type="button" onClick={() => move(-1)} aria-label="Imagen anterior">←</button>
      <button className="project-lightbox__next" type="button" onClick={() => move(1)} aria-label="Imagen siguiente">→</button>
      <button className="project-lightbox__zoom" type="button" onClick={() => { setZoomed((value) => !value); setPan({ x: 0, y: 0 }); }} aria-pressed={zoomed}>{zoomed ? "Reducir" : "Ampliar"} ⊕</button>
    </div>
  );
}
