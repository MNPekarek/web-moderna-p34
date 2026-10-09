"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function Navigation() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const hero = document.querySelector<HTMLElement>(".home-hero");
    if (!header || !hero) return;

    let frame = 0;
    const updateContrast = () => {
      frame = 0;
      const isOverHero = hero.getBoundingClientRect().bottom > header.offsetHeight;
      header.classList.toggle("is-over-hero", isOverHero);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateContrast);
    };

    updateContrast();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header is-over-hero" data-site-header>
      <Link className="brand" href="/#umbral" aria-label="PARALELO 34, inicio">
        P<span aria-hidden="true">—</span>34
      </Link>
      <nav className="site-nav" aria-label="Navegación principal">
        <Link href="/#territorio">Territorio</Link>
        <Link href="/#obras">Obras</Link>
        <Link href="/#contacto">Contacto</Link>
      </nav>
      <p className="site-header__descriptor">Arquitectura y desarrollo</p>
    </header>
  );
}
