"use client";

import { useLayoutEffect } from "react";
import { useMotionPreference } from "@/hooks/use-motion-preference";

export function ProjectMotion() {
  const reducedMotion = useMotionPreference();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    let disposed = false;
    let cleanup = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const root = document.querySelector<HTMLElement>("[data-project-page]");
      if (!root) return;
      const header = document.querySelector<HTMLElement>(".project-header");
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const imageEase = "expo.inOut";
      const textEase = "power3.out";

      const context = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: textEase } });
        intro
          .fromTo(".project-hero__image", { clipPath: "inset(0 0 100% 0)", scale: 1.04 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.55, ease: imageEase })
          .from(".project-hero__code", { opacity: 0, y: 10, duration: 0.65 }, "-=0.72")
          .from(".project-hero h1", { clipPath: "inset(100% 0 0 0)", yPercent: 16, duration: 1.05 }, "-=0.5")
          .from(".project-hero__meta > div", { opacity: 0, y: 12, duration: 0.72, stagger: 0.09 }, "-=0.58")
          .from(header, { opacity: 0, y: -8, duration: 0.7 }, "-=0.65")
          .from(".project-hero__scroll", { opacity: 0, duration: 0.7 }, "-=0.25");

        const opening = gsap.timeline({ scrollTrigger: { trigger: ".project-opening", start: "top 84%", once: true } });
        opening
          .from(".project-opening > .eyebrow", { opacity: 0, y: 8, duration: 0.62, ease: textEase })
          .from(".project-opening__lead", { clipPath: "inset(0 0 100% 0)", y: mobile ? 10 : 16, duration: mobile ? 0.98 : 1.18, ease: "expo.out" }, "-=0.28")
          .from(".project-opening .project-specs > div", { opacity: 0, y: mobile ? 6 : 9, duration: 0.68, stagger: mobile ? 0.06 : 0.1, ease: textEase }, "-=0.52")
          .from(".project-opening__concept > p", { opacity: 0, y: mobile ? 7 : 11, duration: 0.76, stagger: mobile ? 0.08 : 0.14, ease: textEase }, "-=0.3");

        const access = gsap.timeline({ scrollTrigger: { trigger: ".gallery-block--access", start: "top 90%", once: true } });
        access
          .from(".gallery-block--access img", { clipPath: "inset(0 100% 0 0)", scale: mobile ? 1.012 : 1.025, duration: mobile ? 1.02 : 1.42, ease: imageEase })
          .from(".gallery-block--access figcaption", { opacity: 0, x: 8, duration: 0.65, ease: textEase }, "-=0.34");

        gsap.utils.toArray<HTMLElement>(".gallery-block--arrival .gallery-editorial-row").forEach((row, index) => {
          const sequence = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
          sequence
            .from(row.querySelector("figure"), { clipPath: index === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)", duration: mobile ? 1 : 1.34, ease: imageEase })
            .from(row.querySelector("h2"), { clipPath: "inset(0 0 100% 0)", y: mobile ? 10 : 15, duration: mobile ? 0.86 : 1.02, ease: "expo.out" }, "-=0.64")
            .from(row.querySelector(".gallery-editorial-copy > p:last-child"), { opacity: 0, y: mobile ? 7 : 10, duration: 0.7, ease: textEase }, "-=0.28")
            .from(row.querySelector("figcaption"), { opacity: 0, x: index === 0 ? 7 : -7, duration: 0.58, ease: textEase }, "-=0.5");
        });

        const interiorFigures = gsap.utils.toArray<HTMLElement>(".gallery-block--interiors figure");
        if (interiorFigures.length) {
          const collage = gsap.timeline({ scrollTrigger: { trigger: ".gallery-block--interiors", start: "top 87%", once: true } });
          collage
            .from(interiorFigures[0], { clipPath: "inset(0 0 100% 0)", y: mobile ? 5 : 8, duration: mobile ? 0.98 : 1.28, ease: "expo.out" })
            .from(interiorFigures[1], { clipPath: "inset(100% 0 0 0)", y: mobile ? -7 : -13, duration: mobile ? 0.9 : 1.08, ease: "expo.out" }, "-=0.5")
            .from(".gallery-block--interiors figcaption", { opacity: 0, y: 6, duration: 0.62, stagger: 0.09, ease: textEase }, "-=0.28");
        }

        const material = gsap.timeline({ scrollTrigger: { trigger: ".gallery-material", start: "top 86%", once: true } });
        material
          .from(".gallery-material > .eyebrow", { opacity: 0, y: 7, duration: 0.68, ease: textEase })
          .from(".gallery-material__statement", { clipPath: "inset(0 0 100% 0)", y: mobile ? 9 : 15, duration: mobile ? 1 : 1.24, ease: "expo.out" }, "-=0.3")
          .from(".gallery-material li", { opacity: 0, y: mobile ? 5 : 8, duration: 0.62, stagger: mobile ? 0.055 : 0.085, ease: textEase }, "-=0.42");

        const materialImage = gsap.timeline({ scrollTrigger: { trigger: ".gallery-material figure", start: "top 90%", once: true } });
        materialImage
          .from(".gallery-material figure", { clipPath: "inset(12% 0 0 0)", duration: mobile ? 1.02 : 1.46, ease: imageEase })
          .from(".gallery-material figcaption", { opacity: 0, x: 7, duration: 0.64, ease: textEase }, "-=0.35");

        const river = gsap.timeline({ scrollTrigger: { trigger: ".gallery-block--river", start: "top 90%", once: true } });
        river
          .from(".gallery-block--river", { clipPath: "inset(0 0 100% 0)", duration: mobile ? 1.08 : 1.52, ease: imageEase })
          .from(".gallery-block--river figcaption", { opacity: 0, x: 8, duration: 0.68, ease: textEase }, "-=0.38");

        const finale = gsap.timeline({ scrollTrigger: { trigger: ".gallery-block--blue-hour", start: "top 90%", once: true } });
        finale
          .from(".gallery-block--blue-hour", { clipPath: "inset(8% 0 8% 0)", opacity: 0.72, duration: mobile ? 1.2 : 1.72, ease: imageEase })
          .fromTo(".gallery-block--blue-hour img", { scale: mobile ? 1.012 : 1.025 }, { scale: 1, duration: mobile ? 1.22 : 1.76, ease: "power2.out" }, "<")
          .from(".project-pagination", { opacity: 0.86, y: mobile ? 8 : 14, duration: 0.78, ease: textEase }, "-=0.22");
      }, root);

      cleanup = () => context.revert();
    });

    return () => { disposed = true; cleanup(); };
  }, [reducedMotion]);

  return null;
}
