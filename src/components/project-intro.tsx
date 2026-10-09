"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionPreference } from "@/hooks/use-motion-preference";

export function ProjectIntro({ projectCode }: { projectCode: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMotionPreference();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .set(root, { autoAlpha: 1 })
        .fromTo(".project-intro__mark", { yPercent: 120 }, { yPercent: 0, duration: .55 })
        .fromTo(".project-intro__label", { yPercent: 125, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .48 }, "-=.32")
        .fromTo(".project-intro__line", { scaleX: 0 }, { scaleX: 1, duration: .62, transformOrigin: "left" }, "-=.3")
        .to(root, { clipPath: "inset(0 0 100% 0)", duration: .72, ease: "power4.inOut" }, "+=.08");
    }, root);

    return () => context.revert();
  }, [projectCode, reducedMotion]);

  return (
    <div ref={rootRef} className="home-intro project-intro" aria-hidden="true">
      <div className="project-intro__identity">
        <span><b className="home-intro__mark project-intro__mark">P—34</b></span>
        <span className="project-intro__label-mask"><small className="project-intro__label">Proyecto</small></span>
      </div>
      <i className="home-intro__line project-intro__line" />
    </div>
  );
}
