import type { Project } from "@/content/types";

export const casaLitoral: Project = {
  id: "casa-litoral",
  slug: "casa-litoral",
  code: "P34—01",
  title: "Casa Litoral",
  categoryId: "habitar",
  summary: "Casa de ribera concebida como continuidad entre arquitectura, agua y paisaje.",
  concept: [
    "La vivienda se organiza a partir de la línea del agua y de una secuencia continua entre interior, galería y paisaje.",
    "La orientación, los planos de hormigón y la profundidad de los aleros regulan la luz mientras preservan la apertura hacia la ribera.",
  ],
  metadata: {
    location: "Tigre",
    year: 2028,
    status: "concepto",
    program: "Vivienda",
    coordinates: { label: "34°25′ S" },
  },
  images: [
    { id: "casa-litoral-hero", src: "/images/p34/casa-litoral-01-hero.png", alt: "Casa Litoral abierta hacia la ribera al atardecer", width: 1672, height: 941, role: "hero", tags: ["exterior", "agua", "atardecer", "hormigon"], priority: true },
    { id: "casa-litoral-interior", src: "/images/p34/casa-litoral-02-interior-terraza.png", alt: "Interior de Casa Litoral abierto hacia la terraza y el paisaje", width: 1671, height: 941, role: "interior", tags: ["interior", "orientacion", "luz", "continuidad"], caption: "Interior" },
    { id: "casa-litoral-patio", src: "/images/p34/casa-litoral-03-exterior-paisaje.png", alt: "Casa Litoral entre vegetación, agua y paisaje", width: 1670, height: 941, role: "exterior", tags: ["exterior", "vegetacion", "recorrido", "paisaje"], caption: "Exterior" },
    { id: "casa-litoral-ribera", src: "/images/p34/casa-litoral-04-ribera-muelle.png", alt: "Casa Litoral junto al agua, el muelle y la embarcación", width: 1670, height: 941, role: "landscape", tags: ["ribera", "agua", "paisaje", "muelle"], caption: "Ribera" },
    { id: "casa-litoral-detalle-fachada", src: "/images/p34/casa-litoral-05-detalle-fachada.png", alt: "Detalle de la fachada pétrea, carpinterías y vegetación de Casa Litoral", width: 1536, height: 1024, role: "detail", tags: ["fachada", "piedra", "vidrio", "vegetacion"], caption: "Detalle / fachada" },
    { id: "casa-litoral-acceso", src: "/images/p34/casa-litoral-06-acceso.png", alt: "Acceso de Casa Litoral entre planos de piedra y vegetación", width: 1670, height: 941, role: "exterior", tags: ["acceso", "piedra", "vegetacion", "recorrido"], caption: "Acceso" },
    { id: "casa-litoral-interior-general", src: "/images/p34/casa-litoral-07-interior-general.png", alt: "Vista general del interior de Casa Litoral abierto hacia el paisaje", width: 1670, height: 942, role: "interior", tags: ["interior", "living", "comedor", "paisaje"], caption: "Interior" },
    { id: "casa-litoral-dormitorio", src: "/images/p34/casa-litoral-08-dormitorio.png", alt: "Dormitorio de Casa Litoral abierto hacia el agua y el paisaje", width: 1670, height: 942, role: "interior", tags: ["interior", "dormitorio", "agua", "paisaje"], caption: "Dormitorio" },
    { id: "casa-litoral-materia-agua", src: "/images/p34/casa-litoral-09-materia-agua.png", alt: "Encuentro entre piedra, vidrio, madera, vegetación y agua en Casa Litoral", width: 1536, height: 1024, role: "material", tags: ["piedra", "vidrio", "madera", "agua"], caption: "Materia / agua" },
    { id: "casa-litoral-blue-hour", src: "/images/p34/casa-litoral-10-blue-hour.png", alt: "Casa Litoral iluminada frente al agua durante la hora azul", width: 1670, height: 942, role: "exterior", tags: ["exterior", "agua", "noche", "luz"], caption: "Blue hour" },
  ],
  materialTags: ["hormigon", "vidrio", "madera", "vegetacion", "agua"],
  relatedProjectIds: ["patio-sur"],
  galleryLayout: [
    { id: "access", type: "containedLandscape", imageId: "casa-litoral-acceso", align: "center" },
    {
      id: "arrival",
      type: "asymmetricPair",
      imageIds: ["casa-litoral-interior", "casa-litoral-patio"],
      variant: "lead-left",
      editorial: [
        {
          title: "Adentro y afuera dejan de ser opuestos.",
          body: "El interior se abre hacia la terraza, la pileta y el paisaje.",
        },
        {
          title: "El recorrido continúa en el paisaje.",
          body: "Arquitectura, agua y vegetación articulan los espacios exteriores.",
        },
      ],
    },
    { id: "interiors", type: "diptych", imageIds: ["casa-litoral-interior-general", "casa-litoral-dormitorio"], variant: "lead-left" },
    { id: "matter", type: "materialInterlude", title: "Materia", statement: "La materia registra el tiempo.", imageId: "casa-litoral-materia-agua", materials: ["hormigon", "vidrio", "madera", "vegetacion", "agua"] },
    { id: "river", type: "fullBleed", imageId: "casa-litoral-ribera", height: "cinematic" },
    { id: "blue-hour", type: "finalMonument", imageId: "casa-litoral-blue-hour" },
  ],
  composition: "litoral",
  published: true,
  detailPublished: true,
};
