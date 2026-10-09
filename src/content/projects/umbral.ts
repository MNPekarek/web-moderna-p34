import type { Project } from "@/content/types";

export const umbral: Project = {
  id: "umbral", slug: "umbral", code: "P34—03", title: "Umbral", categoryId: "interiores",
  summary: "Interior residencial definido por piedra, madera y luz contenida.", concept: [],
  metadata: { location: "Buenos Aires", year: 2029, status: "concepto", program: "Interior residencial", coordinates: { label: "34°35′ S" } },
  images: [{ id: "umbral-cover", src: "/images/p34/interiores.png", alt: "Interior residencial de doble altura definido por piedra y luz", width: 1670, height: 941, role: "hero", tags: ["interior", "piedra", "madera", "luz"] }],
  materialTags: ["piedra", "madera", "metal"], composition: "umbral", published: true,
};
