# PARALELO 34 — Arquitectura definitiva de contenido

> Fuente de verdad para la evolución funcional y editorial de P—34.
>
> Estado: arquitectura aprobada con decisiones registradas. La implementación continúa por fases autorizadas.
> Fecha: 2026-09-16.

## 1. Decisión central

P—34 debe dejar de organizarse como una secuencia de demostraciones visuales construidas alrededor de cuatro renders. La arquitectura definitiva se organiza por **preguntas del usuario** y no por efectos:

| Área | Pregunta que responde | Unidad principal |
| --- | --- | --- |
| Hero | ¿Qué proyectos definen hoy a P—34? | Proyecto destacado |
| Territorio | ¿Cómo piensa P—34 la arquitectura? | Principio |
| Obras / Atlas Vivo | ¿Qué construyó y qué puedo explorar? | Portfolio y categoría |
| Fragmentos | ¿Qué detalles conforman su lenguaje visual? | Imagen / detalle transversal |
| Materia y Luz | ¿Cómo trabaja con materia, clima y atmósfera? | Tema material y criterio |
| Estudio | ¿Quién es P—34 y cómo trabaja? | Identidad, práctica y equipo |
| Proyecto individual | ¿Qué profundidad tiene esta obra? | Una obra completa |
| Contacto | ¿Cómo inicio una conversación pertinente? | Tipo de consulta |
| Índice | ¿Cómo veo el cuerpo de obra desde otra lógica? | Archivo navegable |

La regla editorial será: **una información tiene una residencia primaria**. Otras áreas pueden referenciarla, pero no volver a explicarla.

---

## 2. Diagnóstico del estado actual

### Lo que funciona

- Hero tiene una identidad cinematográfica clara, interacción por proyecto y un lenguaje propio de máscaras.
- Territorio posee una composición editorial sólida, ritmo más calmo y un recurso gráfico memorable en `34°`.
- Atlas Vivo ya cuenta con selector, temas, cuatro identidades visuales, fallback, reduced motion y transición WebGL aislada.
- `ResponsiveMedia`, `EditorialMeta`, `SplitTitle`, preferencias de movimiento y lifecycle WebGL son una base reutilizable.
- Three.js está cargado dinámicamente y la imagen DOM mantiene la experiencia antes del canvas.

### Problemas estructurales

1. El único dataset actual, `src/data/projects.ts`, mezcla identidad del proyecto, contenido editorial, clasificación y configuración visual.
2. Hero, Territorio y Atlas consumen el mismo arreglo de cuatro proyectos y repiten título, lugar, año, categoría e imágenes.
3. `TerritoryContinuation` escucha `p34-project-change`; por lo tanto Territorio funciona como una extensión de la selección del Hero, no como filosofía autónoma.
4. Atlas asigna una categoría a un único proyecto. En consecuencia no es todavía un explorador de portfolio.
5. La miniatura de Atlas repite la fotografía activa y carece de una acción o significado independiente.
6. No existen rutas de proyecto, archivo profundo, contenido institucional ni contacto.
7. La home actual termina en Atlas. No existe cierre narrativo ni salida comercial.
8. Las variantes de Atlas modifican demasiadas coordenadas del layout a la vez. El shader es continuo, pero el sistema de composición no comparte todavía un esqueleto de transición.

### Riesgo si se continúa sin redefinición

Fragmentos y Materia y Luz terminarían reutilizando las mismas imágenes como nuevas composiciones sin sumar conocimiento, mientras Atlas seguiría pareciendo un segundo Hero. El resultado sería visualmente rico pero editorialmente plano.

---

## 3. Mapa definitivo del sitio

```text
/
├── Hero / Proyectos insignia
├── Territorio / Filosofía
├── Obras / Atlas Vivo
├── Fragmentos / Lenguaje visual
├── Materia y Luz / Criterio material
├── Estudio / Presentación breve
└── Contacto / Cierre

/proyectos
└── Archivo completo y filtros

/proyectos/[slug]
├── Hero de obra
├── Síntesis y ficha
├── Relato conceptual
├── Galería extensa
├── Planos y diagramas
├── Materia y sistema
├── Créditos
├── Relacionados
└── Anterior / siguiente / contacto

/estudio
├── Manifiesto
├── Enfoque y metodología
├── Áreas de trabajo
├── Equipo
├── Trayectoria / hitos
└── Contacto institucional

/contacto
└── Canales y formulario contextual

/indice (opcional, sólo si se aprueba su función de archivo)
└── Vista condensada y alternativa del cuerpo de obra
```

La home cuenta una historia; `/proyectos` permite explorar; `/proyectos/[slug]` permite profundizar; `/estudio` construye confianza; `/contacto` convierte interés en conversación.

---

## 4. Función exacta de cada sección

### 4.1 Hero — Proyectos insignia

**Función:** seleccionar 3–5 obras que representen el nivel y la amplitud de P—34.

**Conservar:** imagen monumental, título, contador, lugar/año mínimos, controles, máscaras y `PROFUNDIZAR`.

**Cambiar conceptualmente:** Hero consume `featuredProjects`, derivado del dataset general. No contiene todas las obras ni intenta filtrar categorías.

**Salida:** `PROFUNDIZAR` conduce a `/proyectos/[slug]`. Un enlace secundario discreto puede llevar a `/proyectos`.

### 4.2 Territorio — Filosofía

**Función:** explicar cómo toma decisiones P—34.

**Conservar:** la retícula, la frase, el tono editorial, la fotografía integrada y `34°`.

**Eliminar:** ficha con ubicación, programa, proyecto, coordenadas y dependencia respecto de la selección del Hero.

**Contenido propuesto:** cuatro principios navegables o coreografiados:

1. `01 / LUGAR` — Topografía, preexistencias y contexto.
2. `02 / ORIENTACIÓN` — Luz, clima y recorrido solar.
3. `03 / MATERIA` — Permanencia, envejecimiento y tactilidad.
4. `04 / PAISAJE` — Continuidad entre interior y exterior.

Cada principio utiliza una imagen de evidencia, potencialmente de proyectos diferentes. La metadata lateral pasa a ser una anotación del principio, no una ficha de obra.

### 4.3 Obras / Atlas Vivo — Explorador del portfolio

**Función:** demostrar amplitud y permitir descubrir obras por categoría.

**Conservar:** selector superior, cuatro identidades, WebGL arquitectónico, tema coordinado y tono experimental.

**Cambiar:** cada categoría contiene múltiples proyectos. El proyecto deja de ser el estado global de Atlas; el estado principal es la categoría y dentro de ella existe una colección explorable.

**Salida:** cada imagen o nombre abre `/proyectos/[slug]`; “Ver todas las obras” abre `/proyectos` con el filtro activo.

### 4.4 Fragmentos — Lenguaje visual transversal

**Función:** descubrir detalles y relaciones visuales que atraviesan muchas obras.

No organiza por proyecto. Organiza por cualidad visual: umbral, encuentro, sombra, vegetación, reflejo, textura, borde, agua, estructura.

Puede ser el momento con muchas imágenes simultáneas: grid real, formatos heterogéneos, máscaras, movimiento diferencial y captions mínimos. Un fragmento puede enlazar al proyecto de origen, pero su función principal es construir lenguaje, no catalogar.

### 4.5 Materia y Luz — Criterio arquitectónico

**Función:** explicar cómo P—34 trabaja con materialidad y atmósfera.

Debe evitar ser una galería. Cada capítulo combina:

- una afirmación corta;
- un material o fenómeno;
- una evidencia visual precisa;
- una nota sobre comportamiento, tiempo o uso.

Capítulos posibles: hormigón / masa; piedra / continuidad; madera / temperatura; vidrio / profundidad; metal / precisión; vegetación / tiempo; luz / orientación.

### 4.6 Estudio

**Función:** convertir una identidad visual fuerte en una práctica creíble.

La home incluye una síntesis; `/estudio` ofrece profundidad. Contenido:

- manifiesto breve;
- enfoque y metodología;
- arquitectura, desarrollo e interiores como áreas;
- equipo y roles;
- ubicación y alcance geográfico;
- trayectoria, hitos o números sólo si son verificables;
- imagen institucional auténtica;
- colaboraciones y servicios;
- enlace a contacto.

### 4.7 Contacto

**Función:** ofrecer una salida comercial sobria y contextual.

Propuesta de cierre:

> CONVERSEMOS SOBRE  
> EL PRÓXIMO LUGAR.

Entradas: `Nuevos desarrollos`, `Alianzas`, `Consultas`. Mostrar Buenos Aires, correo y teléfono. CTA: `INICIAR CONVERSACIÓN →`.

El formulario debe solicitar sólo lo necesario: nombre, correo, tipo de consulta, mensaje y, opcionalmente, ubicación del proyecto. Las páginas de obra deben enviar contexto (`Interés en Casa Litoral`) sin duplicar formularios.

### 4.8 Índice

**Función posible:** una vista de archivo densa que permita leer cronología, escala, categoría, ubicación y estado en simultáneo.

No debe ser un sitemap ni repetir `/proyectos`. Se justifica sólo si ofrece una lógica alternativa: matriz cronológica, índice tipográfico o “mesa de archivo” con preview contextual. Si no aporta esa segunda lectura, debe eliminarse de navegación y alcance.

---

## 5. Matriz antirrepetición

| Contenido | Residencia primaria | Referencias permitidas |
| --- | --- | --- |
| Selección insignia | Hero | Relacionados en páginas de obra |
| Filosofía | Territorio | Manifiesto de Estudio, resumido |
| Catálogo por categorías | Atlas / Obras | Índice como lectura alternativa |
| Datos técnicos completos | Página de proyecto | Hero muestra sólo lugar y año |
| Galería completa de una obra | Página de proyecto | Atlas usa una portada; Fragmentos usa detalles puntuales |
| Detalles transversales | Fragmentos | Materia y Luz sólo cuando explican un criterio |
| Criterio material | Materia y Luz | Proyecto individual lo aplica a esa obra |
| Identidad empresarial | Estudio | Home contiene una síntesis |
| Conversión | Contacto | CTA contextual desde proyectos y Estudio |

Reglas:

- Hero dice **qué mirar primero**.
- Territorio dice **cómo pensamos**.
- Atlas dice **qué obras existen**.
- Fragmentos dice **qué detalles se repiten como lenguaje**.
- Materia y Luz dice **por qué se toman ciertas decisiones físicas**.
- Proyecto individual dice **cómo todo eso se manifiesta en una obra concreta**.

---

## 6. Arquitectura propuesta para Atlas Vivo

### Modelo de interacción

Atlas tiene dos niveles:

1. **Categoría activa:** Habitar, Conjuntos, Interiores o Trabajo.
2. **Colección de proyectos:** varias obras dentro de la categoría.

El selector superior muestra conteo real: `HABITAR / 06`. Al seleccionar una categoría se presenta una portada editorial y, dentro del mismo estado, un campo de obras.

### Composición recomendada

- Un **frame maestro** estable ocupa el área dominante.
- Una obra de apertura funciona como imagen principal y acceso inicial.
- Un “campo de portfolio” revela múltiples fotografías simultáneamente: 1–2 imágenes dominantes, 3–6 secundarias y detalles pequeños.
- Cada fotografía tiene nombre y metadata mínima al hover/focus; en touch, primer toque revela y segundo abre, o el caption permanece visible.
- El usuario puede recorrer obras mediante rueda horizontal controlada, drag/swipe o una secuencia editorial vertical. No debe convertirse en carrusel genérico.
- Debe existir siempre una salida clara: `VER TODAS / [N] OBRAS`.

### Identidades por categoría

- **Habitar:** frame monumental, paisaje y grandes respiraciones.
- **Conjuntos:** repetición modular, serie horizontal y retícula racional.
- **Interiores:** mayor ocupación vertical, proximidad, crops y detalles materiales.
- **Trabajo:** grilla técnica, líneas, códigos y metadata más presente.

La identidad cambia mediante densidad, crops, posición de elementos secundarios y tono; no mediante el reemplazo completo de la geometría principal.

### Miniatura secundaria

Eliminar la miniatura decorativa actual. Sólo reaparece si cumple una función:

- `SIGUIENTE OBRA` con imagen, nombre y acción; o
- preview del proyecto enfocado dentro del campo de portfolio.

Nunca debe repetir sin propósito la imagen principal.

---

## 7. Esqueleto de transición de Atlas

Todas las categorías comparten un estado neutral llamado **TransitionFrame**.

### Geometría estable

- selector fijo en posición;
- frame maestro con el mismo rectángulo durante toda la transición;
- canvas local exactamente superpuesto al frame;
- zonas reservadas para título, contador y metadata;
- elementos secundarios fuera del frame tratados como capas desmontables.

### Secuencia

1. Bloquear nuevas selecciones durante 1.2–1.6 s.
2. Atenuar y retirar captions, fragmentos y metadata secundaria.
3. Llevar la composición activa al `TransitionFrame` sin cambiar el rectángulo principal.
4. Ejecutar el shader entre textura actual y siguiente.
5. Iniciar el cambio cromático después del comienzo de la transformación, nunca antes.
6. Cambiar selector, contador y divisores en la mitad final.
7. Estabilizar la textura nueva y liberar la anterior.
8. Expandir ligeramente el nuevo estado desde el esqueleto común.
9. Introducir título, metadata y campo secundario.
10. Desbloquear interacción.

### Fallback

El mismo timeline, sustituyendo shader por clip direccional, escala de 1–2 % y crossfade. Reduced motion cambia contenido y tema directamente, sin estado intermedio.

### Principio técnico

El shader transforma fotografía; GSAP coordina estado y contenido; CSS define las geometrías de reposo. GSAP no interpola arbitrariamente dos layouts completos.

---

## 8. Modelo de datos escalable

### Entidades

```ts
type CategoryId = "habitar" | "conjuntos" | "interiores" | "trabajo";

type ProjectStatus = "concepto" | "en-desarrollo" | "en-obra" | "completado";

type ProjectMetadata = {
  location: string;
  year: number | null;
  status: ProjectStatus;
  program?: string;
  areaM2?: number;
  coordinates?: { latitude: number; longitude: number };
  client?: string;
  collaborators?: string[];
  credits?: { role: string; name: string }[];
};

type ProjectImageRole =
  | "cover"
  | "hero"
  | "exterior"
  | "interior"
  | "detail"
  | "landscape"
  | "material"
  | "plan"
  | "diagram"
  | "studio";

type ProjectImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  role: ProjectImageRole;
  tags: string[];
  caption?: string;
  focalPoint?: { x: number; y: number };
  priority?: boolean;
};

type Project = {
  id: string;
  slug: string;
  code: string;
  title: string;
  categoryId: CategoryId;
  summary: string;
  concept: string[];
  metadata: ProjectMetadata;
  images: ProjectImage[];
  materialTags: string[];
  relatedProjectIds?: string[];
  published: boolean;
};

type Category = {
  id: CategoryId;
  label: string;
  description: string;
  theme: "dark" | "light" | "warm" | "technical";
  order: number;
};

type FeaturedProject = {
  projectId: string;
  order: number;
  heroImageId?: string;
  heroTitleLines?: string[];
};

type TerritoryPrinciple = {
  id: "lugar" | "orientacion" | "materia" | "paisaje";
  index: string;
  title: string;
  statement: string;
  evidence: { projectId: string; imageId: string }[];
};
```

### Fuente y derivados

**Fuente canónica:** proyectos, categorías y principios. `FeaturedProject` contiene únicamente curaduría y overrides específicos del Hero.

**Derivados automáticos:**

- conteo por categoría;
- proyectos por categoría;
- portada predeterminada (`role === "cover"`);
- galerías por proyecto;
- fragmentos por tags y roles;
- materiales por `materialTags`;
- anterior/siguiente según orden editorial;
- relacionados por IDs o coincidencia de categoría/tags;
- rutas estáticas por `slug`.

No duplicar `title`, `location`, `year` ni arrays de imágenes dentro de Hero, Atlas o páginas. Esas vistas almacenan sólo IDs, orden y configuración de presentación.

### Organización sugerida

```text
src/content/
├── categories.ts
├── projects/
│   ├── casa-litoral.ts
│   ├── patio-sur.ts
│   ├── umbral.ts
│   └── oficinas-ribera.ts
├── featured-projects.ts
├── territory-principles.ts
└── selectors.ts
```

Para decenas de proyectos conviene un archivo por obra. Un `index.ts` valida, combina y exporta selectores. Más adelante puede sustituirse por CMS sin cambiar contratos de componentes.

---

## 9. Arquitectura de páginas individuales

Ruta: `/proyectos/[slug]` con generación estática a partir de proyectos publicados.

Orden recomendado:

1. **ProjectHero:** imagen hero, código, título y categoría.
2. **ProjectOverview:** ubicación, año, estado, programa, superficie y síntesis.
3. **ProjectNarrative:** texto conceptual breve, no manifiesto genérico.
4. **ProjectGallery:** secuencia editorial extensa que respeta roles, ratio y focal point.
5. **Drawings:** planos, cortes o diagramas, sólo si existen.
6. **MaterialSystem:** materiales aplicados específicamente a la obra.
7. **ProjectCredits:** cliente, equipo, colaboradores y fotografía.
8. **RelatedProjects:** 2–3 relaciones justificadas.
9. **ProjectPagination:** anterior y siguiente dentro del orden editorial.
10. **ProjectContact:** CTA contextual con el nombre de la obra.

Componentes reutilizables: `ResponsiveMedia`, `EditorialMeta`, `SplitTitle`, sistema de movimiento, preferencias, galería fragmentada y navegación anterior/siguiente. El layout de cada obra puede variar mediante una configuración editorial acotada, sin duplicar páginas.

---

## 10. Estrategia para incorporar fotografías

1. Cada archivo se asigna a un `projectId` y obtiene `role`, `tags`, dimensiones, alt y focal point.
2. La portada, Hero y Atlas eligen imágenes por rol; no por paths escritos dentro de componentes.
3. Fragmentos consulta tags transversales como `sombra`, `agua`, `encuentro`, `vegetacion` o `textura`.
4. Materia y Luz consulta roles y `materialTags`, pero conserva curaduría editorial para no volverse automático/genérico.
5. Las páginas de proyecto muestran todas las imágenes publicables según un orden explícito.
6. Las dimensiones se conocen desde datos para reservar espacio y evitar CLS.
7. Los assets futuros se organizan por proyecto:

```text
public/images/p34/projects/[slug]/
├── cover.*
├── hero.*
├── exterior-01.*
├── interior-01.*
├── detail-01.*
└── plan-01.*
```

No inferir semántica sólo desde el nombre del archivo: el dataset sigue siendo la fuente de verdad.

---

## 11. Navegación global

Propuesta principal:

```text
P—34     TERRITORIO     OBRAS     ESTUDIO     CONTACTO
```

- `P—34`: vuelve a la portada.
- `Territorio`: filosofía; ancla en home o ruta `/territorio` sólo si crece suficientemente.
- `Obras`: abre `/proyectos`; desde la home puede primero desplazarse a Atlas según contexto.
- `Estudio`: identidad y credibilidad.
- `Contacto`: salida comercial persistente pero discreta.

`Índice` no ocupa navegación global hasta demostrar una función distinta de Obras. Puede aparecer dentro de `/proyectos` como modo alternativo `VISUAL / ÍNDICE`.

En mobile: menú compacto con las mismas cuatro rutas, sin depender de hover. La navegación debe conocer tema/escena mediante un contrato explícito, no sólo `mix-blend-mode`.

---

## 12. Estrategia de contacto

- Cierre de home después de Estudio.
- Ruta dedicada `/contacto` para formulario y datos completos.
- CTA contextual al final de cada proyecto.
- CTA institucional en `/estudio`.
- El tipo de consulta puede precargarse desde el origen.
- Evitar popups, chat flotante y formularios largos.
- Confirmación clara, accesible y sobria.

El contacto no interrumpe la experiencia; aparece cuando el usuario ya comprendió obra, pensamiento y práctica.

---

## 13. Qué conservar, mover y eliminar

### Conservar

- Hero cinematográfico y su sistema de selección.
- Composición visual de Territorio y `34°`.
- Selector y transición WebGL de Atlas como motor.
- Las cuatro identidades cromáticas y editoriales.
- Componentes base y preferencias de movimiento.
- Assets actuales, reasignados a roles claros.

### Mover

- Metadata técnica desde Territorio hacia páginas de proyecto.
- Catálogo completo desde Hero hacia Obras.
- Materialidad específica hacia páginas de obra; lenguaje transversal hacia Materia y Luz.
- Índice desde cierre obligatorio hacia modo alternativo de archivo.

### Eliminar

- Sincronización Hero → Territorio.
- Miniatura repetida de Atlas sin acción.
- Categoría equivalente a un único proyecto.
- Repetición de título/lugar/año en cada escena.
- Futuros bloques que existan sólo para mostrar otro efecto.

---

## 14. Alcance correcto de Fase 3

Después de aprobar esta arquitectura, Fase 3 no debe comenzar por Fragmentos. Debe convertir el prototipo actual en un sistema de contenido real.

### Fase 3 propuesta — Content foundation + Obras

1. Implementar tipos y estructura canónica de datos.
2. Migrar los cuatro proyectos actuales sin cambiar inicialmente sus datos visibles.
3. Crear selectores derivados y validación de referencias.
4. Separar `featuredProjects` para Hero.
5. Separar `territoryPrinciples` y desacoplar Territorio del Hero.
6. Rediseñar Atlas como categoría + colección.
7. Definir `TransitionFrame` estable y adaptar shader/fallback a ese frame.
8. Crear `/proyectos` como explorador completo.
9. Crear una plantilla funcional `/proyectos/[slug]` para Casa Litoral usando los cuatro assets disponibles.
10. Preparar estados vacíos para proyectos que aún no tengan galería completa.

**Fuera de Fase 3:** Fragmentos definitivo, Materia y Luz definitiva, página Estudio completa, formulario conectado e Índice experimental. Esas áreas necesitan más assets y contenido real.

---

## 15. Orden recomendado de implementación

1. Aprobar arquitectura y taxonomía.
2. Inventariar proyectos, fotografías y datos reales disponibles.
3. Implementar modelo de datos y validación.
4. Migrar Hero a destacados derivados.
5. Convertir Territorio en principios.
6. Construir rutas `/proyectos` y `/proyectos/[slug]` con una obra piloto.
7. Reconstruir Atlas sobre categorías y múltiples obras.
8. Validar navegación global y rutas.
9. Incorporar nuevos proyectos y fotografías.
10. Diseñar Fragmentos con el corpus fotográfico ampliado.
11. Diseñar Materia y Luz con contenido material verificable.
12. Crear Estudio con contenido institucional real.
13. Implementar Contacto y CTAs contextuales.
14. Evaluar Índice; implementar sólo si ofrece una lectura distinta.
15. QA integral: rendimiento, accesibilidad, reduced motion, responsive y continuidad narrativa.

---

## 16. Criterios de aceptación antes de implementar

- Cada sección puede describirse con una pregunta diferente.
- Ninguna escena existe sólo para reutilizar una imagen.
- Un proyecto nuevo se agrega en datos, no editando Hero, Atlas y páginas por separado.
- Atlas puede contener múltiples obras por categoría.
- Territorio no depende del proyecto activo del Hero.
- Toda imagen conoce proyecto, rol, dimensiones, alt y tags.
- Las páginas individuales son generables desde el mismo dataset.
- Índice tiene una lógica de archivo distinta o se elimina.
- Contacto tiene presencia clara sin tono agresivo.
- Fase 3 prioriza arquitectura de contenido antes de sumar escenas.

## 17. Decisiones todavía pendientes

1. Reunir el nuevo corpus real de proyectos y fotografías antes de fijar el alcance visible de cada categoría.
2. Redefinir `featuredProjects` cuando ese corpus esté disponible.
3. Reunir contenido institucional verificable para Estudio.
4. Definir canales reales y destino técnico del formulario de contacto.

Estas decisiones no bloquean los puntos 1–5 aprobados, pero sí las fases posteriores relacionadas.

## 18. Decisiones aprobadas

- `OBRAS` en la Home conduce a `#atlas`; Atlas tendrá una salida a `/proyectos` cuando el archivo completo sea implementado.
- Índice queda fuera del alcance. Podrá evaluarse como modo `VISUAL / ÍNDICE` dentro de `/proyectos`.
- Los cuatro proyectos actuales permanecen provisionalmente como destacados del Hero.
- Los conteos de Atlas serán siempre derivados del número real de proyectos por categoría.
- Casa Litoral es la obra piloto para el sistema `/proyectos/[slug]`.
- Estudio y Contacto permanecen contemplados sin inventar información institucional o comercial.
- Atlas será reconstruido después de la página piloto, mediante categoría + múltiples proyectos y `TransitionFrame` estable.

Orden aprobado:

1. Modelo canónico.
2. Migración de los cuatro proyectos.
3. Destacados y selectores derivados.
4. Territorio desacoplado y basado en principios.
5. Página piloto Casa Litoral.
6. Reconstrucción de Atlas.
7. Archivo `/proyectos`.
8. Nuevo corpus.
9. Fragmentos y fases posteriores.

## 19. Registro de implementación — puntos 1 a 5

- Se creó `src/content` con tipos, categorías, proyectos por archivo, destacados, principios y selectores.
- Los cuatro proyectos existentes fueron migrados sin fijar cantidades de categoría.
- Hero consume ahora una selección derivada de `featuredProjectEntries` y enlaza `PROFUNDIZAR` a la ruta del proyecto.
- Atlas conserva su implementación actual mediante un view-model de compatibilidad; no fue reconstruido.
- Territorio dejó de escuchar el proyecto activo del Hero y presenta los cuatro principios aprobados.
- Se creó la plantilla reutilizable `ProjectPage` y la ruta estática piloto `/proyectos/casa-litoral`.
- Los otros slugs no se publican todavía como páginas individuales.
- La navegación de Home enlaza `OBRAS` con `#atlas`; Índice fue retirado de la navegación actual.
