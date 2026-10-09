import type { Category } from "@/content/types";

export const categories: Category[] = [
  { id: "habitar", label: "Habitar", description: "Arquitectura doméstica y territorio.", theme: "dark", order: 1 },
  { id: "conjuntos", label: "Conjuntos", description: "Vivienda colectiva y trama urbana.", theme: "light", order: 2 },
  { id: "interiores", label: "Interiores", description: "Materia, escala y atmósfera interior.", theme: "warm", order: 3 },
  { id: "trabajo", label: "Trabajo", description: "Espacios de precisión y cultura de trabajo.", theme: "technical", order: 4 },
];
