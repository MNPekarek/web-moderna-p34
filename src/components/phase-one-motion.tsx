"use client";

import { useEffect } from "react";
import { useMotionPreference } from "@/hooks/use-motion-preference";

function canUseSmoothScroll() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PhaseOneMotion() {
  const reducedMotion = useMotionPreference();

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.dataset.motion = "reduced";
      return;
    }

    document.documentElement.dataset.motion = "full";
    let cancelled = false;
    let cleanup = () => {};

    const setup = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      let observer: MutationObserver | null = null;
      let revertMedia = () => {};
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .set(".home-intro", { autoAlpha: 1 })
          .fromTo(".home-intro__mark", { yPercent: 120 }, { yPercent: 0, duration: .55 })
          .fromTo(".home-intro__line", { scaleX: 0 }, { scaleX: 1, duration: .62, transformOrigin: "left" }, "-=.28")
          .to(".home-intro", { clipPath: "inset(0 0 100% 0)", duration: .72, ease: "power4.inOut" }, "+=.08")
          .fromTo(".home-hero__image", { scale: 1.045, clipPath: "inset(7% 0 0 0)" }, { scale: 1, clipPath: "inset(0% 0 0 0)", duration: 1.05 }, "-=.62")
          .fromTo(".site-header", { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: .55 }, "-=.75")
          .fromTo(".home-hero h1 span, .home-hero h1 em", { yPercent: 105, clipPath: "inset(0 0 100% 0)" }, { yPercent: 0, clipPath: "inset(0% 0 0% 0)", duration: .88, stagger: .1 }, "-=.58")
          .fromTo(".home-hero__edition", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }, "-=.48")
          .fromTo(".home-hero__scroll", { opacity: 0 }, { opacity: 1, duration: .45 }, "-=.28")
          .fromTo(".home-hero__scroll i", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: .48 }, "-=.35");

        const mm = gsap.matchMedia();
        revertMedia = () => mm.revert();
        mm.add("(min-width: 761px)", () => {
          const heroScroll = { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: .8 };
          gsap.to(".home-hero__image", { scale: 1.04, yPercent: 2.5, ease: "none", scrollTrigger: heroScroll });
          gsap.to(".home-hero h1", { yPercent: -6, ease: "none", scrollTrigger: heroScroll });
          gsap.to(".home-hero__edition", { yPercent: -3, ease: "none", scrollTrigger: heroScroll });

          gsap.utils.toArray<HTMLElement>(".selected-work").forEach((work, index) => {
            const figure = work.querySelector("figure");
            const image = work.querySelector("img");
            if (!figure || !image) return;
            gsap.fromTo(figure, { clipPath: index % 2 ? "inset(0 0 16% 0)" : "inset(12% 0 0 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: .95, ease: "power4.out", scrollTrigger: { trigger: work, start: "top 86%", once: true } });
            gsap.fromTo(image, { scale: 1.055 }, { scale: 1, duration: 1.15, ease: "power3.out", scrollTrigger: { trigger: work, start: "top 86%", once: true } });
            gsap.to(image, { yPercent: 3.5, ease: "none", scrollTrigger: { trigger: work, start: "top bottom", end: "bottom top", scrub: 1 } });
          });

          gsap.fromTo("[data-territory-image-shell]", { clipPath: "inset(12% 0 0 0)", scale: 1.05 }, { clipPath: "inset(0% 0 0% 0)", scale: 1, duration: 1.05, ease: "power4.out", scrollTrigger: { trigger: ".territory-media", start: "top 84%", once: true } });
          gsap.fromTo(".territory-number", { opacity: 0, xPercent: 5 }, { opacity: .78, xPercent: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".territory-principles", start: "top 82%", once: true } });
          gsap.fromTo(".home-atlas", { clipPath: "inset(10% 0 0 0)" }, { clipPath: "inset(0% 0 0% 0)", ease: "none", scrollTrigger: { trigger: ".home-atlas", start: "top bottom", end: "top 72%", scrub: .7 } });
          gsap.fromTo(".development", { clipPath: "inset(9% 0 0 0)" }, { clipPath: "inset(0% 0 0% 0)", ease: "none", scrollTrigger: { trigger: ".development", start: "top bottom", end: "top 74%", scrub: .7 } });
          gsap.fromTo(".home-closing", { clipPath: "inset(10% 0 0 0)" }, { clipPath: "inset(0% 0 0% 0)", ease: "none", scrollTrigger: { trigger: ".home-closing", start: "top bottom", end: "top 72%", scrub: .7 } });
        });
        mm.add("(max-width: 760px)", () => {
          gsap.utils.toArray<HTMLElement>(".selected-work figure").forEach((figure) => {
            gsap.fromTo(figure, { clipPath: "inset(8% 0 0 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: .72, ease: "power3.out", scrollTrigger: { trigger: figure, start: "top 90%", once: true } });
          });
          gsap.fromTo("[data-territory-image-shell]", { clipPath: "inset(8% 0 0 0)", scale: 1.015 }, { clipPath: "inset(0% 0 0% 0)", scale: 1, duration: .78, ease: "power3.out", scrollTrigger: { trigger: ".territory-media", start: "top 90%", once: true } });
        });

        const reveal = (trigger: string, targets: string, start = "top 84%") => {
          gsap.fromTo(targets, { yPercent: 22, clipPath: "inset(0 0 100% 0)" }, { yPercent: 0, clipPath: "inset(0% 0 0% 0)", duration: .9, stagger: .08, ease: "power4.out", scrollTrigger: { trigger, start, once: true } });
        };
        const label = (trigger: string, target: string) => gsap.fromTo(target, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power3.out", scrollTrigger: { trigger, start: "top 84%", once: true } });

        label(".selected-works", ".selected-works__header .eyebrow");
        reveal(".selected-works", ".selected-works__header h2");
        label(".territory-scene", ".territory-copy .eyebrow");
        reveal(".territory-scene", ".territory-copy blockquote");
        gsap.fromTo(".territory-note", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: "power3.out", scrollTrigger: { trigger: ".territory-copy", start: "top 74%", once: true } });
        gsap.fromTo(".territory-principles li", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".territory-principles", start: "top 84%", once: true } });

        label(".home-atlas", ".home-atlas__header");
        gsap.fromTo(".home-atlas__categories button", { yPercent: 35, clipPath: "inset(0 0 100% 0)" }, { yPercent: 0, clipPath: "inset(0% 0 0% 0)", duration: .65, stagger: .07, ease: "power4.out", scrollTrigger: { trigger: ".home-atlas__categories", start: "top 84%", once: true } });
        gsap.fromTo(".home-atlas__tile", { clipPath: "inset(10% 0 0 0)", scale: 1.025 }, { clipPath: "inset(0% 0 0% 0)", scale: 1, duration: .85, stagger: .11, ease: "power4.out", scrollTrigger: { trigger: ".home-atlas__viewer", start: "top 86%", once: true } });

        label(".development", ".development .eyebrow");
        reveal(".development", ".development h2");
        gsap.utils.toArray<HTMLElement>(".development li").forEach((row) => {
          gsap.fromTo(row, { opacity: .32 }, { opacity: 1, duration: .55, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 67%", end: "bottom 42%", toggleActions: "play reverse play reverse" } });
          gsap.fromTo(row.querySelector("i"), { scaleX: .15, transformOrigin: "left" }, { scaleX: 1, duration: .65, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 68%", toggleActions: "play none none reverse" } });
        });

        label(".home-closing", ".home-closing > .eyebrow");
        reveal(".home-closing", ".home-closing h2");
        gsap.fromTo(".home-closing__meta > div", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".home-closing__meta", start: "top 86%", once: true } });
        gsap.fromTo(".contact-trigger", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: "power3.out", scrollTrigger: { trigger: ".contact-trigger", start: "top 92%", once: true } });
        gsap.fromTo(".site-footer__top > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .07, ease: "power3.out", scrollTrigger: { trigger: ".site-footer--editorial", start: "top 88%", once: true } });
        gsap.fromTo(".site-footer__signature", { xPercent: -4, clipPath: "inset(0 100% 0 0)", letterSpacing: "-.11em" }, { xPercent: 0, clipPath: "inset(0 0% 0 0)", letterSpacing: "-.075em", duration: .95, ease: "power4.out", scrollTrigger: { trigger: ".site-footer__signature", start: "top 90%", once: true } });

        const panel = document.querySelector(".contact-panel");
        if (panel) {
          observer = new MutationObserver(() => {
            if (!panel.classList.contains("is-open")) return;
            gsap.fromTo(".contact-form > *", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .06, ease: "power3.out", overwrite: true });
          });
          observer.observe(panel, { attributes: true, attributeFilter: ["class"] });
        }
      });

      let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
      let rafId = 0;
      if (canUseSmoothScroll()) {
        const { default: Lenis } = await import("lenis");
        lenis = new Lenis({ duration: 1.02, smoothWheel: true, syncTouch: false, wheelMultiplier: .9 });
        const raf = (time: number) => { lenis?.raf(time); rafId = requestAnimationFrame(raf); };
        rafId = requestAnimationFrame(raf);
      }

      cleanup = () => {
        observer?.disconnect();
        revertMedia();
        context.revert();
        if (rafId) cancelAnimationFrame(rafId);
        lenis?.destroy();
      };
    };

    void setup();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reducedMotion]);

  return <div className="home-intro" aria-hidden="true"><span><b className="home-intro__mark">P—34</b></span><i className="home-intro__line" /></div>;
}
