"use client";

import { useEffect } from "react";

export function ProjectTouchInteractions() {
  useEffect(() => {
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    const list = document.querySelector<HTMLElement>(".gallery-material ul");
    if (!list) return;
    const clear = () => {
      list.querySelectorAll("li").forEach((item) => item.removeAttribute("data-touch-active"));
      list.removeAttribute("data-has-touch-active");
    };
    const activate = (event: PointerEvent) => {
      const item = (event.target as Element).closest<HTMLElement>(".gallery-material li");
      if (!item || !list.contains(item)) return;
      clear();
      item.setAttribute("data-touch-active", "true");
      list.setAttribute("data-has-touch-active", "true");
    };
    const clearOutside = (event: PointerEvent) => { if (!list.contains(event.target as Node)) clear(); };
    list.addEventListener("pointerdown", activate);
    document.addEventListener("pointerdown", clearOutside);
    return () => {
      list.removeEventListener("pointerdown", activate);
      document.removeEventListener("pointerdown", clearOutside);
    };
  }, []);
  return null;
}
