# Sistema editorial de páginas de proyecto

`ProjectPage` no decide la composición fotográfica. Cada proyecto declara su inventario real en `images` y su edición en `galleryLayout`. Los bloques referencian imágenes por `id`, de modo que cambiar el orden o la composición no exige modificar componentes.

## Incorporar un proyecto

1. Guardar los archivos en `public/images/p34/`.
2. Crear el módulo del proyecto dentro de `src/content/projects/`.
3. Registrar cada fotografía en `images` con un `id` estable, ruta, texto alternativo, dimensiones reales, rol y etiquetas.
4. Declarar `galleryLayout` con los ids registrados.
5. Marcar `detailPublished: true` cuando la página esté lista y sumar el proyecto al registro canónico de `src/content/projects/index.ts`.

Las rutas publicadas y la navegación anterior/siguiente se derivan del registro. No hace falta modificar `ProjectPage` para sumar fotografías o publicar otra obra.

```ts
galleryLayout: [
  { id: "opening", type: "fullBleed", imageId: "obra-exterior" },
  { id: "room", type: "containedLandscape", imageId: "obra-interior", align: "right" },
  { id: "pair", type: "diptych", imageIds: ["obra-a", "obra-b"], variant: "lead-left" },
  { id: "section", type: "verticalLandscape", imageIds: ["obra-vertical", "obra-horizontal"], verticalPosition: "left" },
  { id: "contrast", type: "asymmetricPair", imageIds: ["obra-c", "obra-d"], variant: "offset" },
  { id: "detail", type: "detail", imageId: "obra-detalle", align: "left" },
  { id: "sequence", type: "sequence", imageIds: ["obra-e", "obra-f", "obra-g"] },
  { id: "matter", type: "materialInterlude", title: "Materia", statement: "Texto respaldado por el proyecto.", materials: ["material real"] },
  { id: "closing", type: "finalMonument", imageId: "obra-final" },
]
```

## Criterio de los bloques

- `fullBleed`: corte inmersivo de ancho completo; admite altura `cinematic` o `viewport`.
- `containedLandscape`: horizontal contenida y alineable.
- `diptych`: par relacionado, con jerarquía equivalente o una imagen dominante.
- `verticalLandscape`: diálogo entre una toma vertical y otra horizontal.
- `asymmetricPair`: par con escalas y desplazamiento editorial más marcados.
- `detail`: imagen aislada de menor escala.
- `sequence`: progresión de dos o tres imágenes.
- `materialInterlude`: pausa textual clara; la imagen es opcional y los materiales deben estar respaldados por datos.
- `finalMonument`: cierre fotográfico de gran escala.

En mobile, los pares y secuencias dejan la retícula horizontal y se convierten en una secuencia vertical con anchos alternados. Se conserva la jerarquía editorial sin solapamientos ni sticky. La navegación contextual usa únicamente proyectos cuya página individual está publicada.

## Fallback

`galleryLayout` es la fuente prioritaria. Si se omite, el sistema genera una edición básica a partir de las imágenes no hero: monumento para una imagen, díptico para dos y una combinación de horizontal, secuencias/detalles y monumento para tres o más. Es una red de seguridad, no el criterio editorial recomendado.

Los campos de ficha técnica se muestran sólo cuando existen. No se imprimen sustitutos ni datos inferidos.
