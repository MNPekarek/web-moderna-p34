import type { Project } from "@/content/types";

export const oficinasRibera: Project = {
  id: "oficinas-ribera", slug: "oficinas-ribera", code: "P34—04", title: "Oficinas Ribera", categoryId: "trabajo",
  summary: "Espacio de trabajo técnico, oscuro y orientado hacia la ciudad.", concept: [],
  metadata: { location: "Buenos Aires", year: 2028, status: "concepto", program: "Espacio de trabajo", coordinates: { label: "34°32′ S" } },
  images: [{ id: "oficinas-ribera-cover", src: "/images/p34/trabajo.png", alt: "Estudio de arquitectura oscuro con vistas a la ciudad", width: 1670, height: 942, role: "hero", tags: ["trabajo", "tecnico", "ciudad", "interior"] }],
  materialTags: ["piedra", "madera", "metal", "vidrio"], composition: "oficinas", published: true,
};
