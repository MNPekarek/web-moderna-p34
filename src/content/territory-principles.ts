import type { TerritoryPrinciple } from "@/content/types";

export const territoryPrinciples: TerritoryPrinciple[] = [
  { id: "lugar", index: "01", title: "Lugar", statement: "Topografía, contexto y preexistencias como punto de partida.", evidence: [{ projectId: "casa-litoral", imageId: "casa-litoral-ribera" }] },
  { id: "orientacion", index: "02", title: "Orientación", statement: "Luz, clima y recorrido solar organizan cada espacio.", evidence: [{ projectId: "casa-litoral", imageId: "casa-litoral-interior" }] },
  { id: "materia", index: "03", title: "Materia", statement: "Materiales elegidos por su presencia, permanencia y evolución.", evidence: [{ projectId: "umbral", imageId: "umbral-cover" }] },
  { id: "paisaje", index: "04", title: "Paisaje", statement: "Continuidad entre interior, arquitectura y territorio.", evidence: [{ projectId: "casa-litoral", imageId: "casa-litoral-patio" }] },
];
