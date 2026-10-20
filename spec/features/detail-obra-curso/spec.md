# SPEC — detail-obra-curso (Fase 4: Ficha Final / Resumen Ejecutivo y Evidencias)

> **Estado:** APROBADA (2026-10-20) por el Humano.
> Fuente de verdad de producto de Fase 4. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.

## 1. Objetivo

Pantalla `Detail` de solo-lectura con el detalle ejecutivo de una **Obra** o una **Capacitación** (Curso): tarjetas KPI, mapa de ubicación, carrusel de evidencias fotográficas (Cloudflare), descripción y filas clave-valor. Entrada única: tap en tarjeta del explorador (Fase 3) con `{ tipo, id }`; el endpoint se elige por `tipo`.

## 2. Decisiones del Humano (2026-10-20)

1. **Dos endpoints por tipo** (entregados verbatim, §4.7): `GET /api/v1/app-mobile/obra/{id}` y `GET /api/v1/app-mobile/curso/{id}`. La tarjeta de Search ya trae `tipo` (`"OBRA"`/`"CURSO"`) + `idOriginal` → la app elige endpoint y vista por `tipo`.
2. **Dos mockups** (uno por tipo, ya versionados): `mockups/Detalle_obra.jpg` (1198×3464) y `mockups/Detalle_capacitacion.jpg` (1348×3189). Cada tipo muestra información distinta (§4.5 / §4.6).
3. **`coverImageUrl` del DTO de curso NO se renderiza** como campo adicional: `galeryUrls` ya incluye esa imagen.
4. **«Ver más» del popup KPI municipal (radar 2b): se OCULTA (no se elimina)** en Fase 4. Su flujo se aplaza a la **Fase 5 (Detalle Municipal, placeholder en roadmap)**.
5. **Carrusel de evidencias:** `FlashList` horizontal (lazy real vía reciclado) + `expo-image`; tap en una foto → se abre más grande (`Modal` nativo de RN, sin zoom/pan); si no hay imágenes → mensaje institucional.
6. **Header del chrome con título dinámico:** el chrome 2a se mantiene intacto (franja de marca + header crema + hamburguesa/drawer); el título del header muestra **`DETALLE`** en esta pantalla y **`BÚSQUEDA`** en Search (petición expresa: «no me gustó ver INICIO en la barra de búsqueda»); Home sigue `INICIO`. Mecanismo: `HeaderTitleProvider` en `app-shell/presentation` (default `INICIO`) + `useFocusEffect` por pantalla. `«Resumen Ejecutivo»` del mockup **no se pinta** (redundante con `DETALLE`); el back arrow vive en el cuerpo (patrón Fase 3).
7. **Ajuste de Search:** con el header mostrando `BÚSQUEDA`, se **retira el título duplicado del cuerpo** de Search y se conserva el back arrow en la fila 1.
8. **Título de la obra en Title Case** (consistencia Fase 3; el endpoint manda MAYÚSCULAS). El título del curso va verbatim (ya llega en Title Case). Descripción y valores de filas clave-valor van **verbatim** en ambos tipos.
9. **Mapa de «Ubicación» INTERACTIVO** (zoom/pan habilitados; `pitch`/`rotate` off), `react-native-maps` con `PROVIDER_GOOGLE` homologado, pin guinda `#6B142E`. Riesgo documentado: el gesto vertical puede quedar atrapado por el mapa dentro del scroll → se mitiga con altura moderada y se valida en físico (CA-07).
10. **Cero dependencias nuevas en toda la Fase 4** (FlashList, `expo-image`, `react-native-maps` y `Modal` de RN ya autorizados).
11. **Fase 5 placeholder** en el roadmap: confirmada.
12. **Copy de estados:** galería vacía → «Sin evidencias fotográficas.»; error de carga → «No se pudo cargar el detalle.»

## 3. Insumos

- Mockups: `mockups/Detalle_obra.jpg`, `mockups/Detalle_capacitacion.jpg` (leídos por el Orquestador 2026-10-20; el Worker no lee imágenes — la transcripción literal es §4.5/§4.6).
- Contratos reales verbatim con JSON de ejemplo (§4.7), entregados por el Humano 2026-10-20.
- Paleta `detail-*` muestreada 2026-10-20 (tech-stack §2.6; §4.1–4.4 abajo).
- Features congeladas: `app-shell` (2a), `home` (2b), `search` (3). Cambios autorizados: §8.

## 4. Diseño (transcripción literal + tokens + contratos)

### 4.1 Tokens (verbatim, tech-stack §2.6 — muestreo stdlib de ambos mockups)

| Token | Hex | Uso |
| --- | --- | --- |
| `detail-screen-bg` | `#E4E4D8` | Fondo del cuerpo de la pantalla. |
| `detail-card-bg` | `#F4F0E8` | Fondo de tarjetas KPI y filas clave-valor. |
| `detail-accent` | `#BC803C` | Iconos dorados de KPI e icono del heading «Ubicación». |
| `detail-kpi-label` | `#545454` | Label principal de tarjeta KPI. |
| `detail-text-muted` | `#7C7C78` | Sublabels KPI, captions `evidencia N`, labels de filas, mensaje sin evidencias. |

Textos primarios/valores: `texto #1A1A1A` (Lato Bold). Pin del mapa: `guinda #6B142E`. Tipografía: **Lato / Lato Bold** exclusivamente.

### 4.2 Reglas de color

- Iconos KPI y pin del heading «Ubicación»: `detail-accent`.
- Labels KPI: `detail-kpi-label`; valores KPI: `texto` Lato Bold; sublabels: `detail-text-muted`.
- Filas clave-valor: fondo `detail-card-bg`, label `detail-text-muted`, valor `texto` Lato Bold.
- Captions del carrusel: `detail-text-muted`.
- Paleta `auth-*` prohibida. `search-accent` prohibido (§2.5 tech-stack).

### 4.3 Tipografía

Lato / Lato Bold en TODO (título de pantalla, headings de sección, KPIs, descripción, filas, captions). El serif del mockup es artefacto del generador (precedente 1.5a/3).

### 4.4 Iconografía (Ionicons — aproximación a los glyphs del mockup)

| Uso | Ionicons |
| --- | --- |
| KPI Finanzas | `cash-outline` |
| KPI Avance | `pie-chart-outline` |
| KPI Estatus | `flag-outline` |
| KPI Fecha (curso) | `calendar-outline` |
| KPI Municipio (curso) | `location-outline` |
| Heading «Ubicación» | `location-outline` |
| Back arrow (cuerpo) | `arrow-back` |
| Cerrar visor de evidencia | `close` |

Todos los iconos KPI/heading en `detail-accent`; back arrow y cerrar en `texto` (sobre fondo claro) / `superficie` (visor oscuro).

### 4.5 Transcripción literal — `Detalle_obra.jpg` (1198×3464)

Estructura vertical (ScrollView, fondo `detail-screen-bg`):

1. **Fila back:** back arrow (`arrow-back`, `texto`) a la izquierda. (El mockup lo muestra en su header guinda propio — desviación §6.1: el chrome manda y el back vive en el cuerpo.)
2. **Título de la obra:** Lato Bold, `texto`, ~24–26 px, alineado a la izquierda, hasta 2–3 líneas. Contenido: `toTitleCase(name)` — el mockup lo muestra en MAYÚSCULAS serif («INFRAESTRUCTURA PARA UN DESARROLLO TERRITORIAL ORDENADO Y SOSTENIBLE»); desviaciones §6.3/§6.4.
3. **Fila de 3 tarjetas KPI** (fondo `detail-card-bg`, radio ~28, sombra sutil, padding vertical generoso; ancho a tercios con gap ~12):
   - **Finanzas:** icono `cash-outline` (`detail-accent`); label «Finanzas» (`detail-kpi-label`); valor «$10,495,378.41» (Lato Bold `texto`, una línea) = `formatInversion(investment)`; sublabel «Inversión» (`detail-text-muted`).
   - **Avance:** icono `pie-chart-outline`; label «Avance»; valor «{progress}%» (Lato Bold, grande); sublabel «Completado» (fijo, §4.8.9).
   - **Estatus:** icono `flag-outline`; label «Estatus»; valor `{status}` verbatim (Lato Bold, **una línea** con font reducido — el wrap «FINALIZA/DA» del mockup es artefacto §4.8.4); sublabel «Estado de la obra».
4. **Sección Ubicación:** fila heading = icono `location-outline` (`detail-accent`) + «Ubicación» (Lato Bold `texto`); mapa embebido (radio ~20, altura ~200) centrado en `latitude/longitude` con pin guinda, **interactivo** (§2.9). El mockup muestra OpenStreetMap con pin verde, botones +/− y footer de atribución — artefactos §4.8.5.
5. **Sección Evidencias:** heading «Evidencias» (Lato Bold `texto`); carrusel horizontal de tarjetas (radio ~20, relación 4:3, ancho fijo ~240 dp, gap ~12, la última tarjeta asoma recortada — *peek*); caption `evidencia N` (`detail-text-muted`, minúscula, centrado bajo cada tarjeta). Tap en tarjeta → visor `Modal` a pantalla completa con la foto (`contentFit="contain"`, fondo oscuro) y botón cerrar. Sin `galeryUrls` → mensaje «Sin evidencias fotográficas.» (`detail-text-muted`).
6. **Sección Descripción:** heading «Descripción» (Lato Bold); párrafo **verbatim** del DTO (el mockup lo muestra en MAYÚSCULAS tal cual llega; `texto`, Lato regular).
7. **Filas clave-valor** (pills `detail-card-bg`, radio ~30, apiladas con gap ~12; label a la izquierda `detail-text-muted`, valor a la derecha Lato Bold `texto`, **verbatim**):
   - Municipio → `{municipality}`
   - Localidad → `{locality}`
   - Dependencia → `{agency}`
   - Estatus → `{status}`

### 4.6 Transcripción literal — `Detalle_capacitacion.jpg` (1348×3189)

Misma estructura vertical; diferencias:

2. **Título del curso:** **verbatim** (`title` ya llega en Title Case: «Taller de Programación Web - Grupo 1»).
3. **Fila de 2 tarjetas KPI** (más anchas, mitades):
   - **Fecha:** icono `calendar-outline`; label «Fecha»; valor `formatFechaCurso(courseDate)` («4 de julio de 2026»); sublabel «Fecha del curso».
   - **Municipio:** icono `location-outline`; label «Municipio»; valor `{municipality}` verbatim; sublabel «Sede».
4–6. Ubicación, Evidencias y Descripción: idénticas a obra (la descripción del curso llega en caso normal y va verbatim).
7. **Filas clave-valor:**
   - Municipio → `{municipality}`
   - Fecha del curso → `formatFechaCurso(courseDate)`

### 4.7 Contratos HTTP (verbatim — inmutables)

Bearer vía interceptor de `axiosClient` existente. Sin query params. La app **ignora deliberadamente** cualquier campo no listado.

**OBRA — `GET /api/v1/app-mobile/obra/{id}`** → `200` `AppMobileObraDetailDTO`:

```json
{
  "id": 1,
  "name": "INFRAESTRUCTURA PARA UN DESARROLLO TERRITORIAL ORDENADO Y SOSTENIBLE",
  "municipality": "KANASIN",
  "locality": "KANASIN",
  "agency": "IDEFEEY",
  "investment": "10495378.41",
  "progress": 100,
  "description": "OBRAS COMPLEMENTARIAS (ELECTRIFICACION) EN LA UNIVERSIDAD NACIONAL ROSARIO CASTELLANOS UNIDAD ACADEMICA KANASIN C.C.T. 31DSU0002Z UBICADA EN LA LOCALIDAD Y MUNICIPIO DE KANASIN",
  "latitude": 20.9333,
  "longitude": -89.5667,
  "status": "FINALIZADA",
  "galeryUrls": [
    "https://imagedelivery.net/oeZ15vnHiyqFn27EXyeqcw/07da609d-bd7f-42fb-f4a1-e1f537625d00/thumbnail",
    "https://imagedelivery.net/oeZ15vnHiyqFn27EXyeqcw/d34d74b9-c60a-4265-1fe7-1e9e24893e00/thumbnail",
    "https://imagedelivery.net/oeZ15vnHiyqFn27EXyeqcw/f1bfbac9-d031-43ae-017d-2f4ed9955e00/public"
  ]
}
```

```java
public class AppMobileObraDetailDTO {
    private Long id;
    private String name;
    private String municipality;
    private String locality;
    private String agency;
    private String investment;
    private Integer progress;
    private String description;
    private Double latitude;
    private Double longitude;
    private String status;
    private List<String> galeryUrls;
}
```

**CURSO — `GET /api/v1/app-mobile/curso/{id}`** → `200` `AppMobileCursoDetailDTO`:

```json
{
  "id": 1,
  "title": "Taller de Programación Web - Grupo 1",
  "description": "Este es un curso de prueba diseñado para fortalecer las habilidades técnicas de los ciudadanos en el estado de Yucatán. Sesión #0",
  "municipality": "Izamal",
  "courseDate": "2026-07-04",
  "latitude": 20.932820097109015,
  "longitude": -88.84655013959085,
  "coverImageUrl": "https://picsum.photos/seed/curso-0-0/800/600",
  "galeryUrls": [
    "https://picsum.photos/seed/curso-0-0/800/600",
    "https://picsum.photos/seed/curso-0-1/800/600",
    "https://picsum.photos/seed/curso-0-2/800/600"
  ]
}
```

```java
public class AppMobileCursoDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String municipality;
    private String courseDate;
    private Double latitude;
    private Double longitude;
    private String coverImageUrl;
    private List<String> galeryUrls;
}
```

Reglas de mapeo:

- **`galeryUrls` (sic, typo del backend) es OPCIONAL** (puede no traer imágenes): wire DTO `galeryUrls?: string[]` → entidad `galleryUrls: string[] | null` (la entidad corrige el typo; ausente → `null`). Array vacío y `null` producen el mismo estado «Sin evidencias fotográficas.».
- **`coverImageUrl` NO se consume** (decisión §2.3): no se declara en la entidad de dominio. El wire DTO lo declara opcional por documentación y el mapper lo **ignora deliberadamente**.
- `investment` llega como `String` ("10495378.41") → la app lo formatea (§4.5). `progress` puede ser `0` (válido; se pinta `0%`).
- Las URLs de evidencia se consumen **tal cual** las entrega el DTO (variantes Cloudflare `/thumbnail`, `/public`, etc.; tech-stack §4). Prohibido manipular la URL para pedir otra variante.
- Los JSON de ejemplo de curso traen URLs `picsum.photos` (datos de prueba del backend); en producción serán Cloudflare. La app no distingue host.

### 4.8 Artefactos del JPG / campos inexistentes — PROHIBIDO replicar

1. **Header guinda propio del mockup** (back arrow + «Resumen Ejecutivo» serif sobre guinda): el chrome 2a manda con título dinámico `DETALLE` (§2.6); «Resumen Ejecutivo» no se pinta; el back arrow vive en el cuerpo.
2. **Serif** en «Resumen Ejecutivo», título, headings de sección y valores: → Lato / Lato Bold (constitución).
3. **Título de la obra en MAYÚSCULAS** → Title Case (§2.8). (La descripción y las filas sí van verbatim en MAYÚSCULAS — el mockup así lo muestra y el contrato manda.)
4. **Wrap «FINALIZA/DA»** en la KPI de Estatus: artefacto del ancho de card; el valor se pinta en **una línea** con font dimensionado (plan §8).
5. **Mapa OpenStreetMap, pin verde, botones +/−, footer «Report a problem | © OpenStreetMap contributors ❤️ Make a Donation…»**: artefactos del generador → `react-native-maps` `PROVIDER_GOOGLE`, pin guinda `#6B142E`, sin botones custom ni footer.
6. **Etiqueta «Preview»** solapada sobre «Evidencias» (mockup capacitación): artefacto del generador.
7. **Bezel, status bar del teléfono y hairlines duplicadas** del JPG: no se pintan (igual que 2a/2b/3). Las hairlines entre secciones se omiten (inconsistentes entre mockups); las secciones se separan por espaciado.
8. **Datos de ejemplo** (nombres, montos, fotos, coordenadas): los reales vienen del endpoint.
9. **Sublabel «Completado» de la KPI Avance:** es fijo (mockup). Se lee como «{progress}% Completado» (`45% Completado`); no es un estado booleano.
10. **Evidencias cronológicas «Antes / En Proceso / Después»** (roadmap original): superseded — `galeryUrls` no trae fase; captions `evidencia N`.
11. **«Empleo Local (% Personal Local)»** (roadmap original): superseded — el DTO no lo trae; la 3ª KPI de obra es **Estatus**.
12. **«$ MDP»** (roadmap original): superseded — el mockup muestra el monto completo formateado.

## 5. Flujo de usuario

1. Login / biometría → `Home` (radar) → `Search` (explorador Fase 3). Header del chrome: `INICIO` en Home, `BÚSQUEDA` en Search.
2. Tap en una tarjeta OBRA/CURSO → `navigate("Detail", { tipo, id })`. Header del chrome pasa a `DETALLE`.
3. `Detail` monta: spinner central (Lato, guinda) mientras carga `GET .../obra/{id}` o `.../curso/{id}` según `tipo`.
4. Respuesta → título, KPIs por tipo, mapa interactivo con pin guinda, carrusel de evidencias (o mensaje si no hay), descripción y filas clave-valor.
5. Tap en una evidencia → visor `Modal` a pantalla completa (foto contenida, fondo oscuro); botón X (o back de Android) cierra.
6. **Back arrow** → `navigation.goBack()` al explorador; el header vuelve a `BÚSQUEDA` (Search conserva su estado por seguir en el stack).
7. Error HTTP → mensaje institucional «No se pudo cargar el detalle.» (sin bloquear chrome ni navegación).
8. El drawer del chrome funciona igual que 2a por encima de la pantalla; el mapa es interactivo (zoom/pan) sin secuestrar la navegación.
9. `Detail` es read-only (mission §4): cero acciones de escritura, cero formularios.

## 6. Desviaciones aprobadas del mockup

1. **Chrome 2a con título dinámico `DETALLE`** en vez del header guinda propio del mockup (decisión §2.6); «Resumen Ejecutivo» no se pinta.
2. **Back arrow en el cuerpo** (patrón Fase 3); el mockup lo muestra en su header propio.
3. **Serif → Lato / Lato Bold** (constitución; precedente 1.5a).
4. **Título de obra en Title Case** (el mockup y el endpoint traen MAYÚSCULAS; decisión §2.8).
5. **Mapa `react-native-maps` `PROVIDER_GOOGLE` interactivo con pin guinda** (OSM/pin verde/botones/footer = artefactos §4.8.5).
6. **KPI Estatus en una línea** con font dimensionado (wrap = artefacto §4.8.4).
7. **Sin hairlines** entre secciones (espaciado; §4.8.7).
8. **Iconos KPI/headings = Ionicons** en `detail-accent` (los glyphs custom del mockup se aproximan; §4.4).
9. **`coverImageUrl` no se renderiza** (decisión §2.3).
10. **Search: header `BÚSQUEDA` + retiro del título del cuerpo** (decisión §2.7; el back arrow se conserva).

## 7. Reglas superseded

| Regla original | Nuevo comportamiento |
| --- | --- |
| Roadmap §4 original: KPI «Empleo Local (% Personal Local)» | 3ª KPI de obra = **Estatus** (`status` del DTO) |
| Roadmap §4 original: Finanzas en «$ MDP» | Monto completo formateado `$10,495,378.41` (`formatInversion`) |
| Roadmap §4 original: carrusel cronológico «Antes / En Proceso / Después» | Captions `evidencia N` (`galeryUrls` no trae fase) |
| Spec 2b: «Ver más» del popup municipal = no-op | «Ver más» **oculto** en Fase 4 (código intacto, `SHOW_SEE_MORE = false`); su flujo = Fase 5 |
| Spec Fase 3: título `BÚSQUEDA` en el cuerpo de Search | `BÚSQUEDA` en el header del chrome (título dinámico); el cuerpo conserva solo el back arrow |
| Spec 2a: header del chrome siempre `INICIO` | Título dinámico por pantalla vía `HeaderTitleProvider` (default `INICIO`) |
| Spec Fase 3: tap en tarjeta = no-op tipado | Tap navega a `Detail` con `{ tipo, id }` |

Todo lo no listado permanece intacto (auth, SecureStore, chrome 2a — franja/drawer/logout, radar 2b, búsqueda 3, `NavigationContainer key={status}`, DIP, fences).

## 8. Arquitectura (Fase 4 — feature completo, 4 capas)

- `src/features/detail/domain/` — entidades `ObraDetail` / `CursoDetail`, puertos `ObraDetailRepository` / `CursoDetailRepository`, error `DetailError`. Cero imports de Expo/Axios/React/TanStack/FlashList/Mapas.
- `src/features/detail/application/` — use cases closures `createObraDetail` / `createCursoDetail` + `DetailUseCases`. Cero imports de infra.
- `src/features/detail/infrastructure/` — `dto.ts` (wire espejo de §4.7: `galeryUrls?`, `coverImageUrl?` documentado), `AxiosObraDetailApi` + `AxiosCursoDetailApi` (cada uno implementa su puerto; path del endpoint único por archivo; mapper 1:1 con `galeryUrls` → `galleryUrls`, cero `any`).
- `src/features/detail/presentation/` — `DetailProvider` (use cases por props, calco `SearchProvider`), `useDetail` (fachada única), `DetailScreen` (dos `useQuery` con `enabled` por `tipo`; spinner/error/contenido), `ObraDetailContent` / `CursoDetailContent`, `KpiCard`, `DetailSectionHeading`, `DetailMapCard` (único archivo de detail con `react-native-maps`), `EvidenceCarousel` + `EvidenceViewerModal` (`expo-image` solo aquí), `DetailInfoRows`, `format.ts` (`toTitleCase` duplicado deliberado, `formatInversion` con `Intl.NumberFormat` hoisted, `formatFechaCurso` con array de meses hoisted).
- `src/app/compositionRoot.ts` — añade `createDetailUseCases()` (único importador de la infra de detail).
- `App.tsx` — envuelve `DetailProvider` dentro de `SearchProvider`.
- `RootNavigator` / `types.ts` — ruta `Detail: { tipo: "OBRA" | "CURSO"; id: number }` en `AppStackParamList` (literal inline; prohibido importar `SearchCardTipo` entre features).
- **Cambios en features congeladas (solo los autorizados §2):**
  - `app-shell/presentation/`: **nuevos** `HeaderTitleProvider.tsx` + `useHeaderTitle.ts` (contexto ligero, default `INICIO`); `AppHeader.tsx` consume el contexto y pinta el título dinámico (INICIO idéntico en Home); `AppShell.tsx` envuelve con el provider.
  - `home/presentation/HomeScreen.tsx`: setea `INICIO` al ganar foco (`useFocusEffect`). `home/presentation/MunicipioCallout.tsx`: «Ver más» se oculta con constante `SHOW_SEE_MORE = false` (código intacto).
  - `search/presentation/SearchScreen.tsx`: setea `BÚSQUEDA` al ganar foco; **retira** el `Text` del título del cuerpo (back arrow se conserva). `search/presentation/SearchResultCard.tsx`: `onPress` navega a `Detail` con `{ tipo: card.tipo, id: card.id }`.
  - `detail/presentation/DetailScreen.tsx`: setea `DETALLE` al ganar foco.
- Estado de servidor: **TanStack Query** (`useQuery` por tipo, `queryKey: ["detail", "obra" | "curso", id]`, `signal` al use case). Cero estado duplicado. El visor de evidencia es estado UI local (`string | null`).
- Fences ESLint: **sin cambios** (los bans por capas ya cubren `react-native-maps`, `@shopify/*`, `expo-image` en domain/application; presentation no importa infra).
- Cero barrels `index.ts`. Cero `any`. Solo `Pressable`. Cero fixture de datos en código.

## 9. Límites (qué NO se toca)

**ESTÁ ESTRICTAMENTE PROHIBIDO:**

- Detalle municipal / ficha por municipio (Fase 5). Reactivar el «Ver más» (queda oculto por constante).
- Cambiar máquina de estados auth, DTOs login, claves SecureStore, drawer/franja/logout del chrome, radar 2b (salvo ocultar «Ver más»), lógica de búsqueda 3 (debounce/estados/scroll infinito; solo el tap de tarjeta y el título del cuerpo cambian, §8).
- Pedir o sugerir reescrituras del backend (mission §4). Los contratos §4.7 son inmutables.
- Añadir dependencias (Fase 4 = **cero deps nuevas**). Expo Router. Código `.swift`/`.kt`/`.java`/`.pbxproj`/`Info.plist`/`AndroidManifest.xml` a mano.
- `TouchableOpacity`, `FlatList`, `any`, emojis, fuentes ≠ Lato, paleta `auth-*`, `search-accent`, `estimatedItemSize`, `Image` de react-native para imágenes remotas.
- Zoom/pan en el visor de evidencias (fuera de alcance; solo abrir/cerrar). Manipular las URLs de Cloudflare (variantes) — se consumen tal cual.
- Renderizar `coverImageUrl`, empleo local, fases cronológicas de evidencia, monto en MDP.
- Correr `npx expo start` (reservado al Humano).

## 10. Criterios de Aceptación (CA)

- [ ] **CA-01 (Pixel obra):** título Title Case, 3 KPI (Finanzas/Avance/Estatus con iconos `detail-accent`), Ubicación con mapa, Evidencias con captions, Descripción y 4 filas clave-valor empatan `Detalle_obra.jpg` en lo aplicable (desviaciones solo §6).
- [ ] **CA-02 (Pixel capacitación):** título verbatim, 2 KPI (Fecha/Municipio), mismas secciones y 2 filas clave-valor empatan `Detalle_capacitacion.jpg` en lo aplicable.
- [ ] **CA-03 (Navegación):** tap en tarjeta OBRA → detalle de obra con datos del endpoint de obra; tap en CURSO → detalle de curso; back arrow → `goBack()` al explorador con su estado intacto.
- [ ] **CA-04 (Header dinámico):** Home muestra `INICIO`, Search `BÚSQUEDA` (sin título duplicado en el cuerpo), Detail `DETALLE`; hamburguesa/drawer/logout funcionan en las 3 pantallas; cero cambio de píxel del chrome fuera del texto del título.
- [ ] **CA-05 (Datos y formatos):** inversión formateada `$10,495,378.41`; fecha `4 de julio de 2026`; `progress` se pinta incluso en `0%`; descripción y valores de filas verbatim; título obra Title Case, curso verbatim.
- [ ] **CA-06 (Evidencias):** carrusel horizontal *peek* con captions `evidencia N`; carga lazy sin congelar el scroll; tap → visor modal con la foto grande y cerrar (X y back Android); `galeryUrls` ausente o vacío → «Sin evidencias fotográficas.».
- [ ] **CA-07 (Mapa):** centrado en `latitude/longitude` del DTO con pin guinda; zoom/pan habilitados; el scroll de la pantalla sigue usable (validación física del riesgo §2.9).
- [ ] **CA-08 (Estados):** spinner central durante la carga; error HTTP → «No se pudo cargar el detalle.» sin romper chrome ni navegación.
- [ ] **CA-09 (Regresión):** radar 2b idéntico salvo «Ver más» oculto; Search idéntica salvo header `BÚSQUEDA`, cuerpo sin título y tap de tarjeta navegando; chrome 2a y auth 1.5b idénticos.
- [ ] **CA-10 (Arnés/contrato/deps):** `npx tsc --noEmit` y `npx eslint .` en verde; cero bans; DIP (único importador de detail/infra = `compositionRoot`); paths `/api/v1/app-mobile/obra` y `/api/v1/app-mobile/curso` únicos en su Axios*Api; DTOs espejo de §4.7 con cero `any`; `git diff -- package.json app.json app.config.js` **VACÍO** (cero deps nuevas).

CA-01…09: Tester Visual Humano en iOS + Android. CA-10: Revisor.

## 11. Dependencias de constitución

- `/spec/constitution/mission.md`
- `/spec/constitution/tech-stack.md` §2 (FlashList v2, `expo-image`), §2.3, §2.5, §2.6, §4, §5
- `/spec/constitution/roadmap.md` — Fase 4 (enmienda 2026-10-20) y Fase 5 placeholder
- `/spec/features/core-arch-refactor/spec.md` (baseline de capas)
- `/spec/features/app-shell-menu/spec.md` (chrome; cambio autorizado: `HeaderTitleProvider`)
- `/spec/features/radar-home/spec.md` (radar; cambio autorizado: ocultar «Ver más»)
- `/spec/features/search-bar/spec.md` (explorador; cambios autorizados: header `BÚSQUEDA`, retiro de título del cuerpo, tap de tarjeta navega)
- `/AGENTS.md`

Esta spec es la fuente de verdad de producto de Fase 4. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.
