# TASKS — nav-back-mapa-tools (Fase 4.5)

> **Estado global:** spec.md **APROBADA por el Humano (2026-10-28)** → TASK-01 **COMPLETED (2026-10-28)** (rebuild nativo + CA-08 validados por el Humano) → TASK-02 **COMPLETED (2026-10-28)** (superseded por TASK-02b) → TASK-02b **COMPLETED (2026-10-28)** (header derivado por ruta activa; Humano validó Android sin flash + back al primer toque, iOS sin regresión, drawer operativo en Home; limitación residual Android aceptada y documentada en spec §6.1) → **TASK-03 DESBLOQUEADA, pendiente de ejecución por el Worker en nueva sesión** → TASK-04 BLOQUEADA hasta cerrar TASK-03. El Trabajador SOLO puede tocar los `allowed_files` de la TASK activa. El Revisor ejecuta el arnés al cierre de cada TASK (tsc + eslint) y la auditoría completa en TASK-04. El rebuild nativo y la validación visual/funcional en físico son EXCLUSIVOS del Humano.

## TASK-01 — Config iOS: expo-dev-client + LSApplicationQueriesSchemes

- **Objetivo:** corregir el «No script URL provided» del cold start iOS instalando `expo-dev-client` y habilitar la detección de apps de mapas (TASK-03) vía `LSApplicationQueriesSchemes`. Cero código de producto.
- **Secuencia:**
  1. [x] `npx expo install expo-dev-client` (NUNCA `npm i`).
  2. [x] Editar `app.json`: en `ios.infoPlist` añadir `"LSApplicationQueriesSchemes": ["comgooglemaps", "waze"]` (junto a `NSFaceIDUsageDescription`, intacta). Plan §3.
  3. [x] `npx tsc --noEmit` → exit 0.
  4. [x] Verificar gates: `git diff -- app.config.js` VACÍO; `git diff -- package.json` = SOLO `expo-dev-client` (+ lockfile).
  5. [x] **PARADA Y HANDOFF AL HUMANO:** el Humano ejecuta `npx expo prebuild` + `npx expo run:ios` + `npx expo run:android` y valida CA-08 (instalación limpia → primer arranque en frío sin pantalla roja; Android sin regresión).
- **allowed_files_to_edit:** `package.json`, `app.json` (+ lockfile vía expo install).
- **Status:** COMPLETED (2026-10-28) — rebuild nativo iOS/Android OK y CA-08 validado por el Humano (cold start iOS sin pantalla roja; Android sin regresión).

## TASK-02 — Header con modo back (app-shell + 3 screens)

- **Objetivo:** extender `HeaderTitleProvider` con `leftMode "menu" | "back"`, renderizar el back arrow en `AppHeader` cuando `leftMode === "back"`, y actualizar los setters de Home/Search/Detail eliminando las flechas del cuerpo. Verbatim: plan §4.
- **Secuencia:**
  1. [x] `HeaderTitleProvider.tsx`: añadir `HeaderLeftMode`, `leftMode`, `setLeftMode` (plan §4.1 verbatim).
  2. [x] `AppHeader.tsx`: ternario back/hamburguesa + `useNavigation` tipado (plan §4.3 verbatim).
  3. [x] `HomeScreen.tsx`: `useFocusEffect` setea `setTitle("INICIO")` + `setLeftMode("menu")` (plan §4.4).
  4. [x] `SearchScreen.tsx`: setea `setTitle("BÚSQUEDA")` + `setLeftMode("back")`; elimina la fila de back arrow del cuerpo y los imports huérfanos (plan §4.4).
  5. [x] `DetailScreen.tsx`: setea `setTitle("DETALLE")` + `setLeftMode("back")`; elimina la fila de back arrow del cuerpo y los imports huérfanos (plan §4.4).
  6. [x] Arnés: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings (cero `no-unused-vars` por imports huérfanos).
  7. [x] Verificación: `git diff --stat -- src/features` = SOLO los 5 archivos de código de esta task; greps: cero `arrow-back` en cuerpos de Search/Detail; `AppStackParamList` importado solo en `AppHeader.tsx` (app-shell) y preexistentes.
- **allowed_files_to_edit:**
  - `src/features/app-shell/presentation/HeaderTitleProvider.tsx`
  - `src/features/app-shell/presentation/AppHeader.tsx`
  - `src/features/home/presentation/HomeScreen.tsx`
  - `src/features/search/presentation/SearchScreen.tsx`
  - `src/features/detail/presentation/DetailScreen.tsx`
- **Status:** COMPLETED (2026-10-28) — 7/7 pasos ejecutados; tsc/eslint exit 0 sin warnings; diff acotado a los 5 archivos. Humano validó CA-01…CA-05 en Android + iOS. **Limitación conocida detectada por el Humano (2026-10-28):** en Android el header muestra por unos ms el estado anterior (hamburguesa + «INICIO») al entrar a Search/Detail y la flecha de volver se percibe lenta / requiere varios toques (causa: setters por `useFocusEffect` post-foco + transición nativa Android; iOS fluido). **SUPERSEDED por TASK-02b (enmienda aprobada por el Humano 2026-10-28):** el mecanismo cambia a derivación por ruta activa (plan §4b); la limitación queda como motivo documentado del hotfix.

## TASK-02b — Hotfix: header derivado por ruta activa (ENMIENDA 2026-10-28)

- **Objetivo:** eliminar el flash del estado previo del header en Android cambiando el mecanismo de «setters por foco» a **derivación por ruta activa** (evento `"state"` del container raíz + mapa `HEADER_BY_ROUTE`), y eliminar `HeaderTitleProvider`/`useHeaderTitle`. Verbatim: plan §4b. Spec §4.1 enmendado. Cero dependencias nuevas.
- **Secuencia:**
  1. [x] `AppHeader.tsx`: reescribir con derivación por ruta (plan §4.1b verbatim — mapa `HEADER_BY_ROUTE` hoisted, `resolveRouteName`, `useState` inicial + `addListener("state")`). **PROHIBIDO `useNavigationState`** (crashea fuera del navigator — spec §3).
  2. [x] `AppShell.tsx`: eliminar import y wrapper `<HeaderTitleProvider>` (plan §4b.2 verbatim).
  3. [x] `HomeScreen.tsx`: eliminar el `useFocusEffect` de título/modo + imports huérfanos (`useHeaderTitle`, `useFocusEffect`, `useCallback` si queda sin uso).
  4. [x] `SearchScreen.tsx`: idem. NO reaparecer la fila de back del cuerpo.
  5. [x] `DetailScreen.tsx`: idem. `route`, queries y contenido intactos.
  6. [x] Borrar `HeaderTitleProvider.tsx` y `useHeaderTitle.ts` (`rm`; sin shims ni re-exports).
  7. [x] Arnés: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings.
  8. [x] Verificación: greps = 0 para `useHeaderTitle` / `HeaderTitleProvider` / `setLeftMode` en `src/`; `git diff --stat -- src/` = SOLO los 5 editados + 2 eliminados; `git diff -- package.json app.json app.config.js` VACÍO.
  9. [x] **HANDOFF AL HUMANO:** validación física — Android: al entrar a Search/Detail el header muestra `←` + título correcto DESDE el inicio de la transición (sin flash de `INICIO`/hamburguesa) y el back responde al primer toque; iOS: sin regresión; drawer operativo en Home.
- **allowed_files_to_edit:**
  - `src/features/app-shell/presentation/AppHeader.tsx`
  - `src/features/app-shell/presentation/AppShell.tsx`
  - `src/features/home/presentation/HomeScreen.tsx`
  - `src/features/search/presentation/SearchScreen.tsx`
  - `src/features/detail/presentation/DetailScreen.tsx`
  - `src/features/app-shell/presentation/HeaderTitleProvider.tsx` (ELIMINAR)
  - `src/features/app-shell/presentation/useHeaderTitle.ts` (ELIMINAR)
- **Status:** COMPLETED (2026-10-29) — Worker ejecutó los 9 pasos: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings; greps = 0 (`useHeaderTitle`/`HeaderTitleProvider`/`setLeftMode`/`setTitle(` en `src/`); `git diff --stat -- src/` = SOLO los 5 editados + 2 eliminados (7 files, 46 insertions, 113 deletions); `git diff -- package.json app.json app.config.js` VACÍO. **Humano validó en físico (2026-10-29):** Android mejoró mucho — sin flash, transición y flecha correctas; iOS validado sin regresión; drawer operativo en Home. **Limitación residual aceptada y documentada (spec §6.1):** en Android, un toque al `←` durante la transición nativa o el pico de montaje puede ser descartado por la plataforma (re-tap inmediato funciona) — comportamiento inherente de react-native-screens, no defecto. TASK-03 DESBLOQUEADA.

## TASK-03 — Herramientas del mapa de Detail (recentrar + Abrir en Maps)

- **Objetivo:** dotar a `DetailMapCard` de botón flotante de recentrado y fila «Abrir en Maps» con `openExternalMap.ts`. Verbatim: plan §5. Cero dependencias nuevas (`Linking`/`Alert`/`Platform` son RN core; `Ionicons` ya autorizado).
- **Secuencia:**
  1. [x] Crear `src/features/detail/presentation/openExternalMap.ts` (plan §5.1 verbatim).
  2. [x] Reescribir `src/features/detail/presentation/DetailMapCard.tsx` (plan §5.2 verbatim): `ref` de MapView + `handleRecenter` (`animateToRegion`, deltas 0.02, 600 ms) + botón flotante `locate` + fila «Abrir en Maps» (`navigate-outline` + Lato Bold guinda).
  3. [x] Arnés: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings.
  4. [x] Verificación: greps — `react-native-maps` solo en `DetailMapCard.tsx` (+ `RadarMap.tsx` preexistente); `Linking`/`Platform`/`Alert` de detail solo en `openExternalMap.ts`; `git diff -- package.json app.json app.config.js` VACÍO en esta task.
  5. [x] **HANDOFF AL HUMANO:** validación física CA-06 (recentrar anima al pin) y CA-07 (iOS: selector con apps instaladas; Android: chooser nativo; cancelar no crashea).
- **allowed_files_to_edit:**
  - `src/features/detail/presentation/openExternalMap.ts` (nuevo)
  - `src/features/detail/presentation/DetailMapCard.tsx`
- **Status:** COMPLETED (2026-10-29) — **VALIDADO EN FÍSICO POR EL HUMANO en Android + iOS: CA-06 y CA-07 correctos** (recentrar anima de regreso al pin; «Abrir en Maps» abre el selector/chooser y la app elegida muestra la coordenada; Cancelar no crashea). Worker ejecutó los 5 pasos: `openExternalMap.ts` creado verbatim de plan §5.1 (Android `geo:` con label `encodeURIComponent` + catch → `Alert.alert("Mapas", "No se encontró una aplicación de mapas disponible.")`; iOS `canOpenURL` de `comgooglemaps://` y `waze://` con try/catch → `false` + `Alert.alert("Abrir en Maps", undefined, botones)` con Apple Maps siempre, Google Maps/Waze condicionales y Cancelar `style: "cancel"`); `DetailMapCard.tsx` reescrito verbatim de plan §5.2 (ref `useRef<MapView>(null)` + botón flotante 40×40 `locate` dentro del contenedor del mapa → `animateToRegion` deltas 0.02/600 ms + fila «Abrir en Maps» bajo el mapa `navigate-outline` + Lato Bold guinda → `void openExternalMap(...)`; estilos hoisted `as const`). Arnés: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 (0 errores, 0 warnings). Greps: `react-native-maps` SOLO en `DetailMapCard.tsx:4` + `src/features/home/presentation/RadarMap.tsx:2` (preexistente); `Linking`/`Platform`/`Alert` en `src/features/detail` SOLO en `openExternalMap.ts`; bans (`any`/`TouchableOpacity`/`FlatList`/`expo-router`/`className`) = 0 en los 2 archivos; `git diff -- package.json app.json app.config.js` VACÍO; `git status --porcelain -uall` = SOLO `M DetailMapCard.tsx` + `?? openExternalMap.ts`. Cero deps, cero configs, cero nativos, cero `npx expo start`/`prebuild`/`run:*`, cero commit. **Humano validó en físico (2026-10-29):** CA-06 OK y CA-07 OK en Android + iOS. Cero deps, cero configs, cero nativos, cero commit. TASK-03 COMPLETED → **TASK-04 DESBLOQUEADA**.

## TASK-04 — Arnés / auditoría (solo lectura)

- **Objetivo:** auditoría completa de la fase, cero cambios de código de producto. Criterios: spec §9 (CA-01…CA-10) y plan §7.
- **Secuencia:**
  1. [ ] `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0 sin warnings.
  2. [ ] Bans (git grep sobre `src/**/*.ts(x)` + `App.tsx`): `any` = 0, `TouchableOpacity` = 0, `FlatList` = 0, `expo-router` = 0, `estimatedItemSize` = 0, `className` en archivos tocados = 0.
  3. [ ] Gates deps/config vs baseline pre-Fase-4.5: `package.json` = SOLO `expo-dev-client`; `app.json` = SOLO `LSApplicationQueriesSchemes`; `app.config.js`/`eslint.config.js`/`metro.config.js`/`babel.config.js` VACÍO.
  4. [ ] Features congeladas: diff acotado EXACTO a los allowed_files de TASK-01…03 (incluyendo las 2 eliminaciones de TASK-02b); `AppDrawer.tsx`, `AppBrandBar.tsx`, `menuItems.ts`, `RootNavigator.tsx`, `navigation/types.ts`, radar, contenidos de detail, componentes de search, domain/application/infrastructure, `compositionRoot.ts`, `App.tsx` SIN CAMBIOS. `AppShell.tsx` solo con el cambio de TASK-02b (retiro del wrapper).
  5. [ ] Confirmar CA-01…CA-05 por inspección de código; CA-06…CA-08 quedan firmados por el Humano en físico.
  6. [ ] Actualizar `progress/current-task.json` + `progress/history.md` con el resultado de la auditoría.
- **allowed_files_to_edit:** `spec/features/nav-back-mapa-tools/task.md`, `progress/current-task.json`, `progress/history.md`.
- **Status:** TODO — DESBLOQUEADA (gate cumplido: TASK-03 COMPLETED + validación física del Humano 2026-10-29; pendiente de autorización explícita para iniciar).

##

TASK-04 no ejecutada. Prompt para la nueva sesión:
MODO: TRABAJADOR/REVISOR (Execution Agent) — AUDITORÍA DE SOLO LECTURA.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN 0.86 + TS strict + NativeWind v5 + React Navigation 7 + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés de control).
2. progress/current-task.json (estado vivo: active_feature nav-back-mapa-tools, TASK-04 TODO DESBLOQUEADA).
3. spec/features/nav-back-mapa-tools/task.md — SOLO la sección TASK-04.
4. spec/features/nav-back-mapa-tools/plan.md — SOLO §7 (criterio de hecho) y §8 (prohibiciones recordatorio).
5. spec/features/nav-back-mapa-tools/spec.md — §8 (arquitectura/features congeladas), §9 (CA-01…CA-10) y §6/§6.1 (reglas superseded + limitación residual Android aceptada).

CONTEXTO YA CERRADO (NO re-ejecutar, NO repetir pruebas físicas):
- TASK-01 COMPLETED (expo-dev-client ~57.0.20 + LSApplicationQueriesSchemes; rebuild y CA-08 validados por el Humano 2026-10-28).
- TASK-02b COMPLETED (header derivado por ruta activa: HEADER_BY_ROUTE + addListener("state") en AppHeader; HeaderTitleProvider.tsx y useHeaderTitle.ts ELIMINADOS). Humano validó Android sin flash + iOS sin regresión 2026-10-29.
- TASK-03 COMPLETED (openExternalMap.ts NUEVO + DetailMapCard.tsx reescrito). Humano validó CA-06 (recentrar anima al pin) y CA-07 (selector iOS / chooser Android; Cancelar sin crash) en Android + iOS 2026-10-29.
- Fase 4.5 = TASK-01, TASK-02, TASK-02b, TASK-03. TASK-04 es la ÚNICA restante.

TU ÚNICA MISIÓN: TASK-04 — arnés/auditoría de cierre de la Fase 4.5. CERO cambios de código de producto. Solo puedes escribir en tus 3 allowed_files de registro.

ALLOWED_FILES_TO_EDIT (ESTRICTO):
- spec/features/nav-back-mapa-tools/task.md
- progress/current-task.json
- progress/history.md

SECUENCIA:
1. Arnés: `npx tsc --noEmit` → debe ser exit 0; `npx eslint .` → exit 0 sin warnings.
2. Bans (git grep sobre src/**/*.ts, src/**/*.tsx y App.tsx): any=0, TouchableOpacity=0, FlatList=0, expo-router=0, estimatedItemSize=0; className=0 en los archivos tocados por la fase.
3. Gates deps/config vs baseline pre-Fase-4.5 (usa el commit inmediatamente anterior a TASK-01; verifícalo con `git log --oneline`):
   - package.json = SOLO suma expo-dev-client ~57.0.20.
   - app.json = SOLO suma ios.infoPlist.LSApplicationQueriesSchemes ["comgooglemaps","waze"].
   - app.config.js / eslint.config.js / metro.config.js / babel.config.js / tsconfig.json = VACÍO.
4. Features congeladas: diff acotado EXACTO a los allowed_files de TASK-01…03 (incl. las 2 eliminaciones de TASK-02b). Deben estar SIN CAMBIOS: AppDrawer.tsx, AppBrandBar.tsx, menuItems.ts, RootNavigator.tsx, navigation/types.ts, RadarMap.tsx/RadarSearchBar.tsx, ObraDetailContent.tsx, CursoDetailContent.tsx, DetailScreen.tsx y demás contenidos de detail, componentes de search, domain/application/infrastructure, compositionRoot.ts, App.tsx. AppShell.tsx solo con el cambio de TASK-02b (retiro del wrapper HeaderTitleProvider).
5. Inspección de código de CA-01…CA-05 (header back en Search/Detail, drawer inalcanzable fuera de Home, Home intacto, títulos INICIO/BÚQUEDA/DETALLE, cuerpos de pantalla sin fila de back). CA-06/CA-07/CA-08 YA FIRMADOS por el Humano en físico: NO los re-valides ni pidas dispositivo.
6. Registro: marca las checkboxes de TASK-04 en task.md y pon Status COMPLETED (o READY_FOR_REVIEW si encuentras desviaciones, describiéndolas); actualiza progress/current-task.json (harness_status.fase_4_5_task_04_run + last_run + current_roadmap_phase indicando Fase 4.5 CERRADA y Fase 5 NO abierta) y añade entrada en progress/history.md bajo "## Fase 4.5".

PROHIBICIONES ABSOLUTAS:
- NO modifiques código, configs, nativos ni archivos fuera de los 3 allowed_files. Si detectas una violación, REPÓRTALA, no la corrijas.
- NO instales dependencias. NO ejecutes `npx expo start` / `prebuild` / `run:*` (Humano exclusivo). NO hagas commit.
- NO inicies FASE 5 (detalle-municipal): su spec tiene el contrato §4.2 MARCADO PENDIENTE y requiere autorización del Humano.
- Cero any / TouchableOpacity / FlatList / className / expo-router.

ENTREGA (reporte final al Humano): (a) salida y exit code de tsc y eslint; (b) resultados de bans con recuento; (c) diff de package.json/app.json y confirmación de configs VACÍO vs baseline; (d) `git diff --name-status <baseline>` de src/ con veredicto feature-por-feature (congelada / esperada); (e) CA-01…CA-05 veredicto por inspección + nota de CA-06/07/08 firmados; (f) lista de desviaciones (si hay) y PARADA CONTROLADA al cierre.
