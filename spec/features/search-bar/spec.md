# SPEC — search-bar

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 3 — Búsqueda Predictiva y Explorador
**Feature:** `search-bar`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** APROBADA por el Humano (2026-10-15) — TASK-01 no inicia hasta autorización explícita en nueva sesión con el Worker; tras ejecutarla, gate de rebuild nativo del Humano (FlashList es módulo nativo)
**Fecha:** 2026-10-15

---

## 1. Propósito

Entregar la **Búsqueda Predictiva y Explorador** de Fase 3: una pantalla `Search` propia en el AppStack (UX tipo Uber/Rappi) con búsqueda global en tiempo real contra el endpoint de producción `GET /api/v1/app-mobile/global-search`, renderizada en un grid de 2 columnas con `FlashList` y scroll infinito paginado.

Esta feature **no reabre** Fase 1 / 1.5a / 1.5b / 2a / 2b. Auth, biometría, chrome (`app-shell`), radar (`home`), DIP, fences ESLint y contratos existentes quedan **congelados**. Clean Architecture + SOLID de `tech-stack.md` §5 aplican desde la primera línea: Fase 3 abre `src/features/search/{domain,application,infrastructure,presentation}` completo.

**Invariante estricta:** cero cambio de píxel del chrome 2a (header con `INICIO`, franja de marca, drawer) y cero cambio visual del radar 2b. Los únicos cambios en features congeladas son **acciones de navegación** (§8): la `RadarSearchBar` del Home se vuelve `Pressable` (mismo píxel) y el ítem «Búsqueda» del drawer navega (mismo píxel).

Fase 4 (ficha/detalle) permanece **bloqueada** hasta que el Revisor audite y el Tester Visual Humano apruebe Fase 3 en dispositivo.

---

## 2. Decisiones del Humano (2026-10-15) — innegociables

1. **Pantalla propia en el stack.** Nueva ruta `Search` en el AppStack. La barra del Home (`RadarSearchBar`) actúa como **falso input**: al tocarla navega a `Search` (patrón Uber/Rappi). El ítem «Búsqueda» del drawer también navega a `Search`.
2. **Chrome intocable.** El back arrow y el título `BÚSQUEDA` viven **en el cuerpo** de la pantalla (fila 1: back + título; fila 2: barra de búsqueda). El `AppHeader` sigue mostrando `INICIO` en todas las pantallas — el «BUSQUEDA» del header del mockup **no se implementa** (desviación §6).
3. **Input real:** `TextInput` con `autoFocus={true}`. Botón **X** a la derecha dentro de la misma pill: limpia el texto, detiene la búsqueda en curso y limpia los resultados, dejando el input listo para reescribir. La X solo es visible cuando hay texto.
4. **Debounce 500 ms** sobre el texto del input. La búsqueda solo se dispara con **3 o más caracteres** (`SEARCH_MIN_CHARS = 3`). Mientras el usuario escribe, los resultados anteriores permanecen (cero flicker).
5. **Contrato real (producción, inmutable):** `GET /api/v1/app-mobile/global-search?search={q}&page={n}&size=10` con Full Text Search nativo (§4.6). `size=10` fijo.
6. **Estados de carga:** `ActivityIndicator` **grande centrado** solo en la primera carga de una búsqueda; `ActivityIndicator` **pequeño al pie** de la lista en páginas subsecuentes. **Contador** con `totalElements` arriba de la lista. **Empty state** cuando `totalElements = 0`. Mensaje de error institucional ante fallo HTTP.
7. **Scroll infinito:** `onEndReached` → siguiente página (`page+1`), concatenando resultados. Sin pull-to-refresh (no está en el mockup).
8. **Tarjetas (grid 2 columnas):** pill de tipo (`Obra`/`Capacitación`) desde el campo `tipo`, imagen con **fallback «Sin imagen»** (contenedor gris + icono + texto) cuando `imagenUrl` ausente, título, ubicación y línea de avance **solo en OBRAS**. El DTO **no trae monto ni fecha** → no se renderizan (§4.7).
9. **Tap en tarjeta → no-op tipado** (detalle = Fase 4; mismo patrón que «Ver más» del popup 2b).
10. **FlashList obligatoria** (`@shopify/flash-list` v2, instalación autorizada). La mención «FlatList» del brief original fue un error gramatical del Humano → se interpreta como el **patrón** de scroll infinito, implementado con FlashList (constitución §2). **`expo-image`** autorizada para las imágenes remotas.
11. **`security-keys` CANCELADA:** el Humano ya rotó las keys en Google Console (2026-10-15); no se requiere task de higiene ni cambio al roadmap por ese motivo.
12. Tipografía **Lato / Lato Bold**. Estilos **inline JS** con `searchPalette` / `palette` / `appPalette` (precedente NativeWind v5). Solo `Pressable`. Cero `any`, `TouchableOpacity`, `FlatList`, `auth-*`.

---

## 3. Entradas y Mockups (Source of Truth visual)

- `spec/features/search-bar/mockups/Busqueda.png` (788×1494) → **única fuente de verdad visual** del cuerpo de la pantalla Search (barra, tarjetas, grid).
- El contrato HTTP real (§4.6) es la **única fuente de verdad de datos**. Donde mockup y contrato discrepan, **manda el contrato** (patrón 2b).

> **DIRECTRIZ PARA EL TRABAJADOR (ANTI-ALUCINACIÓN):** Tokens = §4 + `tech-stack.md` §2.5. Copy, layout y componentes = **§4.5** (transcripción 2026-10-15). Contrato HTTP = **§4.6** (verbatim). Prohibido re-interpretar el PNG, copiar sus textos de relleno (§4.7) ni inventar labels, endpoints o campos (monto, fecha, sugerencias de localidad).

---

## 4. Tokens visuales exactos

Registrados en `/spec/constitution/tech-stack.md` §2.5. Exponer vía `@theme` en `global.css` + `src/shared/theme/tokens.ts` (`searchPalette`).

### 4.1 Cuerpo de la pantalla y barra de búsqueda

- **Fondo del cuerpo:** `search-screen-bg #E8E4D9` (el mapa del mockup está superseded — §6).
- **Fila título:** back arrow Ionicons `arrow-back` (24, `texto #1A1A1A`) + `BÚSQUEDA` `font-lato-bold` `texto #1A1A1A`.
- **Pill de búsqueda:** fondo `search-surface #FFFFFF`, radio alto, sombra/boxShadow sutil (calco de la pill del radar). Lupa Ionicons `search` (20, `texto-suave #5C534C`) a la izquierda; `TextInput` flexible (`lato`, `texto`); X Ionicons `close` (20, `texto-suave`) a la derecha solo si hay texto.

### 4.2 Tarjetas del grid

- **Card:** fondo `search-card-bg #F5F0E8`, esquinas redondeadas (radio 20), overflow oculto. Grid 2 columnas, separación uniforme, padding lateral 16.
- **Imagen:** ancho completo de la card, `aspectRatio` 4:3 (347×263 pt en el mockup), `contentFit="cover"`. **Fallback sin imagen:** contenedor mismo `aspectRatio`, fondo `search-image-placeholder #E4E0D5`, icono Ionicons `image-outline` (28, `search-text-muted`) + texto `Sin imagen` (`lato`, 12, `search-text-muted`).
- **Pill de tipo:** superpuesta top-left sobre la imagen (offset 10), radio alto, padding 4/10, texto blanco `lato-bold` 11. `Obra` → fondo `search-tag-obra #5C7A3F`; `Capacitación` → fondo `search-tag-curso #8B5E2F`.
- **Cuerpo:** padding 12. Título `lato-bold` `texto` (máx 2 líneas). Ubicación: icono `location` (12, guinda `#6B142E`) + texto `lato` `search-text-muted` (1 línea). Avance (solo OBRAS): `lato` `search-text-muted`.

### 4.3 Estados

- **Spinner central:** `ActivityIndicator` grande, guinda `#6B142E`, centrado en el área de resultados.
- **Footer:** `ActivityIndicator` pequeño, guinda, padding vertical 16.
- **Estado inicial / vacío / error:** texto `lato` `search-text-muted` centrado, padding 32 (copy §4.5).

### 4.4 Tipografía (búsqueda)

| Elemento | Tratamiento |
| --- | --- |
| Título pantalla `BÚSQUEDA` | `font-lato-bold`, `texto`, 20 |
| Texto del input | `font-lato`, `texto`, 15 |
| Placeholder del input | `font-lato`, `texto-suave`, 15 |
| Pill de tipo | `font-lato-bold`, blanco, 11 |
| Título de tarjeta | `font-lato-bold`, `texto`, 13, máx 2 líneas |
| Ubicación / avance | `font-lato`, `search-text-muted`, 12 |
| Heading `Resultado de búsqueda` | `font-lato-bold`, `texto`, 18 |
| Contador | `font-lato`, `search-text-muted`, 13 |
| Estados (inicial/vacío/error) | `font-lato`, `search-text-muted`, 14, centrado |

### 4.5 Transcripción literal (2026-10-15) — el Trabajador copia esto, no relee el PNG

**Chrome (2a, congelado):** hamburguesa + `INICIO` + franja guinda con wordmark `Cimientos del Renacimiento`. El mockup muestra `BUSQUEDA` como título del header: **no se implementa** (desviación §6.2); el título vive en el cuerpo.

**Cuerpo, de arriba hacia abajo:**

1. **Fila título** — back arrow `‹` + texto verbatim:

```
BÚSQUEDA
```

2. **Pill de búsqueda** — rectángulo blanco redondeado con sombra. Lupa izquierda, `TextInput` (`autoFocus`), X derecha (solo con texto). Placeholder verbatim:

```
Buscar municipio, localidad, obra o capacitación
```

3. **Fila heading** — visible solo cuando hay búsqueda activa con respuesta: a la izquierda el heading verbatim, a la derecha el contador (`{n} resultados`; `1 resultado` en singular):

```
Resultado de búsqueda
```

4. **Grid de tarjetas** (2 columnas, scroll infinito). Cada tarjeta:
   - Imagen 4:3 con pill de tipo top-left: `Obra` (verde) o `Capacitación` (café).
   - Título en Title Case (el backend envía mayúsculas; §6.6), máx 2 líneas.
   - Línea de ubicación: pin guinda + ubicación formateada (reglas abajo).
   - Línea de avance **solo si el DTO trae `progreso` y `estatus`** (OBRAS): `{progreso}% {estatus}` (reglas abajo).

5. **Fallback de imagen** (cuando `imagenUrl` ausente): contenedor gris con icono + texto verbatim:

```
Sin imagen
```

**Copy de estados (verbatim):**

- Estado inicial (texto < 3 caracteres):

```
Escribe al menos 3 caracteres para buscar obras y capacitaciones.
```

- Empty state (búsqueda activa, `totalElements = 0`):

```
Sin resultados para "{query}".
```

- Error HTTP:

```
No se pudo completar la búsqueda.
```

**Formatos de presentation (reglas, no copy):**

- Título de tarjeta: `toTitleCase(titulo)` (calco del helper de `home/presentation/format.ts`, duplicado en `search` — prohibido importar entre features).
- Ubicación: si `localidad` no es `null` → `{toTitleCase(localidad)}, {toTitleCase(municipio)}`; si es `null` (CURSOS) → `{toTitleCase(municipio)}`.
- Avance: `{progreso}% {toTitleCase(estatus)}` (ej. `75% Iniciada`). Se renderiza **únicamente** cuando `progreso !== null && estatus !== null` (presencia del campo, **no** truthiness: `progreso: 0` → `0% Iniciada` se pinta; regla `rendering-no-falsy-and`, ternarios estrictos).
- Pill de tipo: `tipo === "OBRA"` → `Obra`; `tipo === "CURSO"` → `Capacitación`.
- Contador: `totalElements === 1` → `1 resultado`; en otro caso → `{totalElements} resultados`.

### 4.6 Contrato HTTP (verbatim — inmutable)

`GET /api/v1/app-mobile/global-search` (Bearer vía interceptor de `axiosClient` existente).

Query params: `search` (string, ≥3 caracteres), `page` (entero, base 0), `size=10` (fijo).

Response `200`: Spring `Page<AppMobileGlobalSearchCardDTO>`. Campos consumidos por la app:

```json
{
  "content": [
    {
      "idOriginal": 33,
      "tipo": "OBRA",
      "titulo": "INFRAESTRUCTURA PARA UN DESARROLLO TERRITORIAL ORDENADO Y SOSTENIBLE",
      "municipio": "Mérida",
      "localidad": "MÉRIDA",
      "descripcionCorta": "CONSTRUCCIÓN DE DOMO Y OBRAS COMPLEMENTARIAS EN PARQUE DEL FRACCIONAMIENTO JUAN PABLO II EN EL MUNICIPIO DE MÉRIDA, YUCATÁN.",
      "estatus": "INICIADA",
      "progreso": 75
    }
  ],
  "last": false,
  "totalElements": 20,
  "totalPages": 2,
  "number": 0
}
```

DTO del backend (Java, verbatim — referencia):

```java
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Oculta del JSON los campos nulos
public class AppMobileGlobalSearchCardDTO {
    private Long idOriginal;
    private String tipo; // "OBRA" o "CURSO"
    private String titulo;
    private String municipio;
    private String localidad; // Se omitirá automáticamente en los Cursos
    private String descripcionCorta;
    private String estatus; // Se omitirá automáticamente en los Cursos
    private Integer progreso; // Se omitirá automáticamente en los Cursos
    private String imagenUrl;
}
```

- **Campos opcionales por `@JsonInclude(NON_NULL)`:** `localidad`, `estatus`, `progreso` (ausentes en CURSOS) e `imagenUrl` (ausente cuando no hay imagen). En el wire DTO de TypeScript se declaran **opcionales** (`?:`); el mapper los convierte a `null` (cero `any`).
- `progreso` puede ser `0` (válido; se pinta `0% {estatus}`).
- Campos del `Page` que la app **ignora deliberadamente**: `pageable`, `sort`, `first`, `size`, `numberOfElements`, `empty`. El wire DTO declara solo los 5 campos consumidos (`content`, `totalElements`, `totalPages`, `number`, `last`).
- `content` puede venir vacío. `last: true` → no hay más páginas.
- El DTO **no contiene** monto, fecha ni coordenadas. Prohibido renderizarlos (§4.7).

### 4.7 Artefactos del PNG / campos inexistentes — PROHIBIDO replicar

1. **Dropdown de sugerencias de localidad** («EL CUYO (Localidad en Tizimín)», «EL CUYO MALECÓN», «TIZIMÍN - EL CUYO»): no existe endpoint de autocompletado de localidades; los resultados son **solo tarjetas** OBRA/CURSO (§2.5).
2. **Franja de mapa con pines** bajo la barra: superseded por la decisión del Humano de pantalla limpia (§2.2 / §6.1).
3. **`$3.1 MDP`** (texto dorado en tarjeta Obra): el DTO no trae monto. El token `search-accent #C97C33` queda **reservado** para Fase 4 (§2.5 de tech-stack).
4. **`NOV 12-2025`** (fecha en tarjeta Capacitación): el DTO no trae fecha.
5. **Pin morado `#7044BD`** de la tarjeta Capacitación: artefacto del generador (mismo veredicto que 2b) → guinda `#6B142E`.
6. **Serif** en «Resultado de búsqueda» y títulos de tarjeta → Lato / Lato Bold (constitución).
7. **`BUSQUEDA` como título del header** (sin acento): el chrome está congelado con `INICIO`; el título `BÚSQUEDA` (con acento) vive en el cuerpo (§2.2).
8. **Título de tarjeta Obra en mayúsculas** (`AMPLIACIÓN MALECÓN EL CUYO`) vs Capacitación en Title Case (`Seguridad Turística`): el mockup es inconsistente; se unifica a **Title Case** (§6.6).
9. **Artefactos del generador:** etiqueta `Preview`, guion suelto top-left, labels gibberish del mapa (`Capotódeteres`), bezel y status bar del PNG.
10. **Datos de ejemplo** de las tarjetas (`AMPLIACIÓN MALECÓN EL CUYO`, `95% Concluida`, imágenes): los reales vienen del endpoint.

---

## 5. Flujo de usuario

1. Login / biometría (1.5b intacta) → `Home` (radar 2b intacto) dentro de `AppShell` (chrome 2a intacto).
2. Tap en la `RadarSearchBar` del Home **o** en el ítem «Búsqueda» del drawer → navega a `Search`. El drawer se cierra al navegar.
3. `Search` monta con `autoFocus` en el input (teclado abierto). Cuerpo `search-screen-bg`; sin mapa. Estado inicial: mensaje de ayuda (§4.5).
4. El usuario escribe. A los **500 ms** sin teclear y con **≥3 caracteres** → `GET .../global-search?search={q}&page=0&size=10`. Spinner central grande durante la primera carga. Si el usuario sigue escribiendo, los resultados previos permanecen (`keepPreviousData`).
5. Respuesta → heading `Resultado de búsqueda` + contador + grid de tarjetas. `totalElements = 0` → empty state con la query.
6. Scroll al final (`onEndReached`) → si `last = false`, `page+1` se concatena; spinner pequeño al pie mientras carga. `last = true` → no se piden más páginas.
7. **X** → limpia texto y resultados, cancela la petición en curso (AbortSignal de TanStack Query) y vuelve al estado inicial. El input conserva el foco.
8. **Back arrow** → `navigation.goBack()` al radar. El estado de la búsqueda se conserva mientras la pantalla siga en el stack (volver a entrar desde el Home remonta limpio).
9. Tap en tarjeta → feedback `pressed`, **cero** navegación (Fase 4). Drawer del chrome funciona igual que 2a por encima de la pantalla.
10. Error HTTP → mensaje institucional «No se pudo completar la búsqueda.» (sin bloquear chrome ni navegación).

---

## 6. Desviaciones aprobadas del mockup

1. **Pantalla limpia sin mapa** (decisión Humano §2): la franja de mapa del PNG no se implementa; fondo `search-screen-bg`.
2. **`BÚSQUEDA` en el cuerpo, no en el header** (decisión Humano §2.2): el chrome 2a está congelado mostrando `INICIO`; el mockup muestra `BUSQUEDA` en el header. El título (con acento) se pinta en la fila 1 del cuerpo junto al back arrow.
3. **Back arrow en el cuerpo** (decisión Humano §2.2): el mockup no muestra back arrow; se añade en la fila título (`navigation.goBack()`).
4. **Sin dropdown de sugerencias** (§4.7.1): el endpoint devuelve tarjetas, no localidades.
5. **Lupa e iconos grises del PNG** → `texto-suave #5C534C`; pin de ubicación → guinda `#6B142E`; pills de tipo con los hex muestreados §2.5.
6. **Título de tarjeta en Title Case** (unificado; el PNG mezcla MAYÚSCULAS y Title Case).
7. **Serif → Lato / Lato Bold** (constitución; precedente 1.5a).
8. El bezel/status bar del PNG no se pinta (igual que 2a/2b).
9. **Sin monto ni fecha** en tarjetas (campos inexistentes en el DTO; §4.7.3–4).

---

## 7. Reglas superseded

| Regla original | Nuevo comportamiento |
| --- | --- |
| Roadmap §3 original: barra con autocompletado de localidades («EL CUYO») y resultados por localidad/municipio | Búsqueda global FTS contra `GET /api/v1/app-mobile/global-search`; resultados = tarjetas OBRA/CURSO paginadas (enmienda 2026-10-15) |
| Roadmap §3 original: tarjetas con avance **y monto invertido** | El DTO real no trae monto → tarjetas con avance (solo OBRAS), tipo, título y ubicación |
| `RadarSearchBar` no-op (spec 2b §2.4: «solo visual») | `RadarSearchBar` = falso input `Pressable` que navega a `Search` (mismo píxel) |
| Ítem «Búsqueda» del drawer `noop` (spec 2a) | Ítem «Búsqueda» navega a `Search` (mismo píxel) |
| `search-keys`/higiene POST-2B como gate de Fase 3 | CANCELADA por el Humano (2026-10-15): keys ya rotadas en Google Console |

Todo lo no listado permanece intacto (auth, SecureStore, chrome 2a, radar 2b, `NavigationContainer key={status}`, DIP, fences).

---

## 8. Arquitectura (Fase 3 — feature completo, 4 capas)

- `src/features/search/domain/` — entidades `SearchCard` / `SearchPage`, puerto `SearchRepository`, error `SearchError`. Cero imports de Expo/Axios/React/TanStack/FlashList.
- `src/features/search/application/` — use case closure `globalSearch` + `SearchUseCases`. Cero imports de infra.
- `src/features/search/infrastructure/` — `dto.ts` (wire espejo de §4.6), `AxiosGlobalSearchApi` (implementa `SearchRepository`; único archivo con el path del endpoint).
- `src/features/search/presentation/` — `SearchProvider` (texto + debounce + use cases por props), `useSearch` (fachada única, calco `useHomeRadar`), `SearchScreen`, `SearchInputBar`, `SearchResultCard`, `SearchEmptyState`, `format.ts`.
- `src/app/compositionRoot.ts` — añade `createSearchUseCases()` (único importador de la infra de search).
- `App.tsx` — envuelve `SearchProvider` dentro de `HomeProvider`.
- `RootNavigator` / `types.ts` — ruta `Search: undefined` en `AppStackParamList`; el navigator no aloja UI de búsqueda.
- **Cambios en features congeladas (solo acciones, cero píxel):** `home/presentation/RadarSearchBar.tsx` se envuelve en `Pressable` que navega; `app-shell/presentation/menuItems.ts` (acción `search`) y `app-shell/presentation/AppDrawer.tsx` (navega + cierra).
- Estado de servidor: **TanStack Query** (`useInfiniteQuery` sobre el use case, `queryKey` con la query debounced, `placeholderData: keepPreviousData`). Cero estado duplicado. El texto crudo del input y su debounce viven en `SearchProvider` (estado UI, no de servidor).
- Fences ESLint: `@shopify/*` y `expo-image` prohibidos en `domain`/`application` (añadidos a los bans existentes); permitidos **solo** en `presentation` (son UI).
- Cero barrels `index.ts`. Cero `any`. Solo `Pressable`. Cero fixture de datos en código.

---

## 9. Límites (qué NO se toca)

**ESTÁ ESTRICTAMENTE PROHIBIDO:**

- Detalle de obra/curso / ficha / Cloudflare gallery (Fase 4). Autocompletado de localidades (no existe endpoint). Mapa en la pantalla Search.
- Cambiar máquina de estados auth, DTOs login, claves SecureStore, chrome `app-shell` (salvo las 2 acciones de navegación de §8, cero píxel), radar `home` (salvo el `Pressable` de §8, cero píxel).
- Pedir o sugerir reescrituras del backend (mission §4). El contrato §4.6 es inmutable.
- Añadir dependencias distintas de `@shopify/flash-list` + `expo-image` (autorizadas §2.10). Expo Router. Código `.swift`/`.kt`/`.java`/`.pbxproj`/`Info.plist`/`AndroidManifest.xml` a mano.
- `TouchableOpacity`, `FlatList`, `any`, emojis, fuentes ≠ Lato, paleta `auth-*`, `search-accent`, `estimatedItemSize`, `Image` de react-native para las imágenes de tarjetas.
- Renderizar monto, fecha, `descripcionCorta` ni coordenadas en las tarjetas (el mockup no los muestra / el DTO no los trae para ese fin).
- Correr `npx expo start` (reservado al Humano).

---

## 10. Criterios de Aceptación (CA)

- [ ] **CA-01 (Pixel cuerpo Search):** fila título (back + `BÚSQUEDA`), pill de búsqueda, heading + contador y grid de tarjetas empatan `Busqueda.png` en lo aplicable (desviaciones solo §6; el mapa y el dropdown del PNG no aplican).
- [ ] **CA-02 (Barra y navegación):** `autoFocus` al entrar; X limpia texto + resultados y conserva foco (solo visible con texto); back arrow → `goBack()` al radar; tap en `RadarSearchBar` del Home y en «Búsqueda» del drawer navegan a `Search` (el drawer se cierra).
- [ ] **CA-03 (Debounce y estados):** búsqueda solo con ≥3 caracteres tras 500 ms sin teclear; spinner central grande en primera carga; resultados previos se conservan mientras se escribe; contador con `totalElements`; empty state con la query; error institucional ante fallo HTTP.
- [ ] **CA-04 (Tarjetas):** pill `Obra`/`Capacitación` con colores §2.5; fallback «Sin imagen» cuando `imagenUrl` ausente; título Title Case máx 2 líneas; ubicación `localidad, municipio` (o solo `municipio` en CURSOS); avance `{progreso}% {estatus}` solo cuando ambos campos presentes (`0%` se pinta); cero monto/fecha; tap no-op.
- [ ] **CA-05 (Scroll infinito):** `onEndReached` concatena `page+1` sin duplicados; spinner pequeño al pie solo mientras carga la siguiente página; `last: true` detiene la paginación; FlashList con grid de 2 columnas.
- [ ] **CA-06 (Regresión):** chrome 2a (header `INICIO`, franja, drawer, logout) y radar 2b (pines, chips, popup, ripple, etiqueta) y flujos auth 1.5b idénticos; cero cambio de píxel en `app-shell` y `home` (solo acciones de navegación de §8).
- [ ] **CA-07 (Cancelación):** X durante una carga cancela la petición en curso (AbortSignal) y vuelve al estado inicial sin mostrar error.
- [ ] **CA-08 (Arnés):** `npx eslint .` y `npx tsc --noEmit` en verde. Cero `any` / `TouchableOpacity` / `FlatList` / `expo-router`. DIP intacto; único importador de infra de search = `compositionRoot.ts`.
- [ ] **CA-09 (Dependencias):** `package.json` suma **únicamente** `@shopify/flash-list` + `expo-image` (vía `npx expo install`). `app.json`/`app.config.js` **sin cambios** (ninguna de las dos deps requiere plugin).
- [ ] **CA-10 (Contrato):** wire DTO espejo de §4.6 (campos opcionales `localidad`/`estatus`/`progreso`/`imagenUrl` como `?:`); path exacto `/api/v1/app-mobile/global-search` único en `AxiosGlobalSearchApi.ts`; `size=10` fijo; cero `any` en mappers.

CA-01…07: Tester Visual Humano en iOS + Android. CA-08…10: Revisor.

---

## 11. Dependencias de constitución

- `/spec/constitution/mission.md`
- `/spec/constitution/tech-stack.md` §2 (FlashList v2, `expo-image`), §2.5, §5
- `/spec/constitution/roadmap.md` — Fase 3 (enmienda 2026-10-15)
- `/spec/features/core-arch-refactor/spec.md` (baseline de capas)
- `/spec/features/app-shell-menu/spec.md` (chrome congelado, invariante)
- `/spec/features/radar-home/spec.md` (radar congelado; `RadarSearchBar` solo cambia de no-op a navegación)
- `/AGENTS.md`

Esta spec es la fuente de verdad de producto de Fase 3. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.
