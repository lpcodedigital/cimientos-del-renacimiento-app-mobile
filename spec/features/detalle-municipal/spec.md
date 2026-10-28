# SPEC — detalle-municipal (Fase 5: Detalle Municipal)

> **Estado:** ESCRITA (2026-10-28) por el Orquestador. Pendiente de aprobación del Humano. **SIN mockup propio** (decisión Humano): fuente visual = `spec/features/radar-home/mockups/inicio.png`. **Contrato HTTP MARCADO PENDIENTE** (§4.2): bloqueante para la TASK de infrastructure.
> Solo se escribe `spec.md` en este Paso 0. El `plan.md` y `task.md` se redactan cuando la Fase 4.5 esté auditada y aprobada por el Humano (regla de bloqueo del roadmap).

## 1. Objetivo

Reactivar el «Ver más» del popup KPI municipal del radar (2b, oculto en Fase 4) para abrir la pantalla **`MunicipioDetalle`**: un mapa estilo radar con **todas las obras y capacitaciones del municipio seleccionado** (marcadores por lat/lng), donde cada marcador abre un popup resumen con «Ver más detalle» que navega a la pantalla `Detail` existente (Fase 4) para ver la ficha completa con galería.

## 2. Decisiones del Humano (2026-10-28)

1. **Endpoint aún NO definido:** el Humano lo definirá con el backend más adelante. El contrato (path + DTO + JSON de ejemplo) queda **MARCADO PENDIENTE** (§4.2) y es **bloqueante** para la TASK de `infrastructure` — mismo rito que Fase 4 (contratos verbatim antes de codificar).
2. **Sin mockup:** «podemos usar el mismo estilo de diseño que se usó en el inicio, ya que básicamente es lo mismo pero con información más específica». Fuente visual: `inicio.png` (radar 2b) + tokens `radar-*` vigentes (tech-stack §2.4). Cero tokens nuevos anticipados.
3. **Header con flecha back** (no hamburguesa) en `MunicipioDetalle`, igual que Search/Detail: consume el patrón `leftMode "back"` de **Fase 4.5** (dependencia dura — por eso Fase 5 va después). Título dinámico = nombre del municipio (MAYÚSCULAS, vía `setTitle`).
4. **Reutilización de `Detail` confirmada:** `Detail` conserva sus params `{ tipo: "OBRA" | "CURSO"; id: number }` **sin cambios**. Al llegar desde `MunicipioDetalle`, el back del header (`navigation.goBack()`, Fase 4.5) **regresa a `MunicipioDetalle`** (no a Search): el stack conserva la pantalla municipal debajo. No se personaliza nada adicional en Detail.
5. **Datos mínimos por ítem del endpoint** (enumeración del Humano): `id`, `tipo` (obra/capacitación), `nombre`, `descripcion`, `localidad`, `municipio`, `avance`, `latitude`, `longitude` — «solo lo necesario» para pintar marcadores y el popup, y para navegar a Detail con `{ tipo, id }`.
6. **El botón del callout se reactiva** (`SHOW_SEE_MORE` pasa a visible; código intacto de Fase 4) y ahora navega (antes no-op).

## 3. Insumos

- Feature congelada de referencia: `home` (2b) — `RadarMap.tsx` (patrón de `MapView` + markers + `animateToRegion`/`fitToCoordinates` vía ref), `MunicipioCallout.tsx` (`SHOW_SEE_MORE` en línea ~113), `HomeProvider` (estado de cámara/popup), `format.ts` (`formatMdp`).
- `src/app/navigation/types.ts` y `RootNavigator.tsx` (patrón de registro de pantallas en AppStack, calcado de Fase 3/4).
- Patrón de header back + título dinámico: Fase 4.5 (`nav-back-mapa-tools`), **prerequisito cerrado**.
- Paleta `radar-*` (tech-stack §2.4) + `guinda`/`dorado` Fase 1.

## 4. Diseño

### 4.1 Pantalla `MunicipioDetalle` (estilo radar, sin mockup)

- **Chrome:** header del chrome con `←` (leftMode `"back"`, Fase 4.5) + título dinámico = `municipio` en MAYÚSCULAS (`toTitleCase` + toUpperCase según patrón del radar; decisión de copy final en plan). Franja de marca intacta.
- **Mapa:** `react-native-maps` `PROVIDER_GOOGLE` a pantalla completa (flex: 1), calcado de `RadarMap` (sin chips de municipios, sin etiqueta de dispositivo, sin barra de búsqueda — es información de UN solo municipio). Cámara inicial: `fitToCoordinates` sobre todos los marcadores (edgePadding como en radar) o centrada en el municipio si no hay ítems.
- **Marcadores:** uno por ítem del endpoint, con `pinColor` guinda `#6B142E` para obras y dorado `#C4A35A` para capacitaciones (semántica consistente con §2.4: guinda = gobierno/obras, dorado = distintivo; sujeto a validación visual del Humano).
- **Popup de marcador:** card estilo `MunicipioCallout` (misma familia visual) con: nombre del ítem, localidad, avance (`{avance}%` solo en obras), y botón pill guinda **«Ver más detalle»** → `navigate("Detail", { tipo, id })`. `X` cierra el popup.
- **Estados:** spinner central guinda en carga; error institucional («No se pudo cargar el detalle del municipio.» — copy por fijar en plan); vacío institucional si el municipio no tiene ítems.
- **Rendimiento:** marcadores con datos ya en memoria (una sola consulta); sin listas largas; skills de `.agents/skills` obligatorias.

### 4.2 Contrato HTTP — **MARCADO PENDIENTE (BLOQUEANTE)**

> El Humano entregará: path exacto, método, DTO verbatim y JSON de ejemplo real (como Fase 4 §4.7). Hasta entonces esta sección es placeholder normativo:

- **Endpoint:** `PENDIENTE — por definir por el Humano/backend` (preliminar conceptual: `GET /api/v1/app-mobile/municipio/{municipio}` o equivalente; **no codificar contra esta forma**, es solo referencia de planeación).
- **Shape preliminar de ítem** (enumeración del Humano 2026-10-28, sujeto al DTO real):
  `id: number`, `tipo: "OBRA" | "CURSO"`, `nombre: string`, `descripcion: string`, `localidad: string`, `municipio: string`, `avance: number | null` (solo obras), `latitude: number`, `longitude: number`.
- **Regla:** la TASK de `infrastructure` (DTO espejo + Axios*Api + mapper) NO arranca sin el contrato verbatim aprobado. Domain/application/presentation/navegación SÍ pueden construirse antes contra el puerto de dominio (§5).

### 4.3 Cambios en features congeladas (mínimos)

- `home/presentation/MunicipioCallout.tsx`: `SHOW_SEE_MORE` → visible; el botón «Ver más» pasa de no-op a `onVerDetalle(municipio.nombre)` (prop nueva o `useNavigation` tipado — lo fija el plan). Copy del botón: «Ver más» vigente; renombrar a «Ver detalle» es cambio de copy autorizable en el plan.
- `src/app/navigation/types.ts`: `+ MunicipioDetalle: { municipio: string }`.
- `src/app/navigation/RootNavigator.tsx`: `+ <AppStack.Screen name="MunicipioDetalle" …>` tras `Detail`.
- `compositionRoot.ts` + `App.tsx`: factory `createMunicipioUseCases` + `MunicipioProvider` (calco de Fases 3/4).

## 5. Arquitectura (anticipada — 4 capas, calco Fases 3/4)

- `src/features/municipio/domain/`: entidad `MunicipioMapaItem` (shape §4.2 preliminar), error `MunicipioError` (calco `SearchError`/`DetailError`), puerto `MunicipioDetalleRepository` (`getItemsByMunicipio(municipio, signal?)`).
- `src/features/municipio/application/`: `types.ts` + use case closure `createLoadMunicipioDetalle`.
- `src/features/municipio/infrastructure/`: **BLOQUEADA hasta contrato** — `dto.ts` espejo + `AxiosMunicipioDetalleApi.ts` (path único, `ERR_CANCELED` re-lanzado, calco de adapters Fase 4).
- `src/features/municipio/presentation/`: `MunicipioProvider`/`useMunicipio` (calco), `MunicipioDetalleScreen.tsx` (mapa + marcadores + popup + header back/título), subcomponentes según plan.
- `compositionRoot.ts` único importador de infrastructure; TanStack Query (`useQuery` con `queryKey ["municipio", "detalle", municipio]`); fences ESLint vigentes (`react-native-maps` solo en el componente de mapa de la feature).

## 6. Límites (qué NO se toca)

- `Detail` y todo `detail/`: intacto (se reutiliza tal cual; params sin cambios).
- Radar (2b): intacto salvo el botón «Ver más» de `MunicipioCallout.tsx`.
- Chrome: intacto (consume el patrón de Fase 4.5 ya cerrado; no se re-modifica `AppHeader`).
- Contrato `mapa-home` (2b) y `global-search` (3): intactos.
- Cero dependencias nuevas anticipadas (react-native-maps ya autorizado).

## 7. Criterios de Aceptación (preliminares — se afianzan en plan.md)

- **CA-01:** tap en «Ver más» del popup KPI municipal → navega a `MunicipioDetalle` del municipio seleccionado.
- **CA-02:** header muestra `←` + nombre del municipio; sin hamburguesa; `←` regresa al Home (radar) con su estado previo.
- **CA-03:** el mapa encuadra todos los marcadores del municipio al entrar; pines guinda (obras) / dorado (capacitaciones).
- **CA-04:** tap en marcador → popup con nombre/localidad/avance + «Ver más detalle»; `X` cierra.
- **CA-05:** «Ver más detalle» → `Detail` con la ficha completa (galería incluida); `←` desde Detail regresa a `MunicipioDetalle` (no a Search).
- **CA-06:** estados de carga/error/vacío institucionales.
- **CA-07 (arnés/gates):** tsc/eslint verde; bans = 0; deps = cero nuevas; contrato único (path en un solo archivo); diff de features congeladas acotado a §4.3.
- **CA-08 (bloqueante de arranque de infra):** contrato verbatim del endpoint aprobado y asentado en §4.2 antes de codificar `infrastructure`.

## 8. Dependencias de constitución

- roadmap.md Fase 5 (reescrita 2026-10-28; regla de bloqueo: Fase 4.5 auditada + aprobada, y spec aprobada).
- tech-stack.md §2.4 (paleta radar), §2.7 (header back), §5 (Clean Architecture), §4 (API inmutable: la app no propone reescrituras del backend; el endpoint lo define el Humano).
- Precedentes: Fase 3 (search-bar) y Fase 4 (detail-obra-curso) como molde de capas, providers, adapters y arnés.
