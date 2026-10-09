"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function ProjectHeader({ code, title }: { code: string; title: string }) {
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-project-hero]");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0.08 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const gallery = document.querySelector("[data-project-gallery]");
    if (!gallery) return;
    const updateTheme = () => {
      const headerEdge = window.innerWidth <= 760 ? 66 : 56;
      const surfaces = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"));
      const activeSurface = surfaces.reverse().find((surface) => {
        const bounds = surface.getBoundingClientRect();
        return bounds.top <= headerEdge && bounds.bottom > headerEdge;
      });
      setDark(activeSurface?.dataset.headerTheme === "dark");
    };
    updateTheme();
    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);
    return () => {
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
    };
  }, []);

  return (
    <header className={`project-header ${compact ? "is-compact" : ""} ${dark ? "is-dark" : ""}`}>
      <Link className="brand" href="/" aria-label="PARALELO 34, inicio">P<span aria-hidden="true">—</span>34</Link>
      <div className="project-header__center">
        <nav className="project-header__global" aria-label="Navegación principal"><Link href="/#territorio">Territorio</Link><Link href="/#atlas">Obras</Link></nav>
        <p className="project-header__identity"><span className="project-header__code">{code} / </span>{title}</p>
      </div>
      <Link className="project-header__works" href="/#atlas">Obras</Link>
      <p className="project-header__descriptor">Arquitectura y desarrollo</p>
    </header>
  );
}
