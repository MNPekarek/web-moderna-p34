import type { Project } from "@/content/types";

export const patioSur: Project = {
  id: "patio-sur", slug: "patio-sur", code: "P34—02", title: "Patio Sur", categoryId: "conjuntos",
  summary: "Vivienda colectiva vinculada a la trama urbana y la vegetación.", concept: [],
  metadata: { location: "Buenos Aires", year: 2027, status: "concepto", program: "Vivienda colectiva", coordinates: { label: "34°36′ S" } },
  images: [{ id: "patio-sur-cover", src: "/images/p34/conjuntos-urbano.png", alt: "Conjunto residencial urbano entre árboles y terrazas", width: 1670, height: 941, role: "hero", tags: ["urbano", "balcones", "vegetacion", "conjunto"] }],
  materialTags: ["hormigon", "vidrio", "vegetacion"], composition: "patio", published: true,
};
